import * as puppeteer from "puppeteer";
import Utils from "./utils";


export default class ZillowScraper {

    constructor() { }

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