import House from "../models/house";
import DataFetcher from "./DataFetcher";
import DealsEngine from "./DealsEngine";
import LocationHelper from "./LocationHelper";
import zillowHandler from "./ZillowHandler";
import { sleep, saveData } from '../utils/utils';
import { RegionInfo, RegionSelection } from "../models/region_info";

export default class DealsFinder {

    private readonly DEFAULT_MAX_PAGES = 5;
    private dataFetcher: DataFetcher;
    private dealsFinder: DealsEngine;
    private locationHelper: LocationHelper;
    private zillowHandler: zillowHandler;

    constructor() {
        this.dataFetcher = new DataFetcher();
        this.dealsFinder = new DealsEngine();
        this.locationHelper = new LocationHelper();
        this.zillowHandler = new zillowHandler();
    }

    public findProperties = async (regionId: number) => {
        const regionInfo: RegionInfo = await this.getRegionData(regionId);
        const completeZillowFilter = this.zillowHandler.constructCompleteZillowFilter();
        const forSaleZillowSearchUrl = this.zillowHandler.constructZillowUrlQuery(regionInfo, completeZillowFilter, true);
        const soldZillowSearchUrl = this.zillowHandler.constructZillowUrlQuery(regionInfo, completeZillowFilter, false);
        const [forSaleHouseResults, soldHouseResults] = await Promise.all([this.getHousesData(forSaleZillowSearchUrl), this.getHousesData(soldZillowSearchUrl)]);
        return {
            forSale: forSaleHouseResults,
            sold: soldHouseResults
        }
    }

    public findPropertiesProxy = async (regionId: number) => {
        const regionInfo: RegionInfo = await this.getRegionDataProxy(regionId);
        const completeZillowFilter = this.zillowHandler.constructCompleteZillowFilter();
        const forSaleZillowSearchUrl = this.zillowHandler.constructZillowUrlQuery(regionInfo, completeZillowFilter, true);
        const soldZillowSearchUrl = this.zillowHandler.constructZillowUrlQuery(regionInfo, completeZillowFilter, false);
        const [forSaleHouseResults, soldHouseResults] = await Promise.all([this.getHousesDataProxy(forSaleZillowSearchUrl), this.getHousesDataProxy(soldZillowSearchUrl)]);
        return {
            forSale: forSaleHouseResults,
            sold: soldHouseResults
        }
    }

    public findDeals = async (soldProperties: House[], forSaleProperties: House[], distance: number, profit: number, soldMinPrice?: number, soldMaxPrice?: number, propertyMinPrice?: number, propertyMaxPrice?: number, soldAge?: string, forSaleAge?: string, minArea?: number, maxArea?: number, minBeds?: number, maxBeds?: number, minBaths?: number, maxBaths?: number) => {
        const deals = await this.dealsFinder.findDeals(soldProperties, forSaleProperties, distance, profit, soldMinPrice, soldMaxPrice, propertyMinPrice, propertyMaxPrice, soldAge, forSaleAge, minArea, maxArea, minBeds, maxBeds, minBaths, maxBaths);
        saveData(deals, 'deals');
        console.log('finished, deals: \n');
        console.log(deals.map(deal => {
            return {
                url: deal.house.detailUrl,
                profit: deal.profit
            }
        }));
        return deals;
    }

    // public findNewDeals = async (regionId: number, distance: number, profit: number, soldMinPrice?: number, soldMaxPrice?: number, propertyMinPrice?: number, propertyMaxPrice?: number, daysOnZillow?: string) => {
    //     const regionInfo: RegionInfo = await this.getRegionData(regionId);
    //     const soldZillowFilter = this.zillowHandler.constructZillowFilter(soldMinPrice, soldMaxPrice, daysOnZillow);
    //     const forSaleZillowFilter = this.zillowHandler.constructZillowFilter(undefined, undefined, daysOnZillow);
    //     const forSaleZillowSearchUrl = this.zillowHandler.constructZillowUrlQuery(regionInfo, forSaleZillowFilter, true);
    //     const soldZillowSearchUrl = this.zillowHandler.constructZillowUrlQuery(regionInfo, soldZillowFilter, false);
    //     const [forSaleHouseResults, soldHouseResults] = await Promise.all([this.getHousesData(forSaleZillowSearchUrl), this.getHousesData(soldZillowSearchUrl)]);
    //     const deals = await this.dealsFinder.findDeals(soldHouseResults, forSaleHouseResults, distance, profit, propertyMinPrice, propertyMaxPrice);
    //     saveData(deals, 'deals');
    //     console.log('finished, deals: \n');
    //     console.log(deals.map(deal => {
    //         return {
    //             url: deal.house.detailUrl,
    //             profit: deal.profit
    //         }
    //     }));
    //     return deals;
    // }

