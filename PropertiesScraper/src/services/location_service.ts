
import axios from 'axios';
import LocationSuggestion from '../models/location_suggestions';
import AxiosDataFetcher from './AxiosDataFetcher';
import states from '../../src/states.json';
import states_abbreviations from '../../src/states_abbreviations.json';
import Location from '../models/location_data';

export default class LocationService {

    private readonly SUGGESTION_SERVICE_URL = "https://www.zillowstatic.com/autocomplete/v3/suggestions?q=";
    private readonly LOCATION_SERVICE_URL = "https://www.realtor.com/api/v1/maps/area?area_type=city&slug_id=";
    private dataFetcher: AxiosDataFetcher;
    private states: { [state: string]: string };
    private states_abbreviations: { [state: string]: string };

    constructor() {
        this.dataFetcher = new AxiosDataFetcher();
        this.states = states as { [state: string]: string }
        this.states_abbreviations = states_abbreviations as { [state: string]: string }
    }

    public getLocationSuggestions = async (searchTerm: string) => {
        const url = `${this.SUGGESTION_SERVICE_URL}${searchTerm}`;
        const requestParameters = {
            method: 'GET',
            url: url
        }
        const urlData = await this.dataFetcher.tryFetch(requestParameters, this.validateSuggestionsData);
        const suggestions = await this.extractSuggestionsData(urlData);
        return suggestions;
    }

    public getLocationData = async (city: string, state: string) => {
        const stateAbbreviation = this.states[state];
        console.log(state);
        console.log(stateAbbreviation);
        const cityName = city.replace(' ', '-');
        const url = `${this.LOCATION_SERVICE_URL}${cityName}_${stateAbbreviation}`;
        console.log(url);
        const requestParameters = {
            method: 'GET',
            url: url
        }
        const urlData = await this.dataFetcher.tryFetch(requestParameters, this.validateLocationData);
        const locationData = await this.extractLocationData(urlData);
        const location = {
            city,
            state,
            ...locationData,
        }
        return location;
    }

    private validateSuggestionsData = (data: any) => {
        try {
            const locationSuggestions: any = data['results'];
            return locationSuggestions !== undefined;
        } catch (error) { }
        return false;
    }

    private validateLocationData = (data: any) => {
        try {
            const locationData: any = data['result']['areas'];
            return locationData !== undefined;
        } catch (error) { }
        return false;
    }

    private extractSuggestionsData = (data: any) => {
        try {
            const locationSuggestions: LocationSuggestion[] = data['results'];
            for (const locationSuggestion of locationSuggestions) {
                locationSuggestion.metaData.state = this.states_abbreviations[locationSuggestion.metaData.state];
            }
            return locationSuggestions;
        } catch (error) {
            return null;
        }
    }

    private extractLocationData = (data: any) => {
        try {
            const locationData: any = data['result']['areas'][0];
            const boundaries: any = data['result']['boundary'];
            const location: Location = {
                center: {
                    latitude: locationData['center']['lat'],
                    longitude: locationData['center']['lng']
                },
                breakPoints: locationData['breakpoints'],
                bounds: this.parseBounds(boundaries)
            }
            return location;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    private parseBounds = (bounds: any) => {
        const type = bounds['type'];
        const boundsData = bounds['coordinates'];
        if (type === 'MultiPolygon') {
            console.log(boundsData)
            const polygons = this.parseMultiPolygon(boundsData);
            return polygons;
        }
        const polygon = this.parsePolygon(boundsData);
        return polygon;
    }

    private parseMultiPolygon = (polygonData: any) => {
        console.log(polygonData.length)
        const multiPolygon = polygonData.map((polygon: any) => this.parseMultiPolygon(polygon));
        return multiPolygon;
    }


    private parsePolygon = (polygonData: any) => {
        const polygon = polygonData.map((bound: any) => this.parseBoundary(bound));
        return polygon;
    }


    private parseBoundary = (polygonData: any) => {
        const boundary = polygonData.map((pointData: any) => {
            return {
                latitude: pointData[0],
                longitude: pointData[1]
            }
        });
        return boundary;
    }
}
