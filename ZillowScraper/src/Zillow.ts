import House from "./models/house";
import DataFetcher from "./DataFetcher";
import DealsFinder from "./DealsFinder";
import Utils from "./utils";

export default class ZillowEngine {

    private readonly DEAFULT_MAX_PAGES = 5;
    private dataFetcher: DataFetcher;
    private dealsFinder: DealsFinder;

    constructor() {
        this.dataFetcher = new DataFetcher();
        this.dealsFinder = new DealsFinder();
    }

    private extractData = (data: any) => {
        try {
            const parsedData: any = data['cat1']['searchResults']['listResults'];
            const parsedMetaData: any = data['cat1']['searchResults']['searchList'];
            const houses: House[] = [];
            for (const parsedHouse of parsedData) {
                const house = parsedHouse as House;
                house.latitude = parsedHouse['latLong']['latitude'];
                house.longitude = parsedHouse['latLong']['longitude'];
                house.price = parsedHouse['unformattedPrice'];
                house.maxPagination = parsedMetaData['totalPages'];
                houses.push(house);
                console.log(house.maxPagination);
            }
            return houses;
        } catch (error) {
            return null;
        }
    }

    private constructSoldUrl = (page: number) => {
        // const url = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{"currentPage":${page}},"usersSearchTerm":"Mountain Brook, AL","mapBounds":{"west":-86.85832285009766,"east":-86.62143014990235,"south":33.44075406126867,"north":33.522650856663496},"regionSelection":[{"regionId":26027,"regionType":6}],"isMapVisible":true,"filterState":{"price":{"min":800000},"monthlyPayment":{"min":4162},"doz":{"value":"6m"},"sortSelection":{"value":"globalrelevanceex"},"isAllHomes":{"value":true},"isCondo":{"value":false},"isMultiFamily":{"value":false},"isManufactured":{"value":false},"isLotLand":{"value":false},"isTownhouse":{"value":false},"isApartment":{"value":false},"isApartmentOrCondo":{"value":false},"isRecentlySold":{"value":true},"isForSaleByAgent":{"value":false},"isForSaleByOwner":{"value":false},"isNewConstruction":{"value":false},"isComingSoon":{"value":false},"isAuction":{"value":false},"isForSaleForeclosure":{"value":false}},"isListVisible":true,"mapZoom":12}&wants={"cat1":["listResults","mapResults"]}&requestId=3`;
        // const url = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{"currentPage":${page}},"usersSearchTerm":"Vestavia Hills, AL","mapBounds":{"west":-88.63484610156249,"east":-84.84456289843749,"south":32.81912623401839,"north":34.084050085449675},"regionSelection":[{"regionId":14382,"regionType":6}],"isMapVisible":true,"filterState":{"price":{"min":800000},"monthlyPayment":{"min":0,"max":4176},"doz":{"value":"6m"},"sortSelection":{"value":"globalrelevanceex"},"isForSaleByAgent":{"value":false},"isForSaleByOwner":{"value":false},"isNewConstruction":{"value":false},"isForSaleForeclosure":{"value":false},"isComingSoon":{"value":false},"isAuction":{"value":false},"isRecentlySold":{"value":true},"isAllHomes":{"value":true},"isCondo":{"value":false},"isMultiFamily":{"value":false},"isManufactured":{"value":false},"isLotLand":{"value":false},"isTownhouse":{"value":false},"isApartment":{"value":false},"isApartmentOrCondo":{"value":false}},"isListVisible":true,"mapZoom":8}&wants={"cat1":["listResults","mapResults"]}&requestId=27`;
        const url = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{"currentPage":${page}},"usersSearchTerm":"Homewood, AL","mapBounds":{"west":-87.04522820019533,"east":-86.5714427998047,"south":33.378340728271134,"north":33.53645153996474},"regionSelection":[{"regionId":45794,"regionType":6}],"isMapVisible":true,"filterState":{"doz":{"value":"6m"},"sortSelection":{"value":"globalrelevanceex"},"isAllHomes":{"value":true},"isCondo":{"value":false},"isMultiFamily":{"value":false},"isManufactured":{"value":false},"isLotLand":{"value":false},"isTownhouse":{"value":false},"isApartment":{"value":false},"isApartmentOrCondo":{"value":false},"isRecentlySold":{"value":true},"isForSaleByAgent":{"value":false},"isForSaleByOwner":{"value":false},"isNewConstruction":{"value":false},"isComingSoon":{"value":false},"isAuction":{"value":false},"isForSaleForeclosure":{"value":false},"price":{"min":500000},"monthlyPayment":{"min":2619,"max":3143}},"isListVisible":true,"mapZoom":11}&wants={"cat1":["listResults","mapResults"]}&requestId=6`;
        return url;
    }

    private constructForSaleUrl = (page: number) => {
        // const url = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{"currentPage":${page}},"usersSearchTerm":"Mountain Brook, AL","mapBounds":{"west":-86.85832285009766,"east":-86.62143014990235,"south":33.44075406126867,"north":33.522650856663496},"regionSelection":[{"regionId":26027,"regionType":6}],"isMapVisible":true,"filterState":{"price":{"min":0},"monthlyPayment":{"min":4162},"doz":{"value":"6m"},"sortSelection":{"value":"globalrelevanceex"},"isAllHomes":{"value":true},"isCondo":{"value":false},"isMultiFamily":{"value":false},"isManufactured":{"value":false},"isLotLand":{"value":false},"isTownhouse":{"value":false},"isApartment":{"value":false},"isApartmentOrCondo":{"value":false}},"isListVisible":true,"mapZoom":12}&wants={"cat1":["listResults","mapResults"]}&requestId=2`;
        // const url = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{"currentPage":${page}},"usersSearchTerm":"Vestavia Hills, AL","mapBounds":{"west":-88.63484610156249,"east":-84.84456289843749,"south":32.81912623401839,"north":34.084050085449675},"regionSelection":[{"regionId":14382,"regionType":6}],"isMapVisible":true,"filterState":{"price":{"min":0},"monthlyPayment":{"min":0},"doz":{"value":"6m"},"sortSelection":{"value":"globalrelevanceex"},"isAllHomes":{"value":true},"isCondo":{"value":false},"isMultiFamily":{"value":false},"isManufactured":{"value":false},"isLotLand":{"value":false},"isTownhouse":{"value":false},"isApartment":{"value":false},"isApartmentOrCondo":{"value":false}},"isListVisible":true,"mapZoom":8}&wants={"cat1":["listResults","mapResults"],"cat2":["total"]}&requestId=29`;
        const url = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{"currentPage":${page}},"usersSearchTerm":"Homewood, AL","mapBounds":{"west":-87.04522820019533,"east":-86.5714427998047,"south":33.378340728271134,"north":33.53645153996474},"regionSelection":[{"regionId":45794,"regionType":6}],"isMapVisible":true,"filterState":{"doz":{"value":"6m"},"sortSelection":{"value":"globalrelevanceex"},"isAllHomes":{"value":true},"isCondo":{"value":false},"isMultiFamily":{"value":false},"isManufactured":{"value":false},"isLotLand":{"value":false},"isTownhouse":{"value":false},"isApartment":{"value":false},"isApartmentOrCondo":{"value":false}},"isListVisible":true,"mapZoom":11}&wants={"cat1":["listResults","mapResults"],"cat2":["total"]}&requestId=3`;
        return url;
    }

    private getForSaleHousesData = async () => {
        let page = 1;
        let forSaleResults: { [id: string]: House } = {};
        let maxPages = this.DEAFULT_MAX_PAGES;
        while (page <= maxPages) {
            console.log(page);
            const url = this.constructForSaleUrl(page);
            const listResults = await this.dataFetcher.tryFetch(url, this.extractData);
            if (listResults) maxPages = (listResults as House).maxPagination;
            for (const result of listResults) {
                forSaleResults[result.zpid] = result
            }
            page++;
        }
        return Object.values(forSaleResults);
    }

    private getSoldHousesData = async () => {
        let page = 1;
        let soldHouseResults: { [id: string]: House } = {};
        let maxPages = this.DEAFULT_MAX_PAGES;
        while (page <= maxPages) {
            console.log(page);
            const url = this.constructSoldUrl(page);
            const listResults = await this.dataFetcher.tryFetch(url, this.extractData);
            if (listResults) maxPages = (listResults as House).maxPagination;
            for (const result of listResults) {
                soldHouseResults[result.zpid] = result
            }
            page++;
        }
        return Object.values(soldHouseResults);
    }

    public getDeals = async () => {
        const forSaleHouseResults = await this.getForSaleHousesData();
        const soldHouseResults = await this.getSoldHousesData();
        const deals = await this.dealsFinder.findDeals(soldHouseResults, forSaleHouseResults, 2, 40);
        Utils.saveData(deals, 'deals');
        console.log('finished, deals: \n');
        console.log(deals.map(deal => {
            return deal.house.detailUrl
        }));
    }

}
