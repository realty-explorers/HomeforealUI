
import axios from 'axios';
import LocationSuggestion from '../models/location_suggestions';
import AxiosDataFetcher from './AxiosDataFetcher';
import states_abbreviations from '../../src/states_abbreviations.json';

export default class LocationService {

    private readonly SUGGESTION_SERVICE_URL = "https://www.zillowstatic.com/autocomplete/v3/suggestions?q=";
    private dataFetcher: AxiosDataFetcher;
    private states_abbreviations: { [state: string]: string };

    constructor() {
        this.dataFetcher = new AxiosDataFetcher();
        this.states_abbreviations = states_abbreviations as { [state: string]: string }
    }

    public getLocationSuggestions = async (searchTerm: string) => {
        const url = `${this.SUGGESTION_SERVICE_URL}${searchTerm}`;
        const requestParameters = {
            method: 'GET',
            url: url
        }
        const urlData = await this.dataFetcher.tryFetch(requestParameters, this.validateData);
        const suggestions = await this.extractData(urlData);
        return suggestions;
    }

    private validateData = (data: any) => {
        try {
            const locationSuggestions: any = data['results'];
            return locationSuggestions !== undefined;
        } catch (error) { }
        return false;
    }

    private extractData = (data: any) => {
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
}
