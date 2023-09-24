import * as puppeteer from "puppeteer";
import { ZillowFilter, ZillowQuery, MapBounds } from "../../../models/zillow";
import queryParser from "query-string";
import {
  calcDaysDifferenceToISO,
  constructPropertyId,
  saveData,
  sleep,
} from "../../../utils/utils";
import { RegionInfo, RegionSelection } from "../../../models/region_info";
import RequestParameters from "../../../models/request_parameters";
import DataFetcher from "../../DataFetcher";
import PropertyScraper from "../../PropertyScraper";
import Property, { PropertyType, RealProperty } from "../../../models/property";
import RegionProperties from "../../../models/region_properties";
import RealtorProperty from "../../../models/realtorProperty";
import { addressToGeolocation } from "../../location_helper";
import states from "../../../states.json";
import ScrapeMetadata from "../../../models/scrape_metadata";
import RealtorAddressScraper from "./RealtorAddressScraper";

export default class RealtorScraper implements PropertyScraper {
  private readonly rootUrl =
    "https://www.realtor.com/api/v1/hulk_main_srp?schema=vesta";
  private readonly defaultQuery =
    "query ConsumerSearchMainQuery($query: HomeSearchCriteria!, $limit: Int, $offset: Int, $sort: [SearchAPISort], $sort_type: SearchSortType, $client_data: JSON, $bucket: SearchAPIBucket) {home_search: home_search(query: $query, sort: $sort, limit: $limit, offset: $offset, sort_type: $sort_type, client_data: $client_data, bucket: $bucket, ){count total results {property_id list_price rent_to_own{rent right_to_purchase provider} primary_photo (https: true){href} listing_id status permalink price_reduced_amount description{beds baths baths_full baths_half baths_1qtr baths_3qtr garage stories type sub_type lot_sqft sqft year_built sold_price sold_date name} location{address{line postal_code state state_code city coordinate {lat lon}} neighborhoods {name level} county {name fips_code}} flags{is_coming_soon is_pending is_foreclosure is_contingent is_new_construction is_new_listing (days: 14) is_price_reduced (days: 30) is_plan is_subdivision} list_date last_update_date coming_soon_date photos(limit: 5, https: true){href}}}}";
  private readonly defaultRequestJson: any = {
    query: this.defaultQuery,
    variables: {
      query: {
        // "status": ["for_sale", "ready_to_build"],
        status: ["for_sale", "for_rent", "sold"],
        // status: ["sold"],
        // type: [
        //   "condos",
        //   "condo_townhome_rowhome_coop",
        //   "multi_family",
        //   "single_family",
        //   "townhomes",
        //   "duplex_triplex",
        //   "mobile",
        //   "condo_townhome",
        // ],
        primary: true,
        search_location: { location: "Chicago, IL" },
        contingent: false,
        pending: false,
      },
      limit: 200,
      offset: 0,
      sort_type: "relevant",
      bucket: { sort: "modelF" },
      by_prop_type: ["home"],
    },
  };
  private states: { [state: string]: string };
  private addressScraper: RealtorAddressScraper;

  constructor() {
    this.states = states as { [state: string]: string };
    this.addressScraper = new RealtorAddressScraper();
  }

  public scrapeMetadata = async (
    regionProperties: RegionProperties,
    dataFetcher: DataFetcher
  ) => {
    const initRequestParameters = this.getRequestParameters(regionProperties);
    const maxTries = 25;
    const responseData = await dataFetcher.tryFetch(
      initRequestParameters,
      this.validateData,
      maxTries
    );
    const scrapingInfo = this.extractScrapingInfo(
      responseData,
      regionProperties
    );
    return scrapingInfo;
  };

  private extractScrapingInfo = (
    scrapingData: any,
    regionProperties: RegionProperties
  ) => {
    if (!scrapingData) throw Error("No data found");
    const totalProperties = scrapingData["data"]["home_search"]["total"];
    console.log(`Total properties to scrape: ${totalProperties}`);
    const totalPages = Math.ceil(totalProperties / 200);
    const scrapingInfo: ScrapeMetadata = {
      totalPages,
      regionProperties,
    };
    return scrapingInfo;
  };

  public scrapeProperty = async (display: string, dataFetcher: DataFetcher) => {
    const data = await this.addressScraper.getAddressData(display, dataFetcher);
    return data;
  };

