import axios from 'axios';

const api_url = `/api`;

const findProperties = async (city: string, state: string) => {
    return axios.post(`${api_url}/properties/findProperties`, {
        city, state
    }, {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        withCredentials: true,
        timeout: 120000
    });
};

const findDeals = async (regionId: number, distance: number, profit: number, soldMinPrice?: number, soldMaxPrice?: number, propertyMinPrice?: number, propertyMaxPrice?: number, soldAge?: number, forSaleAge?: number, minArea?: number, maxArea?: number, minBeds?: number, maxBeds?: number, minBaths?: number, maxBaths?: number) => {
    return axios.post(`${api_url}/properties/findDeals`, {
        regionId, profit, distance, soldMinPrice, soldMaxPrice, propertyMinPrice, propertyMaxPrice, forSaleAge, soldAge, minArea, maxArea, minBeds, maxBeds, minBaths, maxBaths
    }, {
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        withCredentials: true,
        timeout: 120000
    });
};

const getLocationSuggestions = async (searchTerm: string) => {
    return axios.get(`${api_url}/location/suggest?searchTerm=${searchTerm}`, {
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        withCredentials: true
    });
};

export {
    findDeals, findProperties, getLocationSuggestions
};
