import Property from "../models/property";
import AxiosDataFetcher from "./AxiosDataFetcher";
import DealsEngine from "./DealsEngine";
import {
  constructRegionId,
  ISODifferenceToDays,
  saveData,
} from "../utils/utils";
import RegionFilter from "../models/region_filter";
import PropertyScraper from "./PropertyScraper";
import RealtorScraper from "./Scrapers/Realtor/RealtorScraper";
import PropertyRepository from "../data/db";
import RegionStatus from "../models/region_status";
import { ScrapingManager } from "./ScrapingManager";
import BuyBox from "../models/buybox";

export default class DealsFinder {
  private dataFetcher: AxiosDataFetcher;
  private dealsFinder: DealsEngine;
  private propertyScrapers: PropertyScraper[];
  // private propertyRepository: PropertyRepository;
  private scrapingManager: ScrapingManager;

  constructor() {
    this.dataFetcher = new AxiosDataFetcher();
    this.dealsFinder = new DealsEngine();
    const realtorScraper = new RealtorScraper();
    this.propertyScrapers = [realtorScraper];
    // this.propertyRepository = new PropertyRepository();
    // this.init();
    this.scrapingManager = new ScrapingManager();
  }

  private init = async () => {
    // await this.propertyRepository.connect();
    // await this.propertyRepository.setupDB();
  };

  private calcDateDifference = (dateString: string) => {
    const date = new Date(dateString);
    const difference = Date.now() - date.getTime();
    const daysToMilliseconds = 24 * 60 * 60 * 1000;
    return difference / daysToMilliseconds;
  };

  public findProperties = async (regionFilter: RegionFilter) => {
    const properties = [];
    // const regionStatus = await this.propertyRepository.getRegionStatus(
    //   regionProperties.city,
    //   regionProperties.state,
    // );

    // if (regionStatus) {
    //     const results = await this.propertyRepository.getProperties(regionProperties.city, regionProperties.state);
    //     properties.push(...results);
    //     const lastUpdateAge = this.calcDateDifference(regionStatus.lastUpdated);
    //     if (lastUpdateAge < 1) return properties;
    //     const updateTimeFrame = ISODifferenceToDays(regionStatus.lastUpdated);
    //     regionProperties.forSalePropertiesMaxAge = updateTimeFrame;
    //     regionProperties.soldPropertiesMaxAge = updateTimeFrame;
    //     console.log(`Finding new properties in timeframe: ${updateTimeFrame} days`);
    // }
    // const updatedRegionStatus: RegionStatus = {
    //   id: constructRegionId(regionProperties.city, regionProperties.state),
    //   city: regionProperties.city,
    //   state: regionProperties.state,
    //   lastUpdated: new Date().toISOString(),
    // };

    const foundProperties = await this.scrapingManager.scrapeProperties(
      regionFilter,
    );
    // const response = await this.propertyRepository.saveProperties(
    //   foundProperties,
    //   regionFilter.state,
    // );
    // console.log(response);
    // await this.propertyRepository.updateRegionStatus(updatedRegionStatus);

    properties.push(...foundProperties);
    return properties;
  };

  public findDeals = async (
    soldProperties: Property[],
    forSaleProperties: Property[],
    buyBox: BuyBox,
  ) => {
    const deals = await this.dealsFinder.findDeals(
      soldProperties,
      forSaleProperties,
      buyBox,
    );
    saveData(deals, "deals");
    console.log("finished, deals: \n");
    console.log(deals.map((deal) => {
      return {
        url: deal.property.address,
        profit: deal.profit,
      };
    }));
    return deals;
  };
}