  public scrapeProperties = async (
    scrapeInfo: ScrapeMetadata,
    dataFetcher: DataFetcher
  ) => {
    const maxTries = 25;
    const requestsParameters = this.getFullRequestParameters(scrapeInfo);
    let requests: Promise<any>[] = [];
    for (const requestParameters of requestsParameters) {
      const request = dataFetcher.tryFetch(
        requestParameters,
        this.validateData,
        maxTries
      );
      requests.push(request);
    }
    const propertiesResults = await Promise.all(requests);
    const properties = await this.parseProperties(
      [...propertiesResults],
      scrapeInfo.regionProperties
    );
    return properties as any;
  };

  private validateData = (data: any) => {
    try {
      const parsedData: any = data["data"]["home_search"]["results"];
      return parsedData !== undefined;
    } catch (error) {
      // throw Error('No data found');
    }
    return false;
  };

  private constructQuery = (regionProperties: RegionProperties) => {
    const requestQuery = this.defaultRequestJson;
    // if (regionProperties.isForSale) {
    //   requestQuery.variables.query.status[0] = "for_sale";
    //   if (regionProperties.forSalePropertiesMaxAge)
    //     requestQuery.variables.query["list_date"] = {
    //       min: calcDaysDifferenceToISO(
    //         regionProperties.forSalePropertiesMaxAge
    //       ),
    //     };
    // } else {
    //   requestQuery.variables.query.status[0] = "sold";
    //   if (regionProperties.soldPropertiesMaxAge)
    //     requestQuery.variables.query["list_date"] = {
    //       min: calcDaysDifferenceToISO(regionProperties.soldPropertiesMaxAge),
    //     };
    // }
    if (regionProperties.forSalePropertiesMaxAge) {
      requestQuery.variables.query["list_date"] = {
        min: calcDaysDifferenceToISO(regionProperties.forSalePropertiesMaxAge),
      };
    }
    requestQuery.variables.query.search_location.location =
      this.regionToAddress(
        regionProperties.display,
        regionProperties.type,
        regionProperties.city,
        regionProperties.state
      );
    return requestQuery;
  };

  private regionToAddress = (
    display: string,
    type: string,
    city: string,
    state: string
  ) => {
    if (type === "neighborhood") {
      const neighborhoodName = display.substring(0, display.indexOf(","));
      const address = `${neighborhoodName} ${city}, ${this.states[state]}`;
      return address;
    } else if (type === "zipcode") {
      const address = `${display}, ${city}, ${this.states[state]}`;
      return address;
    }
    const address = `${city}, ${this.states[state]}`;
    return address;
  };

  private getRequestParameters = (regionProperties: RegionProperties) => {
    const requestQuery = this.constructQuery(regionProperties);
    const requestParameters = {
      method: "POST",
      url: this.rootUrl,
      body: requestQuery,
    };
    return requestParameters;
  };

  private getFullRequestParameters = (scrapeInfo: ScrapeMetadata) => {
    const fullRequestParameters: RequestParameters[] = [];
    const totalPages = scrapeInfo.totalPages;
    const perPage = 200;
    let currentCount = 0;
    while (currentCount < totalPages * perPage) {
      const defaultRequestParameters = this.getRequestParameters(
        scrapeInfo.regionProperties
      );
      const requestParameters = this.paginate(
        defaultRequestParameters,
        currentCount
      );
      fullRequestParameters.push(JSON.parse(JSON.stringify(requestParameters)));
      currentCount += perPage;
    }
    return fullRequestParameters;
  };

  private paginate = (
    requestParameters: RequestParameters,
    startFrom: number
  ) => {
    requestParameters.body["variables"]["offset"] = startFrom;
    return requestParameters;
  };

