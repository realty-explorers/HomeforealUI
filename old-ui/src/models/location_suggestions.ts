interface LocationSuggestion {
    "display": string;
    "resultType": string;
    "metaData": {
        "regionId": number;
        "regionType": string;
        "city": string;
        "county": string;
        "state": string;
        "country": string;
        "zipCode": number;
        "lat": number;
        "lng": number;
    }
}
export default LocationSuggestion;