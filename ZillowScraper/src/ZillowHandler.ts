import * as puppeteer from "puppeteer";
import Utils from "./utils";
import { ZillowFilter, ZillowQuery, MapBounds } from "./models/zillow";
import queryParser from 'query-string';


export default class ZillowHandler {

    private readonly rootUrl = 'https://www.zillow.com/search/GetSearchPageState.htm';
    private readonly defaultFilterValues = { "doz": { "value": "6m" }, "isAllHomes": { "value": true }, "isCondo": { "value": false }, "isMultiFamily": { "value": false }, "isManufactured": { "value": false }, "isLotLand": { "value": false }, "isTownhouse": { "value": false }, "isApartment": { "value": false }, "isApartmentOrCondo": { "value": false }, "monthlyPayment": { "min": 0 } };
    private readonly soldFilterParameters = { "isRecentlySold": { "value": true }, "isForSaleByAgent": { "value": false }, "isForSaleByOwner": { "value": false }, "isNewConstruction": { "value": false }, "isComingSoon": { "value": false }, "isAuction": { "value": false }, "isForSaleForeclosure": { "value": false } }

    constructor() {

    }

    private mewo = () => {

    }


    public constructZillowUrlQuery = (zillowSearchUrl: string, zillowFilter: ZillowFilter, forSale: boolean) => {
        const parsedQuery = queryParser.parseUrl(zillowSearchUrl).query;
        const emptyQuery = {} as ZillowQuery;
        const zillowQuery = this.generateZillowQuery(zillowSearchUrl, emptyQuery, forSale);
        zillowQuery.filterState = { ...zillowQuery.filterState, ...zillowFilter };
        parsedQuery['searchQueryState'] = JSON.stringify(zillowQuery);
        const modifiedUrl = queryParser.stringifyUrl({ url: this.rootUrl, query: parsedQuery });
        return modifiedUrl;
    }

    private generateZillowQuery = (zillowSearchUrl: string, zillowQuery: ZillowQuery, forSale: boolean) => {
        const parsedQuery = queryParser.parseUrl(zillowSearchUrl).query;
        const searchQueryString = parsedQuery['searchQueryState'] as string
        const searchQuery = JSON.parse(searchQueryString) as ZillowQuery;
        const defaultPagination = { currentPage: 1 };
        let defaultFilterParameters = this.defaultFilterValues;
        if (!forSale) defaultFilterParameters = { ...defaultFilterParameters, ...this.soldFilterParameters };
        zillowQuery.mapBounds = searchQuery.mapBounds;
        zillowQuery.regionSelection = searchQuery.regionSelection;
        zillowQuery.usersSearchTerm = searchQuery.usersSearchTerm;
        zillowQuery.pagination = defaultPagination;
        zillowQuery.filterState = defaultFilterParameters as ZillowFilter;
        return zillowQuery;
    }

    public paginateZillowUrl = (zillowUrl: string, page: number) => {
        const paginationIndex = zillowUrl.indexOf('currentPage') + '"currentPage":'.length;
        const bracketHex = '%7D';
        const colonHex = '%3A';
        const endPaginationIndex = zillowUrl.indexOf(bracketHex, paginationIndex);
        const url = `${zillowUrl.substring(0, paginationIndex)}${colonHex}${page}${zillowUrl.substring(endPaginationIndex)}`;
        return url;
    }

    public getZillowApi = async () => {
        const url = 'https://www.zillow.com/';
        const browser = await this.launchBrowser();
        try {
            const page = await browser.newPage();
            await this.searchZillowAddress(url, 'Homewood', page);
        } catch (error) {

        }
    }

    private launchBrowser = async () => {
        const browser = await puppeteer.launch({
            'headless': false, 'slowMo': 500, 'args': [
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
                '--enable-automation'
            ]
        });
        return browser;
    }

    private searchZillowAddress = async (url: string, address: string, page: puppeteer.Page, pageOptions?: (puppeteer.WaitForOptions & { referer?: string | undefined; }) | undefined) => {
        await page.goto(url, pageOptions);
        const inputSelector = 'input[id=search-box-input]';
        await page.waitForSelector(inputSelector);
        await page.type(inputSelector, address);
        await page.keyboard.press('Enter');
        await Utils.sleep(10000);
    }
}