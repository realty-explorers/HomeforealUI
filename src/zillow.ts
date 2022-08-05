import * as puppeteer from "puppeteer";
import fs from 'fs';
import axios from "axios";

export default class ZillowScraper {

    CAPTCHA_SOLVER_PATH = process.env.CAPTCHA_SOLVER_PATH;
    USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36';
    ROOT_URL = 'https://www.yad2.co.il';
    DEFAULT_PATH = '/vehicles/cars';

    constructor() {
    }


    private sleep = async (ms: number) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    };

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

    private launchBrowser = async () => {
        const browser = await puppeteer.launch({
            'headless': false, 'slowMo': 500, 'args': [
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
                `--disable-extensions-except=${this.CAPTCHA_SOLVER_PATH}`,
                `--load-extension=${this.CAPTCHA_SOLVER_PATH}`,
                '--enable-automation'
            ]
        });
        return browser;
    }

    private trimPrice = (price: string) => {
        const cleanPrice = price.replace('₪', '');
        return cleanPrice.split(',').join('');
    }

    private getSubtitleDetails = (element: Element) => {
        const subtitleElement = element.querySelector('.subtitle');
        return subtitleElement?.textContent;
    }

    private saveData = (allItems: any) => {
        fs.writeFile('data.txt', JSON.stringify(allItems) + "\n\n", function (err) {
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


    private scrapePage = async (page: puppeteer.Page) => {
        await page.waitForSelector(".feed_list");
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
                        price: this.trimPrice(item.querySelector('.left_col.with_new_tab div:nth-child(2)')?.textContent || ''),
                        subtitle: this.getSubtitleDetails(item)
                    }
                }
                feedItemsList.push(itemData);
                this.saveData(feedItemsList);
            });
            return {
                hasMorePages: paginationLink?.classList.contains("active"),
                nextPage: `${paginationLink?.getAttribute("href")}`,
                feedItemsList: feedItemsList
            };
        });

        return pageDetails;
    }

    private setupPageOptions = async (page: puppeteer.Page) => {
        // await page.setUserAgent(this.USER_AGENT);
        await page.exposeFunction("saveData", this.saveData);
        await page.exposeFunction("sleep", this.sleep);
        await page.exposeFunction("trimPrice", this.trimPrice);
        await page.exposeFunction("getSubtitleDetails", this.getSubtitleDetails);
        // await this.enablePageLogs(page);
    }

    private enablePageLogs = async (page: puppeteer.Page) => {
        page.on('console', async (msg) => {
            const msgArgs = msg.args();
            for (let i = 0; i < msgArgs.length; ++i) {
                console.log(await msgArgs[i].jsonValue());
            }
        });
    }

    public scrape = async () => {
        const browser = await this.launchBrowser();
        try {
            const page = await browser.newPage();
            await this.setupPageOptions(page);
            var allItems: any = [];
            var pageDetails: any = {
                hasMorePages: true,
                nextPage: `${this.DEFAULT_PATH}`,
                feedItemsList: []
            };
            while (pageDetails.hasMorePages) {
                const nextUrl = `${this.ROOT_URL}${pageDetails.nextPage}`;
                await this.breachUrl(nextUrl, page, { waitUntil: 'networkidle0' });
                pageDetails = await this.scrapePage(page);
                allItems.push(pageDetails.feedItemsList);
            }
        } catch (err) {
            console.log((err));
        } finally {
            this.saveData(allItems);
            await browser.close();
            console.log(("Browser Closed"));
        }
    }

    public extract = async () => {
        const url = 'https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState=%7B%22usersSearchTerm%22%3A%22Birmingham%2C%20AL%22%2C%22mapBounds%22%3A%7B%22west%22%3A-86.84462500045146%2C%22east%22%3A-86.7261786503538%2C%22south%22%3A33.48842987318048%2C%22north%22%3A33.52636031787311%7D%2C%22mapZoom%22%3A13%2C%22regionSelection%22%3A%5B%7B%22regionId%22%3A10417%2C%22regionType%22%3A6%7D%5D%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22doz%22%3A%7B%22value%22%3A%226m%22%7D%2C%22isAllHomes%22%3A%7B%22value%22%3Atrue%7D%2C%22sortSelection%22%3A%7B%22value%22%3A%22globalrelevanceex%22%7D%7D%2C%22isListVisible%22%3Atrue%2C%22pagination%22%3A%7B%22currentPage%22%3A2%7D%7D&wants={%22cat1%22:[%22listResults%22,%22mapResults%22],%22cat2%22:[%22total%22],%22regionResults%22:[%22total%22]}&requestId=11';
        const url2 = 'https://www.zillow.com/homes/for_sale/Los-Angeles-CA_rb/?fromHomePage=true&shouldFireSellPageImplicitClaimGA=false&fromHomePageTab=buy';
        axios.interceptors.response.use(req => {
            return req
        }, err => Promise.reject(err))
        const data = await axios.get(url2, {
            'headers': {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:96.0) Gecko/20100101 Firefox/96.0",
            }
        });
        console.log(JSON.stringify(data.data));
    }
}
