import axios from "axios";
import AxiosDataFetcher from "./AxiosDataFetcher";
import states from "../../src/states.json";
import states_abbreviations from "../../src/states_abbreviations.json";
import Location from "../models/location_data";
import { url } from "envalid";
import RealtorScraper from "./Scrapers/Realtor/RealtorScraper";
import PropertyScraper from "./PropertyScraper";
import RealtorLocationSuggestion from "../models/location/realtor_location_suggestion";
import LocationSuggestion from "../models/location/location_suggestion";

type Polygon = [number, number][][];
type MultiPolygon = Polygon[];

export default class LocationService {
  // private readonly SUGGESTION_SERVICE_URL =
  //   "https://www.zillowstatic.com/autocomplete/v3/suggestions?q=";
  private readonly SUGGESTION_SERVICE_URL =
    "https://parser-external.geo.moveaws.com/suggest?client_id=rdc-home&input=";
  private readonly LOCATION_SERVICE_URL =
    "https://www.realtor.com/api/v1/maps/area";
  private dataFetcher: AxiosDataFetcher;
  private states: { [state: string]: string };
  private states_abbreviations: { [state: string]: string };
  private propertyScraper: PropertyScraper;

  constructor() {
    this.dataFetcher = new AxiosDataFetcher();
    this.states = states as { [state: string]: string };
    this.states_abbreviations = states_abbreviations as {
      [state: string]: string;
    };
    this.propertyScraper = new RealtorScraper();
  }

  public getLocationSuggestions = async (searchTerm: string) => {
    const url = `${this.SUGGESTION_SERVICE_URL}${searchTerm}`;
    const requestParameters = {
      method: "GET",
      url: url,
    };
    const urlData = await this.dataFetcher.tryFetch(
      requestParameters,
      this.validateSuggestionsData,
    );
    const suggestions = await this.extractSuggestionsData(urlData);
    return suggestions;
  };

  public getLocationData = async (
    type: string,
    city: string,
    state: string,
    neighborhood: string,
  ) => {
    const requestParameters = await this.getRequestParameters(
      type,
      city,
      state,
      neighborhood,
    );
    console.log(`url: ${requestParameters?.url}`);
    const urlData = await this.dataFetcher.tryFetch(
      requestParameters!,
      this.validateLocationData,
    );
    const locationData = await this.extractLocationData(urlData);
    const location = {
      city,
      state,
      ...locationData,
    };
    return location;
  };

  private getRequestParameters = async (
    type: string,
    state: string,
    city: string,
    neighborhood: string,
  ) => {
    const stateAbbreviation = this.states[state!];
    if (type === "city") {
      return this.getCityRequestParameters(
        city,
        stateAbbreviation,
      );
    } else if (type === "neighborhood") {
      return this.getNeighborhoodRequestParameters(
        city!,
        neighborhood!,
        stateAbbreviation,
      );
    }
  };

  private validateSuggestionsData = (data: any) => {
    try {
      const locationSuggestions: any = data["autocomplete"];
      return locationSuggestions !== undefined;
    } catch (error) {}
    return false;
  };

  private validateLocationData = (data: any) => {
    try {
      const locationData: any = data["result"]["areas"];
      return locationData !== undefined;
    } catch (error) {}
    return false;
  };

  private extractSuggestionsData = (data: any) => {
    try {
      const locationSuggestions: RealtorLocationSuggestion[] =
        data["autocomplete"];
      // for (const locationSuggestion of locationSuggestions) {
      //   locationSuggestion.metaData.state =
      //     this.states_abbreviations[locationSuggestion.metaData.state];
      // }
      const suggestions: LocationSuggestion[] = locationSuggestions.map(
        (locationSuggestion: RealtorLocationSuggestion) => {
          const type = locationSuggestion.area_type;
          const city = locationSuggestion.city;
          const neighborhood = locationSuggestion.neighborhood;
          const addressLine = locationSuggestion.line;
          const zipCode = locationSuggestion.postal_code;
          const state =
            this.states_abbreviations[locationSuggestion.state_code];
          const locationParts = [
            addressLine,
            neighborhood,
            city,
            locationSuggestion.state_code,
            zipCode,
          ];
          const display = locationParts.filter(Boolean).join(", ");
          return {
            type,
            display,
            city,
            neighborhood,
            addressLine,
            state,
            zipCode,
            latitude: locationSuggestion.centroid?.lat,
            longitude: locationSuggestion.centroid?.lon,
          };
        },
      );
      return suggestions;
    } catch (error) {
      return null;
    }
  };

  private extractLocationData = (data: any) => {
    try {
      const locationData: any = data["result"]["areas"][0];
      const boundaries: any = data["result"]["boundary"];
      const location: Location = {
        center: {
          latitude: locationData["center"]["lat"],
          longitude: locationData["center"]["lng"],
        },
        breakPoints: locationData["breakpoints"],
        bounds: this.parseBounds(boundaries),
        type: boundaries["type"],
      };
      return location;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  private parseBounds = (bounds: any) => {
    const type = bounds["type"];
    const boundsData = bounds["coordinates"];
    if (type === "MultiPolygon") {
      console.log(boundsData);
      const polygons = this.parseMultiPolygon(boundsData as MultiPolygon);
      return polygons;
    }
    const polygon = this.parsePolygon(boundsData as Polygon);
    return polygon;
  };

  private parseMultiPolygon = (multiPolygonData: MultiPolygon) => {
    console.log(multiPolygonData.length);
    const data = multiPolygonData.map((polygon: Polygon) =>
      this.parsePolygon(polygon)
    );
    return data;
  };

  private parsePolygon = (polygonData: Polygon) => {
    const polygon = polygonData.map((bound: [number, number][]) =>
      this.parseBoundary(bound)
    );
    return polygon;
  };

  private parseBoundary = (boundary: [number, number][]) => {
    const parsedBoundary = boundary.map((pointData: [number, number]) => {
      return pointData;
      return {
        latitude: pointData[0],
        longitude: pointData[1],
      };
    });
    return parsedBoundary;
  };
  private getAddressRequestParameters = async (
    display: string,
    stateAbbreviation: string,
  ) => {
    const propertyData = await this.propertyScraper.scrapeProperty(
      display,
      this.dataFetcher,
    );
    if (propertyData.neighborhood) {
      console.log("neighborhood: " + propertyData.neighborhood);
      const display = propertyData.neighborhood + ", " + propertyData.city;
      return this.getNeighborhoodRequestParameters(
        propertyData.city,
        display,
        stateAbbreviation,
      );
    } else {
      return this.getCityRequestParameters(
        propertyData.city,
        stateAbbreviation,
      );
    }
  };

  private getNeighborhoodRequestParameters(
    city: string,
    neighborhood: string,
    stateAbbreviation: string,
  ) {
    const cityName = city.replace(" ", "-");
    const neighborhoodName = neighborhood.replace(" ", "-");
    const urlParameters = "?area_type=neighborhood&slug_id=";
    const url =
      `${this.LOCATION_SERVICE_URL}${urlParameters}${neighborhoodName}_${cityName}_${stateAbbreviation}`;
    return {
      method: "GET",
      url: url,
    };
  }

  private getCityRequestParameters(city: string, stateAbbreviation: string) {
    const cityName = city.replace(" ", "-");
    const urlParameters = "?area_type=city&slug_id=";
    const url =
      `${this.LOCATION_SERVICE_URL}${urlParameters}${cityName}_${stateAbbreviation}`;
    return {
      method: "GET",
      url: url,
    };
  }
}