  private parseProperties = async (
    propertiesResults: any,
    regionProperties: RegionProperties
  ) => {
    const properties: RealProperty[] = [];
    for (const propertiesResult of propertiesResults) {
      const results = propertiesResult["data"]["home_search"]["results"];
      // for (const propertyResult of results as RealtorProperty[]) {
      for (const propertyResult of results) {
        try {
          const property: RealProperty = {
            source_id: propertyResult.property_id,
            primaryImage: this.getImageUrl(propertyResult.primary_photo?.href),
            images:
              propertyResult.photos?.map((photo: any) =>
                this.getImageUrl(photo?.href)
              ) || [],
            property_type: propertyResult.description.type,
            sales_status: propertyResult.status,
            address_number: undefined,
            address_name: "",
            address_suffix: "",
            city: propertyResult.location.address.city?.toLowerCase(),
            unit_number: undefined,
            zipcode: propertyResult.location.address.postal_code,
            county: propertyResult.location.county?.name,
            sales_listing_price: propertyResult.list_price,
            sales_closing_price: propertyResult.description.sold_price,
            sales_date: propertyResult.sold_date,
            building_area: propertyResult.description.sqft,
            lot_size: propertyResult.description.lot_sqft,
            year_built: propertyResult.description.year_built,
            bedrooms: propertyResult.description.beds,
            full_bathrooms: propertyResult.description.baths_full,
            half_bathrooms: propertyResult.description.baths_half,
            address: propertyResult.location.address.line,
            floors: propertyResult.description.stories,
            pool: false,
            garages: propertyResult.description.garage,
            sales_days_on_market: propertyResult.list_date,
            source: "",
            rents_status: propertyResult.status,
            rents_listing_price: propertyResult.list_price,
            rents_closing_price: "",
            rents_days_on_market: propertyResult.list_date,
            rents_date: "",
            state: propertyResult.location.address.state_code,
            total_bathrooms: propertyResult.description.baths,
            latitude: propertyResult.location.address.coordinate?.lat,
            longitude: propertyResult.location.address.coordinate?.lon,
            flood_zone: "",
            neighborhood: propertyResult?.location?.neighborhoods?.[0].name,
          };
          // if (!propertyResult.location?.address?.line) {
          //     // console.log(propertyResult.location);
          //     continue;
          // }
          // const nullableParameters = await this.fillNullableParameters(propertyResult);
          // const property: Property | any = {
          //     forSale: regionProperties.isForSale,
          //     primaryImage: nullableParameters.primaryPhoto,
          //     images: nullableParameters.images,
          //     price: propertyResult.list_price,
          //     soldPrice: regionProperties.isForSale ? null : propertyResult.description.sold_price,
          //     address: propertyResult.location.address.line.toLowerCase(),
          //     street: nullableParameters.street,
          //     city: propertyResult.location.address.city.toLowerCase(),
          //     state: propertyResult.location.address.state.toLowerCase(),
          //     zipCode: +propertyResult.location.address.postal_code,
          //     type: nullableParameters.type,
          //     beds: nullableParameters.beds,
          //     baths: nullableParameters.baths,
          //     area: propertyResult.description.sqft,
          //     latitude: nullableParameters.latitude,
          //     longitude: nullableParameters.longitude,
          //     listingDate: propertyResult.list_date,
          //     soldDate: propertyResult.description.sold_date,
          // }
          console.log(property);
          // property['id'] = constructPropertyId(property.address, property.city, property.state, property.zipCode);
          const id = constructPropertyId(
            property.address,
            property.city || "",
            property.state || "",
            property.zipcode || ""
          );
          const propertyData = {
            ...property,
            id,
          };
          properties.push(propertyData);
        } catch (error) {
          console.log({
            error: "Parsing Realtor property",
            data: propertyResult,
            message: error,
          });
        }
      }
    }
    return properties;
  };

  private fillNullableParameters = async (propertyResult: RealtorProperty) => {
    const parameters = {
      primaryPhoto: this.getImageUrl(propertyResult.primary_photo?.href),
      images:
        propertyResult.photos?.map((photo) => this.getImageUrl(photo.href)) ||
        [],
      street: null,
      beds: propertyResult.description.beds ?? 0,
      baths: propertyResult.description.baths ?? 0,
      latitude: propertyResult.location.address.coordinate?.lat ?? 0,
      longitude: propertyResult.location.address.coordinate?.lon ?? 0,
      type: PropertyType.OTHER,
    };
    if (!parameters.latitude || !parameters.longitude) {
      // const coordinates = await addressToGeolocation(`${propertyResult.location.address.line} ${propertyResult.location.address.city} ${propertyResult.location.address.state} ${propertyResult.location.address.postal_code}`);
      // parameters.latitude = coordinates.latitude;
      // parameters.longitude = coordinates.longitude;
    }
    if (propertyResult.description.type) {
      parameters.type = this.parsePropertyType(propertyResult.description.type);
    }
    return parameters;
  };

  private getImageUrl = (url: any) => {
    if (!url) return "";
    const imageUrl = url.substring(0, url.length - 4) + "od-w480_h360_x2.webp";
    return imageUrl;
  };

  private parsePropertyType = (dataType: string) => {
    let type = PropertyType.OTHER;
    switch (dataType) {
      case "single_family":
        type = PropertyType.SINGLE_FAMILY;
        break;
      case "multi_family":
        type = PropertyType.MULTI_FAMILY;
        break;
      case "condos":
        type = PropertyType.CONDO;
        break;
      case "town_house":
        type = PropertyType.TOWN_HOUSE;
        break;
      case "mobile_house":
        type = PropertyType.MOBILE_HOUSE;
        break;
      default:
        type = PropertyType.OTHER;
        break;
    }
    return type;
  };
}
