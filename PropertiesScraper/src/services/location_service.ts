
import axios from 'axios';
import LocationSuggestion from '../models/location_suggestions';
import AxiosDataFetcher from './AxiosDataFetcher';

export default class LocationService {

    private readonly SUGGESTION_SERVICE_URL = "https://www.zillowstatic.com/autocomplete/v3/suggestions?q=";
    private dataFetcher: AxiosDataFetcher;

    constructor() {
        this.dataFetcher = new AxiosDataFetcher();
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
            return locationSuggestions;
        } catch (error) {
            return null;
        }
    }
}
