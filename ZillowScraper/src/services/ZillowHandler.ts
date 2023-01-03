import * as puppeteer from "puppeteer";
import { ZillowFilter, ZillowQuery, MapBounds } from "../models/zillow";
import queryParser from 'query-string';
import { sleep } from "../utils/utils";
import { RegionInfo, RegionSelection } from "../models/region_info";


export default class ZillowHandler {

    private readonly rootUrl = 'https://www.zillow.com/search/GetSearchPageState.htm';
    private readonly defaultFilterValues = { "doz": { "value": "6m" }, "isAllHomes": { "value": true }, "isCondo": { "value": false }, "isMultiFamily": { "value": false }, "isManufactured": { "value": false }, "isLotLand": { "value": false }, "isTownhouse": { "value": false }, "isApartment": { "value": false }, "isApartmentOrCondo": { "value": false }, "monthlyPayment": { "min": 0 } };
    private readonly soldFilterParameters = { "isRecentlySold": { "value": true }, "isForSaleByAgent": { "value": false }, "isForSaleByOwner": { "value": false }, "isNewConstruction": { "value": false }, "isComingSoon": { "value": false }, "isAuction": { "value": false }, "isForSaleForeclosure": { "value": false } }

    constructor() {

    }

    public constructZillowUrlQuery = (regionInfo: RegionInfo, zillowFilter: ZillowFilter, forSale: boolean) => {
        const parsedQuery = queryParser.parseUrl(this.rootUrl).query;
        const emptyQuery = {} as ZillowQuery;
        const zillowQuery = this.generateZillowQuery(regionInfo, emptyQuery, forSale);
        zillowQuery.filterState = { ...zillowQuery.filterState, ...zillowFilter };
        parsedQuery['searchQueryState'] = JSON.stringify(zillowQuery);
        parsedQuery['wants'] = JSON.stringify(this.constructZillowRequestQueryParameters());
        const modifiedUrl = queryParser.stringifyUrl({ url: this.rootUrl, query: parsedQuery });
        return modifiedUrl;
    }

    private constructZillowRequestQueryParameters = () => {
        const requestQuery = { "cat1": ["listResults", "mapResults"] };
        return requestQuery;
    }

    public constructZillowRegionUrlQuery = (regionId: number) => {
        let query: any = {};
        const regionSelection = { regionId } as RegionSelection;
        const zillowRegionQuery = this.generateZillowRegionQuery([regionSelection]);
        query['searchQueryState'] = JSON.stringify(zillowRegionQuery);
        query['wants'] = JSON.stringify(this.constructZillowRequestQueryParameters());
        const modifiedUrl = queryParser.stringifyUrl({ url: this.rootUrl, query });
        return modifiedUrl;
    }

    private generateZillowQuery = (regionInfo: RegionInfo, zillowQuery: ZillowQuery, forSale: boolean) => {
        const searchQuery = {} as ZillowQuery;
        const defaultPagination = { currentPage: 1 };
        let defaultFilterParameters = this.defaultFilterValues;
        if (!forSale) defaultFilterParameters = { ...defaultFilterParameters, ...this.soldFilterParameters };
        // zillowQuery.mapBounds = searchQuery.mapBounds;
        // zillowQuery.regionSelection = searchQuery.regionSelection;
        zillowQuery.mapBounds = regionInfo.regionState.regionBounds;
        zillowQuery.regionSelection = regionInfo.regionState.regionInfo;
        zillowQuery.usersSearchTerm = searchQuery.usersSearchTerm;
        zillowQuery.pagination = defaultPagination;
        zillowQuery.filterState = defaultFilterParameters as ZillowFilter;
        return zillowQuery;
    }

    private generateZillowRegionQuery = (regionSelection: RegionSelection[]) => {
        const query = {} as ZillowQuery;
        query.regionSelection = regionSelection;
        return query;
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
                max: maxPrice
            },
        } as ZillowFilter;
        return zillowFilter;
    }

    public getZillowApi = async () => {
        const url = 'https://www.zillow.com/woodstock-al/sold/?searchQueryState={"pagination":{},"usersSearchTerm":"Woodstock, AL"}';
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
        console.log('started search');
        await page.goto(url, pageOptions);
        await sleep(10000);
        console.log('end');
        const inputSelector = 'input[id=search-box-input]';
        await page.waitForSelector(inputSelector);
        await page.type(inputSelector, address);
        await page.keyboard.press('Enter');
    }
}