    private getRegionData = async (regionId: number) => {
        const regionZillowSearchUrl = this.zillowHandler.constructZillowRegionUrlQuery(regionId);
        console.log(regionZillowSearchUrl);
        const results = await this.dataFetcher.tryFetch(regionZillowSearchUrl, this.extractRegionData, 25);
        return results;
    }

    private getRegionDataProxy = async (regionId: number) => {
        const regionZillowSearchUrl = this.zillowHandler.constructZillowRegionUrlQuery(regionId);
        console.log(regionZillowSearchUrl);
        const results = await this.dataFetcher.tryFetchProxy(regionZillowSearchUrl, this.extractRegionData, 25);
        return results;
    }

    private getHousesDataProxy = async (zillowSearchUrl: string) => {
        let housesResults: { [id: string]: House } = {};
        let maxPages = this.DEFAULT_MAX_PAGES;
        const fetches: Promise<any>[] = [];
        const urlData = await this.dataFetcher.tryFetch(zillowSearchUrl, this.validateData, 25);
        if (urlData == null) throw Error('No data found');
        const listResults = await this.extractData(urlData);
        const housesData = await this.fillHousesData(listResults);
        if (housesData.length > 0) maxPages = housesData[0].maxPagination;
        for (const house of housesData) {
            housesResults[house.zpid] = house;
        }
        console.log(`max page: ${maxPages}`);
        for (let page = 2; page <= maxPages; page++) {
            const url = this.zillowHandler.paginateZillowUrl(zillowSearchUrl, page);
            const fetchProcess = this.dataFetcher.tryFetch(url, this.validateData, 25);
            fetches.push(fetchProcess);
        }
        const results = await Promise.all(fetches);
        for (const result of results) {
            console.log("meow results");
            const listResults = await this.extractData(result);
            for (const house of housesData) {
                housesResults[house.zpid] = house;
            }
            console.log(listResults?.length);
        }

        return Object.values(housesResults);
    }

    private getHousesData = async (zillowSearchUrl: string) => {
        let housesResults: { [id: string]: House } = {};
        let maxPages = this.DEFAULT_MAX_PAGES;
        const fetches: Promise<any>[] = [];
        const urlData = await this.dataFetcher.tryFetch(zillowSearchUrl, this.validateData, 25);
        if (urlData == null) throw Error('No data found');
        const listResults = await this.extractData(urlData);
        const housesData = await this.fillHousesData(listResults);
        if (housesData.length > 0) maxPages = housesData[0].maxPagination;
        for (const house of housesData) {
            housesResults[house.zpid] = house;
        }
        console.log(`max page: ${maxPages}`);
        for (let page = 2; page <= maxPages; page++) {
            const url = this.zillowHandler.paginateZillowUrl(zillowSearchUrl, page);
            const fetchProcess = this.dataFetcher.tryFetch(url, this.validateData, 25);
            fetches.push(fetchProcess);
        }
        const results = await Promise.all(fetches);
        for (const result of results) {
            console.log("meow results");
            const listResults = await this.extractData(result);
            for (const house of housesData) {
                housesResults[house.zpid] = house;
            }
            console.log(listResults?.length);
        }

        return Object.values(housesResults);
    }

    private fillHousesData = async (housesResults: any) => {
        const houses: House[] = []
        for (const house of housesResults) {
            try {
                if (!house.longitude || !house.latitude) {
                    const apiCoordinates = await this.locationHelper.addressToGeolocation(house.address);
                    house.latitude = apiCoordinates.latitude;
                    house.longitude = apiCoordinates.longitude;
                }
                houses.push(house);
            } catch (error) {

            }
        }
        return houses;
    }

    private validateData = (data: any) => {
        try {
            const parsedData: any = data['cat1']['searchResults']['listResults'];
            const parsedMetaData: any = data['cat1']['searchList'];
            return parsedData && parsedMetaData;
        } catch (error) { }
        return false;
    }

    private extractData = (data: any) => {
        try {
            const parsedData: any = data['cat1']['searchResults']['listResults'];
            const parsedMetaData: any = data['cat1']['searchList'];
            const houses: House[] = [];
            for (const parsedHouse of parsedData) {
                const house = parsedHouse as House;
                house.latitude = parsedHouse['latLong']['latitude'];
                house.longitude = parsedHouse['latLong']['longitude'];
                house.price = parsedHouse['unformattedPrice'];
                house.maxPagination = parsedMetaData['totalPages'];
                houses.push(house);
            }
            return houses;
        } catch (error) {
            return null;
        }
    }

    private extractRegionData = (data: any) => {
        try {
            const parsedData: any = data;
            return data;
        } catch (error) {
            return null;
        }
    }

}
