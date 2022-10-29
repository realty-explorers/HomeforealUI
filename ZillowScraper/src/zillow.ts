import * as puppeteer from "puppeteer";
import axios from 'axios'
import fs from 'fs';
import House from "./models/house";
import * as randomUserAgent from 'random-useragent'

export default class ZillowScraper {

    AD_BLOCKER_PATH = process.env.ADBLOCKER_PATH;
    USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36';
    ROOT_URL = 'https://www.zillow.com/homes/';
    ZILLOW_API_KEY = 'X1-ZWz1iu7iwb10qz_9r65p';
    private userAgent;

    constructor() {
        // this.userAgent = randomUserAgent.getRandom();
        this.userAgent = this.USER_AGENT;
        axios.interceptors.request.use(function (config) {
            // Do something before request is sent
            return config;
        }, function (error) {
            // Do something with request error
            return Promise.reject(error);
        });
    }

    public scrape = async () => {
        const browser = await this.launchBrowser();
        const pageLoadedOption = { waitUntil: 'networkidle0' };
        try {
            const page = await browser.newPage();
            await this.setupPageOptions(page);
            await this.breachUrl(this.ROOT_URL, page);
            await this.searchProperty(page);

        } catch (err) {
            console.log((err));
        } finally {
            await browser.close();
            console.log(("Browser Closed"));
        }
    }

    private launchBrowser = async () => {
        const browser = await puppeteer.launch({
            'headless': false, 'slowMo': 500, 'args': [
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
                // `--disable-extensions-except=${this.AD_BLOCKER_PATH}`,
                // `--load-extension=${this.AD_BLOCKER_PATH}`,
                '--enable-automation'
            ]
        });
        return browser;
    }

    private setupPageOptions = async (page: puppeteer.Page) => {
        // await page.setUserAgent(this.USER_AGENT);
        await page.exposeFunction("saveData", this.saveData);
        await page.exposeFunction("sleep", this.sleep);
        // await this.enablePageLogs(page);
    }

    private breachUrl = async (url: string, page: puppeteer.Page, pageOptions?: (puppeteer.WaitForOptions & { referer?: string | undefined; }) | undefined) => {
        await page.goto(url, pageOptions);
        const pageTitle = await page.title();
        const hasCaptcha = pageTitle.includes("Captcha");
        if (hasCaptcha) await this.solveCaptcha(page);
    }

    private solveCaptcha = async (page: puppeteer.Page) => {
        console.log('in captcha');
        await page.waitForSelector('iframe');
        const elementHandle = await page.$('iframe');
        const frame = await elementHandle?.contentFrame();
        await frame?.waitForFunction(`document.querySelector("#a11y-label") && document.querySelector("#a11y-label").innerText.includes('אתה מאומת')`);
        await page.click('input[value="Submit"');
        console.log('captcha solved');
    }

    private saveData = (allItems: any, fileName: string) => {
        fs.writeFile(`${fileName}.json`, JSON.stringify(allItems) + "\n\n", function (err) {
            if (err) return console.log(err);
        });
        // allItems.forEach(async ad => {
        //     var x = await client.index({
        //         index: 'ads',
        //         id: ad.id,
        //         body: ad.body
        //     });
        //     console.log(x);
        // });
    }

    private searchProperty = async (page: puppeteer.Page) => {
        const searchBoxSelector = 'input[role=combobox]';
        console.log('searching for search box');
        // await this.sleep(600000)
        await page.waitForSelector(searchBoxSelector);
        console.log('found');
        await page.$eval(searchBoxSelector, (el: any) => el.value = 'Mountain Brook');
        const searchBoxElement = await page.$(searchBoxSelector);
        await searchBoxElement?.press('Enter');
        await this.sleep(200000);
    }

