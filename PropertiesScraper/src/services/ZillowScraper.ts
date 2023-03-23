import * as puppeteer from "puppeteer";
import { ZillowFilter, ZillowQuery, MapBounds } from "../models/zillow";
import queryParser from 'query-string';
import { RegionInfo, RegionSelection } from "../models/region_info";
import RequestParameters from "../models/request_parameters";
import PropertyScraper from "./PropertyScraper";
import DataFetcher from "./DataFetcher";
import Property from "../models/property";
import ZillowHouse from "../models/zillowHouse";
import RegionProperties from "../models/region_properties";
import { addressToGeolocation } from "./location_helper";
import states from '../../src/states.json';
import { constructPropertyId } from "../utils/utils";


export default class ZillowScraper implements PropertyScraper {

    private readonly ROOT_URL = 'https://www.zillow.com/search/GetSearchPageState.htm';
    private readonly DEFAULT_FILTER_VALUES = { "doz": { "value": "6m" }, "isAllHomes": { "value": true }, "isCondo": { "value": false }, "isMultiFamily": { "value": false }, "isManufactured": { "value": false }, "isLotLand": { "value": false }, "isTownhouse": { "value": false }, "isApartment": { "value": false }, "isApartmentOrCondo": { "value": false }, "monthlyPayment": { "min": 0 } };
    private readonly SOLD_FILTER_VALUES = { "isRecentlySold": { "value": true }, "isForSaleByAgent": { "value": false }, "isForSaleByOwner": { "value": false }, "isNewConstruction": { "value": false }, "isComingSoon": { "value": false }, "isAuction": { "value": false }, "isForSaleForeclosure": { "value": false } }
    private readonly SUGGESTION_SERVICE_URL = "https://www.zillowstatic.com/autocomplete/v3/suggestions?q=";
    private states: { [state: string]: string };

    constructor() {
        this.states = states as { [state: string]: string }
    }

    public scrapeProperties = async (regionProperties: RegionProperties, dataFetcher: DataFetcher) => {
        const regionData = await this.getRegionData(this.regionToAddress(regionProperties.city, regionProperties.state), dataFetcher);
        const initRequestParameters = this.getRequestParameters(regionProperties, regionData);
        const maxTries = 25;
        console.log('Fetching first page');
        const responseData = await dataFetcher.tryFetch(initRequestParameters, this.validateData, maxTries);
        const requestsParameters = this.getFullRequestParameters(responseData, regionProperties, regionData);
        console.log('Fetching all pages');
        const requests: Promise<any>[] = [];
        for (const requestParameter of requestsParameters) {
            const request = dataFetcher.tryFetch(requestParameter, this.validateData, maxTries);
            requests.push(request);
        }
        const propertiesResults = await Promise.all(requests);
        const properties = await this.parseProperties([responseData, ...propertiesResults]);
        return properties;
    }

    private regionToAddress = (city: string, state: string) => {
        const address = `${city}, ${this.states[state]}`;
        return address;
    }


    private getRegionData = async (address: string, dataFetcher: DataFetcher) => {
        const regionId = await this.getRegionId(address, dataFetcher);
        const zillowRegionUrl = this.constructZillowRegionUrlQuery(regionId);
        const requestParameters = {
            url: zillowRegionUrl,
            method: 'GET'
        };
        console.log('Fetching Zillow region info');
        const results = await dataFetcher.tryFetch(requestParameters, this.validateRegionData, 1);
        return results;
    }

    private getRegionId = async (address: string, dataFetcher: DataFetcher) => {
        const url = `${this.SUGGESTION_SERVICE_URL}${address}`;
        const requestParameters = {
            url: url,
            method: 'GET'
        };
        console.log('Fetching Zillow region ID');
        const data = await dataFetcher.tryFetch(requestParameters, this.validateRegionIdData);
        const regionId = data['results'][0]['metaData']['regionId'];
        return regionId;
    }

    private validateRegionData = (data: any) => {
        return data !== null;
    }

    private validateRegionIdData = (data: any) => {
        return data['results'];
    }

    public constructZillowRegionUrlQuery = (regionId: number) => {
        let query: any = {};
        const regionSelection = { regionId } as RegionSelection;
        const zillowRegionQuery = this.generateZillowRegionQuery([regionSelection]);
        query['searchQueryState'] = JSON.stringify(zillowRegionQuery);
        query['wants'] = JSON.stringify(this.constructZillowRequestQueryParameters());
        const modifiedUrl = queryParser.stringifyUrl({ url: this.ROOT_URL, query });
        return modifiedUrl;
    }

    private generateZillowRegionQuery = (regionSelection: RegionSelection[]) => {
        const query = {} as ZillowQuery;
        query.regionSelection = regionSelection;
        return query;
    }

    public getRequestParameters = (regionProperties: RegionProperties, regionData: any,) => {
        const requestQuery = this.constructQuery(regionProperties, regionData);
        const url = this.constructRequestUrl(requestQuery)
        const requestParameters = {
            method: 'GET',
            url: url,
        }
        return requestParameters;
    }

    public constructQuery = (regionProperties: RegionProperties, regionData: any) => {
        const maxDaysOnZillow = '24m';
        let zillowFilter = {
            doz: {
                value: maxDaysOnZillow
            },
        } as ZillowFilter;

        let zillowQuery = {} as ZillowQuery;
        const defaultPagination = { currentPage: 1 };
        if (!regionProperties.isForSale) {
            zillowFilter = { ...zillowFilter, ...this.SOLD_FILTER_VALUES };
        }
        zillowQuery.mapBounds = regionData['regionState']['regionBounds'];
        zillowQuery.regionSelection = regionData['regionState']['regionInfo'];
        // zillowQuery.usersSearchTerm = searchQuery.usersSearchTerm;
        zillowQuery.pagination = defaultPagination;
        zillowQuery.filterState = zillowFilter;
        return zillowQuery;
    }

