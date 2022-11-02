import * as puppeteer from "puppeteer";
import axios from 'axios'
import fs from 'fs';
import House from "./models/house";
import * as randomUserAgent from 'random-useragent'
import DataFetcher from "./DataFetcher";
import DealsFinder from "./DealsFinder";
import Utils from "./utils";

export default class ZillowScraper {

    private dataFetcher: DataFetcher;
    private dealsFinder: DealsFinder;

    constructor() {
        this.dataFetcher = new DataFetcher();
        this.dealsFinder = new DealsFinder();
    }

    private extractData = (data: any) => {
        try {
            const parsedData = data['cat1']['searchResults']['listResults'];
            const house: House = parsedData;
            house.latitude = parsedData.latLong.latitude
            house.longitude = parsedData.latLong.latitude

        } catch (error) {
            return null;
        }
    }

    private constructUrl = (page: number, forSale: boolean) => {
        // const forSaleUrl = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{"currentPage":${page}},"usersSearchTerm":"Birmingham, AL","mapBounds":{"west":-87.79621130078125,"east":-85.90106969921875,"south":33.214022144972844,"north":33.82767874963706},"regionSelection":[{"regionId":10417,"regionType":6}],"isMapVisible":true,"filterState":{"price":{"min":800000},"monthlyPayment":{"min":4162},"doz":{"value":"6m"},"sortSelection":{"value":"globalrelevanceex"},"isAllHomes":{"value":true},"isCondo":{"value":false},"isMultiFamily":{"value":false},"isManufactured":{"value":false},"isLotLand":{"value":false},"isTownhouse":{"value":false},"isApartment":{"value":false},"isApartmentOrCondo":{"value":false}},"isListVisible":true,"mapZoom":9}&wants={"cat1":["listResults","mapResults"],"cat2":["total"]}&requestId=6`
        // const soldUrl = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{"currentPage":${page}},"usersSearchTerm":"Birmingham, AL","mapBounds":{"west":-87.79621130078125,"east":-85.90106969921875,"south":33.214022144972844,"north":33.82767874963706},"regionSelection":[{"regionId":10417,"regionType":6}],"isMapVisible":true,"filterState":{"price":{"min":800000},"monthlyPayment":{"min":4162},"doz":{"value":"6m"},"sortSelection":{"value":"globalrelevanceex"},"isAllHomes":{"value":true},"isCondo":{"value":false},"isMultiFamily":{"value":false},"isManufactured":{"value":false},"isLotLand":{"value":false},"isTownhouse":{"value":false},"isApartment":{"value":false},"isApartmentOrCondo":{"value":false},"isRecentlySold":{"value":true},"isForSaleByAgent":{"value":false},"isForSaleByOwner":{"value":false},"isNewConstruction":{"value":false},"isComingSoon":{"value":false},"isAuction":{"value":false},"isForSaleForeclosure":{"value":false}},"isListVisible":true,"mapZoom":9}&wants={"cat1":["listResults","mapResults"]}&requestId=5`
        const forSaleUrl = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{"currentPage":${page}},"usersSearchTerm":"Mountain Brook, AL","mapBounds":{"west":-86.85832285009766,"east":-86.62143014990235,"south":33.44075406126867,"north":33.522650856663496},"regionSelection":[{"regionId":26027,"regionType":6}],"isMapVisible":true,"filterState":{"price":{"min":0},"monthlyPayment":{"min":4162},"doz":{"value":"6m"},"sortSelection":{"value":"globalrelevanceex"},"isAllHomes":{"value":true},"isCondo":{"value":false},"isMultiFamily":{"value":false},"isManufactured":{"value":false},"isLotLand":{"value":false},"isTownhouse":{"value":false},"isApartment":{"value":false},"isApartmentOrCondo":{"value":false}},"isListVisible":true,"mapZoom":12}&wants={"cat1":["listResults","mapResults"]}&requestId=2`;
        const soldUrl = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{"currentPage":${page}},"usersSearchTerm":"Mountain Brook, AL","mapBounds":{"west":-86.85832285009766,"east":-86.62143014990235,"south":33.44075406126867,"north":33.522650856663496},"regionSelection":[{"regionId":26027,"regionType":6}],"isMapVisible":true,"filterState":{"price":{"min":800000},"monthlyPayment":{"min":4162},"doz":{"value":"6m"},"sortSelection":{"value":"globalrelevanceex"},"isAllHomes":{"value":true},"isCondo":{"value":false},"isMultiFamily":{"value":false},"isManufactured":{"value":false},"isLotLand":{"value":false},"isTownhouse":{"value":false},"isApartment":{"value":false},"isApartmentOrCondo":{"value":false},"isRecentlySold":{"value":true},"isForSaleByAgent":{"value":false},"isForSaleByOwner":{"value":false},"isNewConstruction":{"value":false},"isComingSoon":{"value":false},"isAuction":{"value":false},"isForSaleForeclosure":{"value":false}},"isListVisible":true,"mapZoom":12}&wants={"cat1":["listResults","mapResults"]}&requestId=3`;
        if (forSale) return forSaleUrl;
        return soldUrl;
    }

    public getData = async () => {
        let page = 1;
        let forSaleResults: House[] = [];
        let soldResults: House[] = [];

        while (page < 5) {
            console.log(page);
            const url = this.constructUrl(page, true);
            const listResults = await this.dataFetcher.tryFetch(url, this.extractData);
            for (const result of listResults) {
                forSaleResults.push(result);
            }
            page++;
        }
        page = 1;
        while (page < 5) {
            console.log(page);
            const url = this.constructUrl(page, false);
            const listResults = await this.dataFetcher.tryFetch(url, this.extractData);
            // if (mapResults.length == 0) break;
            for (const result of listResults) {
                soldResults.push(result)
            }
            page++;
        }
        const deals = await this.dealsFinder.findDeals(soldResults, forSaleResults, 2, 40);
        Utils.saveData(deals, 'deals');
        console.log('finished, deals: \n');
        console.log(deals);
    }


}
