import * as puppeteer from "puppeteer";
import { ZillowFilter, ZillowQuery, MapBounds } from "../models/zillow";
import queryParser from 'query-string';
import { calcDaysDifferenceToISO, constructPropertyId, saveData, sleep } from "../utils/utils";
import { RegionInfo, RegionSelection } from "../models/region_info";
import RequestParameters from "../models/request_parameters";
import DataFetcher from "./DataFetcher";
import PropertyScraper from "./PropertyScraper";
import Property from "../models/property";
import RegionProperties from "../models/region_properties";
import RealtorProperty from "../models/realtorProperty";
import { addressToGeolocation } from "./location_helper";
import states from '../../src/states.json';
import ScrapeMetadata from "../models/scrape_metadata";


export default class RealtorScraper implements PropertyScraper {

    private readonly rootUrl = 'https://www.realtor.com/api/v1/hulk_main_srp?schema=vesta';
    private readonly defaultQuery = 'query ConsumerSearchMainQuery($query: HomeSearchCriteria!, $limit: Int, $offset: Int, $sort: [SearchAPISort], $sort_type: SearchSortType, $client_data: JSON, $bucket: SearchAPIBucket) {home_search: home_search(query: $query, sort: $sort, limit: $limit, offset: $offset, sort_type: $sort_type, client_data: $client_data, bucket: $bucket, ){count total results {property_id list_price rent_to_own{rent right_to_purchase provider} primary_photo (https: true){href} listing_id status permalink price_reduced_amount description{beds baths baths_full baths_half baths_1qtr baths_3qtr garage stories type sub_type lot_sqft sqft year_built sold_price sold_date name} location{address{line postal_code state state_code city coordinate {lat lon}} county {name fips_code}} flags{is_coming_soon is_pending is_foreclosure is_contingent is_new_construction is_new_listing (days: 14) is_price_reduced (days: 30) is_plan is_subdivision} list_date last_update_date coming_soon_date photos(limit: 5, https: true){href}}}}';
    private readonly defaultRequestJson: any = {
        "query": this.defaultQuery,
        "variables": {
            "query": {
                "status": ["for_sale", "ready_to_build"],
                "type": ["condos", "condo_townhome_rowhome_coop", "multi_family", "single_family", "townhomes", "duplex_triplex", "mobile", "condo_townhome"],
                "primary": true,
                "search_location": { "location": "Chicago, IL" },
                "contingent": false,
                "pending": false
            },
            "limit": 200,
            "offset": 0,
            "sort_type": "relevant",
            "bucket": { "sort": "modelF" },
            "by_prop_type": ["home"],
        },
    }
    private states: { [state: string]: string };

    constructor() {
        this.states = states as { [state: string]: string }
    }

    public scrapeMetadata = async (regionProperties: RegionProperties, dataFetcher: DataFetcher) => {
        const initRequestParameters = this.getRequestParameters(regionProperties);
        const maxTries = 25;
        const responseData = await dataFetcher.tryFetch(initRequestParameters, this.validateData, maxTries);
        const scrapingInfo = this.extractScrapingInfo(responseData, regionProperties);
        return scrapingInfo;
    }

    private extractScrapingInfo = (scrapingData: any, regionProperties: RegionProperties) => {
        if (!scrapingData) throw Error('No data found');
        const totalProperties = scrapingData['data']['home_search']['total'];
        console.log(`Total properties to scrape: ${totalProperties}`);
        const totalPages = Math.ceil(totalProperties / 200);
        const scrapingInfo: ScrapeMetadata = {
            totalPages,
            regionProperties
        }
        return scrapingInfo;
    }

    public scrapeProperties = async (scrapeInfo: ScrapeMetadata, dataFetcher: DataFetcher) => {
        const maxTries = 25;
        const requestsParameters = this.getFullRequestParameters(scrapeInfo);
        let requests: Promise<any>[] = [];
        for (const requestParameters of requestsParameters) {
            console.log(requestParameters)
            console.log(JSON.stringify(requestParameters))
            const request = dataFetcher.tryFetch(requestParameters, this.validateData, maxTries);
            requests.push(request);
        }
        const propertiesResults = await Promise.all(requests);
        const properties = await this.parseProperties([...propertiesResults], scrapeInfo.regionProperties);
        return properties;
    }

    private validateData = (data: any) => {
        try {
            const parsedData: any = data['data']['home_search']['results'];
            return parsedData !== undefined;
        } catch (error) {
            // throw Error('No data found');
        }
        return false;
    }