    private scrapePage = async (page: puppeteer.Page) => {
        await page.waitForSelector(".feed_list");
        const feeditems = await page.$$('.feeditem');
        for (const feedItemElement of feeditems) {
            try {
                await feedItemElement.click();
                console.log('clicked');
            } catch (err) {

            }
        }
        console.log('finished clicking');
        const pageDetails = await page.evaluate(() => {
            const paginationLink = document.querySelector('.pagination a:last-child');
            const feedItems = document.querySelectorAll(`.feeditem`);
            const feedItemsList: any = [];
            feedItems.forEach((item: Element, key: number) => {
                const item_id = item.querySelector('div:nth-child(1)')?.getAttribute('item-id');
                let itemData: any = { id: item_id, body: null };
                if (item_id) {
                    itemData.body = {
                        km: JSON.stringify(item.querySelector('span[data-v-212a6bed]')),
                        address: item.querySelector('.title')?.textContent?.trim(),
                        year: item.querySelector('.middle_col div:nth-child(1) .val')?.textContent,
                        yad: item.querySelector('.middle_col div:nth-child(2) .val')?.textContent,
                        space: item.querySelector('.middle_col div:nth-child(3) .val')?.textContent,
                    }
                }
                feedItemsList.push(itemData);
                // this.saveData(feedItemsList);
            });
            return {
                hasMorePages: paginationLink?.classList.contains("active"),
                nextPage: `${paginationLink?.getAttribute("href")}`,
                feedItemsList: feedItemsList
            };
        });

        return pageDetails;
    }


    private enablePageLogs = async (page: puppeteer.Page) => {
        page.on('console', async (msg) => {
            const msgArgs = msg.args();
            for (let i = 0; i < msgArgs.length; ++i) {
                console.log(await msgArgs[i].jsonValue());
            }
        });
    }

