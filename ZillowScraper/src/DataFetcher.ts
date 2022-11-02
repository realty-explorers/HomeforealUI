import axios from 'axios'
import * as randomUserAgent from 'random-useragent'

export default class ZillowScraper {

    private readonly ROOT_URL = 'https://www.zillow.com/search/';
    private userAgent;

    constructor() {
        this.userAgent = randomUserAgent.getRandom();
        this.setupRequestEngine();
    }

    private setupRequestEngine = () => {
        axios.interceptors.request.use(async (config) => {
            // Do something before request is sent
            const meow = config;
            // console.log(config);
            // await Utils.sleep(1000);
            return config;
        }, function (error) {
            // Do something with request error
            return Promise.reject(error);
        });
    }

    private makeRequest = async (url: string) => {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': this.userAgent
            }
        })
        return response;
    }

    private alterRequest = () => {
        this.userAgent = randomUserAgent.getRandom();
    }

    public tryFetch = async (url: string, extractData: (data: any) => any, maxTries?: number) => {
        let data: any = null;
        let finishedFetching = false;
        let tries = 0;
        while (!finishedFetching) {
            tries++;
            console.log(`Trying to fetch data, attempt ${tries}`);
            const response = await this.makeRequest(url);
            data = extractData(response.data);
            if (data || tries === maxTries) finishedFetching = true;
            else this.alterRequest();
        }
        return data;
    }

}