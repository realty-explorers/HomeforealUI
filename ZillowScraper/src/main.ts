import * as dotenv from "dotenv";
import Engine from "./Engine";

dotenv.config();
const engine = new Engine();
const zillowSearchUrl = 'https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{"currentPage":1},"usersSearchTerm":"Homewood, AL","mapBounds":{"west":-87.04522820019533,"east":-86.5714427998047,"south":33.378340728271134,"north":33.53645153996474},"regionSelection":[{"regionId":45794,"regionType":6}],"isMapVisible":true,"filterState":{"doz":{"value":"6m"},"sortSelection":{"value":"globalrelevanceex"},"isAllHomes":{"value":true},"isCondo":{"value":false},"isMultiFamily":{"value":false},"isManufactured":{"value":false},"isLotLand":{"value":false},"isTownhouse":{"value":false},"isApartment":{"value":false},"isApartmentOrCondo":{"value":false}},"isListVisible":true,"mapZoom":11}&wants={"cat1":["listResults","mapResults"],"cat2":["total"]}&requestId=3';
engine.getDeals(2, 40, zillowSearchUrl, undefined, undefined, '6m');
// engine.scrape();