    private constructUrl = (page: number, forSale: boolean) => {
        // const url = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{"currentPage":${page}},"usersSearchTerm":"Birmingham, AL","mapBounds":{"west":-88.68054342696513,"east":-84.89026022384013,"south":32.89838853516066,"north":34.11215002972487},"savedSearchEnrollmentId":"X1-SS1p7ozf2egw4k1000000000_6zfrs","mapZoom":8,"regionSelection":[{"regionId":10417,"regionType":6}],"isMapVisible":true,"filterState":{"doz":{"value":"6m"},"isAllHomes":{"value":true},"sortSelection":{"value":"mostrecentchange"}},"isListVisible":true}&wants={"cat1":["listResults","mapResults"],"cat2":["total"]}&requestId=3`;
        // const url = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{"currentPage":${page}},"usersSearchTerm":"Birmingham, AL","mapBounds":{"west":-88.68054342696513,"east":-84.89026022384013,"south":32.89146988459523,"north":34.118971781761324},"regionSelection":[{"regionId":10417,"regionType":6}],"isMapVisible":true,"filterState":{"doz":{"value":"6m"},"isAllHomes":{"value":true},"sortSelection":{"value":"globalrelevanceex"},"price":{"min":800000},"monthlyPayment":{"min":4162},"isManufactured":{"value":false},"isApartment":{"value":false},"isApartmentOrCondo":{"value":false},"isLotLand":{"value":false},"isCondo":{"value":false},"isMultiFamily":{"value":false},"isTownhouse":{"value":false},"isRecentlySold":{"value":true},"isForSaleByAgent":{"value":false},"isForSaleByOwner":{"value":false},"isNewConstruction":{"value":false},"isComingSoon":{"value":false},"isAuction":{"value":false},"isForSaleForeclosure":{"value":false}},"isListVisible":true,"mapZoom":8}&wants={"cat1":["listResults","mapResults"]}&requestId=14`
        // const url = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{"currentPage":${page}},"usersSearchTerm":"Birmingham, AL","mapBounds":{"west":-86.80020761916484,"east":-86.77059603164042,"south":33.5022799906134,"north":33.512514054090055},"savedSearchEnrollmentId":"X1-SS1p7ozf2egw4k1000000000_6zfrs","mapZoom":15,"regionSelection":[{"regionId":10417,"regionType":6}],"isMapVisible":true,"filterState":{"doz":{"value":"6m"},"isAllHomes":{"value":true},"sortSelection":{"value":"mostrecentchange"}},"isListVisible":true}&wants={"cat1":["listResults","mapResults"],"cat2":["total"]}&requestId=13`;
        const forSaleUrl = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{"currentPage":${page}},"usersSearchTerm":"Birmingham, AL","mapBounds":{"west":-87.79621130078125,"east":-85.90106969921875,"south":33.214022144972844,"north":33.82767874963706},"regionSelection":[{"regionId":10417,"regionType":6}],"isMapVisible":true,"filterState":{"price":{"min":800000},"monthlyPayment":{"min":4162},"doz":{"value":"6m"},"sortSelection":{"value":"globalrelevanceex"},"isAllHomes":{"value":true},"isCondo":{"value":false},"isMultiFamily":{"value":false},"isManufactured":{"value":false},"isLotLand":{"value":false},"isTownhouse":{"value":false},"isApartment":{"value":false},"isApartmentOrCondo":{"value":false}},"isListVisible":true,"mapZoom":9}&wants={"cat1":["listResults","mapResults"],"cat2":["total"]}&requestId=6`
        const soldUrl = `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState={"pagination":{"currentPage":${page}},"usersSearchTerm":"Birmingham, AL","mapBounds":{"west":-87.79621130078125,"east":-85.90106969921875,"south":33.214022144972844,"north":33.82767874963706},"regionSelection":[{"regionId":10417,"regionType":6}],"isMapVisible":true,"filterState":{"price":{"min":800000},"monthlyPayment":{"min":4162},"doz":{"value":"6m"},"sortSelection":{"value":"globalrelevanceex"},"isAllHomes":{"value":true},"isCondo":{"value":false},"isMultiFamily":{"value":false},"isManufactured":{"value":false},"isLotLand":{"value":false},"isTownhouse":{"value":false},"isApartment":{"value":false},"isApartmentOrCondo":{"value":false},"isRecentlySold":{"value":true},"isForSaleByAgent":{"value":false},"isForSaleByOwner":{"value":false},"isNewConstruction":{"value":false},"isComingSoon":{"value":false},"isAuction":{"value":false},"isForSaleForeclosure":{"value":false}},"isListVisible":true,"mapZoom":9}&wants={"cat1":["listResults","mapResults"]}&requestId=5`
        if (forSale) return forSaleUrl;
        return soldUrl;
    }

    private fetchData = async (url: string) => {
        let data: any = null;
        let dataFound = false;
        while (!dataFound) {
            console.log('Trying to fetch data...');
            try {
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': this.userAgent
                    }
                })
                data = this.extractMapData(response.data)
                dataFound = true;
            } catch (error) {
                console.log(`Current user agent ${this.userAgent}`);
                this.userAgent = randomUserAgent.getRandom();
                console.log(`New user agent ${this.userAgent}`);
            }
        }
        return data;
    }

    private extractMapData: (data: any) => House[] = (data: any) => {
        return data['cat1']['searchResults']['listResults'];
    }

    private findDeals = async (soldHouseList: { [id: string]: House }, forSaleHouseList: { [id: string]: House }, maxDistance: number, minProfit: number) => {
        let sum = 0;
        const deals: { profit: Number, house: House }[] = [];
        // for (const houseId in soldHouseList) {
        //     const distance = this.getDistance(latitude, soldHouseList[houseId].latLong.latitude, longitude, soldHouseList[houseId].latLong.longitude);
        //     if (distance <= maxDistance) {
        //         sum += soldHouseList[houseId].hdpData.homeInfo.price;
        //     }
        // }
        const average = sum / Object.keys(soldHouseList).length;
        for (const houseId in forSaleHouseList) {
            const housePrice = forSaleHouseList[houseId].hdpData.homeInfo.price;
            const latitude = forSaleHouseList[houseId].latLong.latitude;
            const longitude = forSaleHouseList[houseId].latLong.longitude;
            let soldHousesPriceSum = 0
            let soldHousesCount = 0
            for (const soldHouseId in soldHouseList) {
                const soldHouseLatitude = soldHouseList[soldHouseId].latLong.latitude;
                const soldHouseLongitude = soldHouseList[soldHouseId].latLong.longitude;
                const distance = this.getDistance(latitude, soldHouseLatitude, longitude, soldHouseLongitude);
                if (distance <= maxDistance) {
                    soldHousesPriceSum += soldHouseList[soldHouseId].hdpData.homeInfo.price
                    soldHousesCount++;
                }
            }
            const soldHousesAveragePrice = soldHousesPriceSum / soldHousesCount;
            const profit = 100 * (soldHousesAveragePrice - housePrice) / soldHousesAveragePrice;
            if (profit >= minProfit) {
                deals.push({
                    profit,
                    house: forSaleHouseList[houseId]
                })
            }
        }
        return deals;
    }

    public getData = async () => {
        // const url = "https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22mapBounds%22%3A%7B%22north%22%3A39.32718473933357%2C%22east%22%3A-88.66329528906252%2C%22south%22%3A37.28421954984959%2C%22west%22%3A-96.24386169531252%7D%2C%22mapZoom%22%3A7%2C%22usersSearchTerm%22%3A%22Missouri%22%2C%22regionSelection%22%3A%5B%7B%22regionId%22%3A32%2C%22regionType%22%3A2%7D%5D%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22isAllHomes%22%3A%7B%22value%22%3Atrue%7D%2C%22sortSelection%22%3A%7B%22value%22%3A%22globalrelevanceex%22%7D%7D%2C%22isListVisible%22%3Atrue%7D&wants={%22cat1%22:[%22mapResults%22]}&requestId=2";
        // const url = "https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22isListVisible%22%3Atrue%7D&wants={%22cat1%22:[%22mapResults%22]}&requestId=2";
        // const url = "https://www.zillow.com/birmingham-al/18_p/?searchQueryState=%7B%22usersSearchTerm%22%3A%22Birmingham%2C%20AL%22%2C%22mapBounds%22%3A%7B%22west%22%3A-87.25918722579326%2C%22east%22%3A-86.311616425012%2C%22south%22%3A33.353821864418514%2C%22north%22%3A33.66070042916765%7D%2C%22savedSearchEnrollmentId%22%3A%22X1-SS1p7ozf2egw4k1000000000_6zfrs%22%2C%22regionSelection%22%3A%5B%7B%22regionId%22%3A10417%2C%22regionType%22%3A6%7D%5D%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22doz%22%3A%7B%22value%22%3A%226m%22%7D%2C%22ah%22%3A%7B%22value%22%3Atrue%7D%2C%22sort%22%3A%7B%22value%22%3A%22mostrecentchange%22%7D%7D%2C%22isListVisible%22%3Atrue%2C%22pagination%22%3A%7B%22currentPage%22%3A18%7D%7D"
        let page = 1;
        let forSaleResults: { [id: string]: House } = {};
        let soldResults: { [id: string]: House } = {};
        const referenceLatitude = 33.51256099863844;
        const referenceLongitude = -86.69427179999998;

        while (page < 20) {
            console.log(page);
            const url = this.constructUrl(page, true);
            const mapResults = await this.fetchData(url);
            if (mapResults.length == 0) break;
            for (const result of mapResults) {
                forSaleResults[result.zpid] = result
            }
            page++;
        }
        page = 1;
        while (page < 20) {
            console.log(page);
            const url = this.constructUrl(page, false);
            const mapResults = await this.fetchData(url);
            if (mapResults.length == 0) break;
            for (const result of mapResults) {
                soldResults[result.zpid] = result
            }
            page++;
        }
        let ids = Object.keys(soldResults);
        await this.saveData(ids, 'soldResults');
        ids = Object.keys(forSaleResults);
        await this.saveData(ids, 'forSaleResults');
        const deals = await this.findDeals(soldResults, forSaleResults, referenceLatitude, referenceLongitude, 1000, -100);
        console.log('finished, deals: \n');
        console.log(deals)

        // for (const result of Object.keys(results)) {
        //     console.log(result);
        // }
        // console.log(data.data);
        // for (const result of mapResults) {
        //     const latitude = result['latLong']['latitude'];
        //     const longitude = result['latLong']['longitude'];
        //     const distance = this.getDistance(lat1, latitude, lon1, longitude);
        //     console.log(distance);
        // }
        // await this.saveData(mapResults);
    }

    private radians = (x: number) => {
        return x * Math.PI / 180;
    };

    private getDistance = (latitudeA: number, latitudeB: number, longitudeA: number, longitudeB: number) => {
        const earthRadius = 3958.756; // Earth’s mean radius in meter
        const latitudeDifference = this.radians(latitudeB - latitudeA);
        const longitudeDifference = this.radians(longitudeB - longitudeA);
        const a = Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2) +
            Math.cos(this.radians(latitudeA)) * Math.cos(this.radians(latitudeB)) *
            Math.sin(longitudeDifference / 2) * Math.sin(longitudeDifference / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = earthRadius * c;
        return d; // returns the distance in meter
    };

    private sleep = async (ms: number) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    };
}
