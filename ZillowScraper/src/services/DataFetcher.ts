import axios, { AxiosProxyConfig } from 'axios'
import { response } from 'express';
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
                // proxy: this.proxy
            })
            console.log('finished fetching');
            return response;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    private alterRequest = () => {
        this.userAgent = randomUserAgent.getRandom();
        this.proxy = this.randomizeProxy();
        console.log(`Using agent: ${this.userAgent}, proxy: ${this.proxy.host}`);
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

    public tryFetch = async (url: string, validateData: (data: any) => boolean, maxTries?: number) => {
        let tries = 0;
        maxTries = maxTries ? maxTries : 100;
        while (tries < maxTries) {
            console.log(`fetching #${tries}`);
            tries++;
            const response = await this.makeRequest(url);
            if (response) {
                const validData = validateData(response.data);
                if (validData) return response.data;
            }
            this.alterRequest();
        }
        return null;
    }

}