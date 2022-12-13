import axios, { AxiosProxyConfig } from 'axios'
import * as randomUserAgent from 'random-useragent'
import httpProxyList from '../http_proxies.json';

export default class DataFetcher {

    private readonly ROOT_URL = 'https://www.zillow.com/search/';
    private userAgent: string;
    private proxy: AxiosProxyConfig;
    private randomIndex: number;

    constructor() {
        this.randomIndex = 1;
        this.userAgent = randomUserAgent.getRandom();
        this.proxy = {
            protocol: 'http',
            // host: httpProxyList[0].ip,
            // port: +httpProxyList[0].port
            host: '103.181.45.9',
            port: 80
        }
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
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': this.userAgent
                },
                proxy: this.proxy
            })
            return response;
        } catch (error) {

        }
        return null;
    }

    private alterRequest = (tries: number) => {
        this.userAgent = randomUserAgent.getRandom();
        this.proxy = this.randomizeProxy();
        console.log(`Trying to fetch data, attempt ${tries}, agent: ${this.userAgent}`);
    }

    private randomizeProxy = () => {
        // const randomIndex = Math.floor(Math.random() * httpProxyList.length);
        this.randomIndex++;
        return {
            protocol: 'http',
            host: httpProxyList[this.randomIndex].ip,
            port: +httpProxyList[this.randomIndex].port
        }
    }

    public tryFetch = async (url: string, extractData: (data: any) => any, maxTries?: number) => {
        let data: any = null;
        let finishedFetching = false;
        let tries = 0;
        while (!finishedFetching) {
            tries++;
            const response = await this.makeRequest(url);
            if (response) {
                data = extractData(response.data);
                if (data || tries === maxTries) break;
            }
            this.alterRequest(tries);
        }
        return data;
    }

}