    private constructQuery = (regionProperties: RegionProperties) => {
        const requestQuery = this.defaultRequestJson;
        if (regionProperties.isForSale) {
            requestQuery.variables.query.status[0] = 'for_sale';
            if (regionProperties.forSalePropertiesMaxAge)
                requestQuery.variables.query["list_date"] = { "min": calcDaysDifferenceToISO(regionProperties.forSalePropertiesMaxAge) };
        } else {
            requestQuery.variables.query.status[0] = 'sold';
            if (regionProperties.soldPropertiesMaxAge)
                requestQuery.variables.query["list_date"] = { "min": calcDaysDifferenceToISO(regionProperties.soldPropertiesMaxAge) };
        }
        requestQuery.variables.query.search_location.location = this.regionToAddress(regionProperties.display, regionProperties.type, regionProperties.city, regionProperties.state);
        return requestQuery;
    }

    private regionToAddress = (display: string, type: string, city: string, state: string) => {
        if (type === 'neighborhood') {
            const neighborhoodName = display.substring(0, display.indexOf(','));
            const address = `${neighborhoodName} ${city}, ${this.states[state]}`;
            return address;
        }
        const address = `${city}, ${this.states[state]}`;
        return address;
    }

    private getRequestParameters = (regionProperties: RegionProperties) => {
        const requestQuery = this.constructQuery(regionProperties)
        const requestParameters = {
            method: 'POST',
            url: this.rootUrl,
            body: requestQuery
        }
        return requestParameters;
    }

    private getFullRequestParameters = (scrapeInfo: ScrapeMetadata) => {
        const fullRequestParameters: RequestParameters[] = [];
        const total = scrapeInfo.totalPages;
        const pageCount = 200;
        let currentCount = 0;
        while (currentCount < total) {
            const defaultRequestParameters = this.getRequestParameters(scrapeInfo.regionProperties);
            const requestParameters = this.paginate(defaultRequestParameters, currentCount);
            fullRequestParameters.push(JSON.parse(JSON.stringify(requestParameters)));
            currentCount += pageCount;
        }
        return fullRequestParameters;
    }

    private paginate = (requestParameters: RequestParameters, startFrom: number) => {
        requestParameters.body['variables']['offset'] = startFrom;
        return requestParameters;
    }

    private parseProperties = async (propertiesResults: any, regionProperties: RegionProperties) => {
        const properties: Property[] = [];
        for (const propertiesResult of propertiesResults) {
            const results = propertiesResult['data']['home_search']['results'];
            for (const propertyResult of results as RealtorProperty[]) {
                try {
                    if (!propertyResult.location?.address?.line) {
                        // console.log(propertyResult.location);
                        continue;
                    }
                    const nullableParameters = await this.fillNullableParameters(propertyResult);
                    const property: Property | any = {
                        forSale: regionProperties.isForSale,
                        primaryImage: nullableParameters.primaryPhoto,
                        price: propertyResult.list_price,
                        address: propertyResult.location.address.line.toLowerCase(),
                        street: nullableParameters.street,
                        city: propertyResult.location.address.city.toLowerCase(),
                        state: propertyResult.location.address.state.toLowerCase(),
                        zipCode: +propertyResult.location.address.postal_code,
                        beds: nullableParameters.beds,
                        baths: nullableParameters.baths,
                        area: propertyResult.description.sqft,
                        latitude: nullableParameters.latitude,
                        longitude: nullableParameters.longitude,
                        listingDate: propertyResult.list_date
                    }
                    property['id'] = constructPropertyId(property.address, property.city, property.state, property.zipCode);
                    properties.push(property);
                } catch (error) {
                    console.log({
                        error: 'Parsing Realtor property',
                        data: propertyResult,
                        message: error
                    });
                }
            }
        }
        return properties;
    }

    private fillNullableParameters = async (propertyResult: RealtorProperty) => {
        const parameters = {
            primaryPhoto: propertyResult.primary_photo?.href ?? '',
            street: null,
            beds: propertyResult.description.beds ?? 0,
            baths: propertyResult.description.baths ?? 0,
            latitude: propertyResult.location.address.coordinate?.lat ?? 0,
            longitude: propertyResult.location.address.coordinate?.lon ?? 0,
        }
        if (!propertyResult.primary_photo?.href) {
            parameters.primaryPhoto = ''
        } else {
            //TODO: handle errors with length and substring
            const photoUrl = propertyResult.primary_photo.href;
            parameters.primaryPhoto = photoUrl.substring(0, photoUrl.length - 4) + 'od-w480_h360_x2.webp';
        }
        if (!parameters.latitude || !parameters.longitude) {
            // const coordinates = await addressToGeolocation(`${propertyResult.location.address.line} ${propertyResult.location.address.city} ${propertyResult.location.address.state} ${propertyResult.location.address.postal_code}`);
            // parameters.latitude = coordinates.latitude;
            // parameters.longitude = coordinates.longitude;
        }
        return parameters;
    }

}