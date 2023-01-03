
import axios from 'axios';
import LocationSuggestion from '../models/location_suggestions';
import DataFetcher from './DataFetcher';

export default class LocationService {

    private readonly SUGGESTION_SERVICE_URL = "https://www.zillowstatic.com/autocomplete/v3/suggestions?q=";
    private dataFetcher: DataFetcher;

    constructor() {
        this.dataFetcher = new DataFetcher();
    }

    public getLocationSuggestions = async (searchTerm: string) => {
        const url = `${this.SUGGESTION_SERVICE_URL}${searchTerm}`;
        const suggestions = await this.dataFetcher.tryFetch(url, this.extractData);
        return suggestions;
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
