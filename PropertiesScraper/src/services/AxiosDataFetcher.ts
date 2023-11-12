import axios, { AxiosProxyConfig, AxiosResponse } from "axios";
import { Agent } from "https";
import { response } from "express";
import * as randomUserAgent from "random-useragent";
import httpProxyList from "../http_proxies.json";
import DataFetcher from "./DataFetcher";
import RequestParameters from "../models/request_parameters";
import { sleep } from "../utils/utils";

export default class AxiosDataFetcher implements DataFetcher {
  private readonly ROOT_URL = "https://www.zillow.com/search/";
  private userAgent: string;
  private proxy: AxiosProxyConfig;
  private randomIndex: number;

  constructor() {
    this.randomIndex = 1;
    this.userAgent = randomUserAgent.getRandom();
    this.proxy = {
      protocol: "https",
      // host: httpProxyList[0].ip,
      // port: +httpProxyList[0].port
      host: "146.59.127.168",
      port: 80,
    };
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
  };

  private makeRequest = async (requestParameters: RequestParameters) => {
    try {
      const response = await axios({
        method: requestParameters.method,
        url: requestParameters.url,
        data: requestParameters.body,
        headers: {
          "User-Agent": this.userAgent,
        },
        // proxy: this.proxy
      });
      return response;
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  private makeRequestProxy = async (url: string) => {
    try {
      const httpsAgent = new Agent({ host: "146.59.127.168", port: 80 });
      const axio = axios.create({ httpsAgent });
      const agent = new Agent({ rejectUnauthorized: false });
      const response = await axio.get("www.google.com", {
        headers: {
          // 'User-Agent': this.userAgent

          // 'User-Agent': (new Agent({ rejectUnauthorized: false }).
        },
        // httpsAgent: new Agent({ rejectUnauthorized: false },
        // httpsAgent: agent,
        timeout: 30000,
        // proxy: this.proxy
      });
      console.log("finished fetching");
      return response;
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  private alterRequest = () => {
    this.userAgent = randomUserAgent.getRandom();
    // this.proxy = this.randomizeProxy();
    // console.log(`Using agent: ${this.userAgent}, proxy: ${this.proxy.host}`);
  };

  private randomizeProxy = () => {
    // const randomIndex = Math.floor(Math.random() * httpProxyList.length);
    this.randomIndex = Math.floor(Math.random() * httpProxyList.length);
    return {
      protocol: "http",
      host: httpProxyList[this.randomIndex].ip,
      port: +httpProxyList[this.randomIndex].port,
    };
  };

  public tryFetch = async (
    requestParameters: RequestParameters,
    validateData: (data: any) => boolean,
    maxTries?: number,
    metadata?: any,
  ) => {
    let tries = 0;
    maxTries = maxTries ? maxTries : 100;
    while (tries < maxTries) {
      // console.log(`fetching #${tries}`);
      tries++;
      const response = await this.makeRequest(requestParameters);
      if (response) {
        const validData = validateData(response.data);
        if (validData) {
          return {
            data: response.data,
            metadata,
          };
        }
      }
      this.alterRequest();
    }
    console.log("Request failed");
    return null;
  };

  // public tryFetch = async (
  //   requestParameters: RequestParameters,
  //   validateData: (data: any) => boolean,
  //   maxTries?: number,
  // ) => {
  //   let tries = 0;
  //   while (true) {
  //     // console.log(`fetching #${tries}`);
  //     tries++;
  //     const response = await this.makeRequest(requestParameters);
  //     if (response) {
  //       const validData = validateData(response.data);
  //       if (validData) return response.data;
  //     }
  //     this.alterRequest();
  //
  //     console.log("sleeping 10 second, total tries: " + tries);
  //     await sleep(10000);
  //   }
  //   console.log("Request failed");
  //   return null;
  // };

  public tryFetchProxy = async (
    url: string,
    validateData: (data: any) => boolean,
    maxTries?: number,
  ) => {
    let tries = 0;
    maxTries = maxTries ? maxTries : 100;
    while (tries < maxTries) {
      console.log(`fetching #${tries}`);
      tries++;
      const response = await this.makeRequestProxy(url);
      if (response) {
        let currentProxy = this.proxy;
        const validData = validateData(response.data);
        if (validData) {
          console.log(`working proxy: ${currentProxy}`);
          return response.data;
        }
      }
      this.alterRequest();
    }
    console.log("Request failed");
    return null;
  };
}
