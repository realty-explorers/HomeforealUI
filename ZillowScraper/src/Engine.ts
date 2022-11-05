import House from "./models/house";
import { ZillowFilter, ZillowQuery, MapBounds } from './models/zillow';
import DataFetcher from "./DataFetcher";
import DealsFinder from "./DealsFinder";
import Utils from "./utils";
import LocationHelper from "./LocationHelper";
import zillowHandler from "./ZillowHandler";
import * as queryParser from "query-string"

export default class Engine {

    private readonly DEFAULT_MAX_PAGES = 5;
    private dataFetcher: DataFetcher;
    private dealsFinder: DealsFinder;
    private locationHelper: LocationHelper;
    private zillowHandler: zillowHandler;

    constructor() {
        this.dataFetcher = new DataFetcher();
        this.dealsFinder = new DealsFinder();
        this.locationHelper = new LocationHelper();
        this.zillowHandler = new zillowHandler();
    }

    public getDeals = async (distance: number, profit: number, zillowSearchUrl: string, minPrice?: number, maxPrice?: number, daysOnZillow?: string) => {
        const zillowFilter = this.zillowHandler.constructZillowFilter(minPrice, maxPrice, daysOnZillow);
        const forSaleZillowSearchUrl = this.zillowHandler.constructZillowUrlQuery(zillowSearchUrl, zillowFilter, true);
        const soldZillowSearchUrl = this.zillowHandler.constructZillowUrlQuery(zillowSearchUrl, zillowFilter, false);
        const forSaleHouseResults = await this.getHousesData(forSaleZillowSearchUrl, zillowFilter);
        const soldHouseResults = await this.getHousesData(soldZillowSearchUrl, zillowFilter);
        const deals = await this.dealsFinder.findDeals(soldHouseResults, forSaleHouseResults, distance, profit);
        Utils.saveData(deals, 'deals');
        console.log('finished, deals: \n');
        console.log(deals.map(deal => {
            return {
                url: deal.house.detailUrl,
                profit: deal.profit
            }
        }));
    }

    private getHousesData = async (zillowSearchUrl: string, zillowFilter: ZillowFilter) => {
        let page = 1;
        let housesResults: { [id: string]: House } = {};
        let maxPages = this.DEFAULT_MAX_PAGES;
        while (page <= maxPages) {
            const url = this.zillowHandler.paginateZillowUrl(zillowSearchUrl, page);
            const listResults = await this.dataFetcher.tryFetch(url, this.extractData);
            const housesData = await this.fillHousesData(listResults);
            if (housesData.length > 0) maxPages = housesData[0].maxPagination;
            for (const house of housesData) {
                housesResults[house.zpid] = house;
            }
            page++;
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

}