    private constructRequestUrl = (requestQuery: ZillowQuery) => {
        const parsedQuery = queryParser.parseUrl(this.ROOT_URL).query;
        parsedQuery['searchQueryState'] = JSON.stringify(requestQuery);
        parsedQuery['wants'] = JSON.stringify(this.constructZillowRequestQueryParameters());
        const requestUrl = queryParser.stringifyUrl({ url: this.ROOT_URL, query: parsedQuery });
        return requestUrl;
    }

    private constructZillowRequestQueryParameters = () => {
        const requestQuery = { "cat1": ["listResults"] };
        return requestQuery;
    }

    private validateData = (data: any) => {
        try {
            const parsedData: any = data['cat1']['searchResults']['listResults'];
            const parsedMetaData: any = data['cat1']['searchList'];
            return parsedData && parsedMetaData;
        } catch (error) { }
        return false;
    }

    private getFullRequestParameters = (requestResult: any, regionProperties: RegionProperties, regionData: any) => {
        const fullRequestParameters = [];
        const total = requestResult['cat1']['searchList']['totalPages'];
        console.log(`Total requests: ${total}`)
        const pageCount = 1;
        let currentCount = 2;
        while (currentCount < total) {
            const defaultRequestParameters = this.getRequestParameters(regionProperties, regionData);
            const requestParameters = this.paginate(defaultRequestParameters, currentCount);
            fullRequestParameters.push(requestParameters);
            currentCount += pageCount;
        }
        return fullRequestParameters;
    }

    private paginate = (requestParameters: RequestParameters, page: number) => {
        const paginationIndex = requestParameters.url.indexOf('currentPage') + '"currentPage":'.length;
        const bracketHex = '%7D';
        const colonHex = '%3A';
        const endPaginationIndex = requestParameters.url.indexOf(bracketHex, paginationIndex);
        requestParameters.url = `${requestParameters.url.substring(0, paginationIndex)}${colonHex}${page}${requestParameters.url.substring(endPaginationIndex)}`;
        return requestParameters;
    }



    public paginateZillowUrl = (zillowUrl: string, page: number) => {
        const paginationIndex = zillowUrl.indexOf('currentPage') + '"currentPage":'.length;
        const bracketHex = '%7D';
        const colonHex = '%3A';
        const endPaginationIndex = zillowUrl.indexOf(bracketHex, paginationIndex);
        const url = `${zillowUrl.substring(0, paginationIndex)}${colonHex}${page}${zillowUrl.substring(endPaginationIndex)}`;
        return url;
    }

    public constructZillowFilter = (minPrice?: number, maxPrice?: number, daysOnZillow?: string) => {
        const zillowFilter = {
            doz: {
                value: daysOnZillow
            },
            price: {
                min: minPrice,
            },
        } as ZillowFilter;
        if (maxPrice && maxPrice !== 0) zillowFilter.price.max = maxPrice;
        return zillowFilter;
    }

    private parseProperties = async (propertiesResults: any) => {
        const properties: Property[] = [];
        for (const propertiesResult of propertiesResults) {
            const results = propertiesResult['cat1']['searchResults']['listResults'];
            for (const propertyResult of results as ZillowHouse[]) {
                const nullableParameters = await this.fillNullableParameters(propertyResult);
                const property: Property | any = {
                    primaryImage: propertyResult.imgSrc,
                    price: propertyResult.price,
                    address: propertyResult.address.toLowerCase(),
                    street: propertyResult.addressStreet.toLowerCase(),
                    city: propertyResult.addressCity.toLowerCase(),
                    state: propertyResult.addressState.toLowerCase(),
                    zipCode: +propertyResult.addressZipcode,
                    beds: propertyResult.beds,
                    baths: propertyResult.baths,
                    area: propertyResult.area,
                    latitude: nullableParameters.latitude,
                    longitude: nullableParameters.longitude,
                    listingDate: nullableParameters.listingDate,
                }
                property['id'] = constructPropertyId(property.address, property.city, property.state, property.zipCode);
                properties.push(property);
            }
        }
        return properties;
    }

    private fillNullableParameters = async (propertyResult: ZillowHouse) => {
        const parameters = {
            latitude: propertyResult.hdpData?.homeInfo?.latitude,
            longitude: propertyResult.hdpData?.homeInfo?.longitude,
            listingDate: new Date().toISOString()
        }
        const propertyDaysOnZillow = propertyResult.hdpData?.homeInfo?.daysOnZillow;
        if (!parameters.latitude || !parameters.longitude) {
            const coordinates = await addressToGeolocation(propertyResult.address);
            parameters.latitude = coordinates.latitude;
            parameters.longitude = coordinates.longitude;
        }
        if (propertyDaysOnZillow && propertyDaysOnZillow === -1) {
            parameters.listingDate = this.calcListingDate(+parameters.listingDate);
        }
        return parameters;
    }

    private calcListingDate = (daysOnZillow: number) => {
        const daysToMilliseconds = 24 * 60 * 60 * 1000;
        const timeDifference = Date.now() - daysOnZillow * daysToMilliseconds;
        const listingDate = new Date(Date.now() - timeDifference);
        return listingDate.toISOString();
    }

}