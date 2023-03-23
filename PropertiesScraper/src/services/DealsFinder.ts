import Property from "../models/property";
import AxiosDataFetcher from "./AxiosDataFetcher";
import DealsEngine from "./DealsEngine";
import ZillowScraper from "./ZillowScraper";
import { saveData } from '../utils/utils';
import RegionProperties from "../models/region_properties";
import PropertyScraper from "./PropertyScraper";
import RealtorScraper from "./RealtorScraper";
import PropertyRepository from "../data/db";
import RegionStatus from "../models/region_status";

export default class DealsFinder {

    private dataFetcher: AxiosDataFetcher;
    private dealsFinder: DealsEngine;
    private propertyScrapers: PropertyScraper[];

    constructor() {
        this.dataFetcher = new AxiosDataFetcher();
        this.dealsFinder = new DealsEngine();
        const zillowScraper = new ZillowScraper();
        const realtorScraper = new RealtorScraper();
        this.propertyScrapers = [zillowScraper, realtorScraper];
    }

    public findProperties = async (regionProperties: RegionProperties) => {
        const db = new PropertyRepository();
        await db.connect();

        const regionStatus: RegionStatus = {
            id: `${regionProperties.city}-${regionProperties.state}`,
            city: regionProperties.city,
            state: regionProperties.state,
            lastUpdated: new Date().toISOString()
        }

        const forSaleRegionProperties = { ...regionProperties, isForSale: true };
        const soldRegionProperties: RegionProperties = { ...regionProperties, isForSale: false };
        const forSalePropertiesScrapeTask = this.propertyScrapers[1].scrapeProperties(forSaleRegionProperties, this.dataFetcher);
        const soldPropertiesScrapeTask = this.propertyScrapers[1].scrapeProperties(soldRegionProperties, this.dataFetcher);
        const [forSaleProperties, soldProperties] = await Promise.all([forSalePropertiesScrapeTask, soldPropertiesScrapeTask]);


        await db.saveProperties(forSaleProperties, regionProperties.state);
        await db.saveProperties(soldProperties, regionProperties.state);
        await db.updateRegionStatus(regionStatus);
        // await db.getPropertyById('meow', 'al');
        return {
            forSale: forSaleProperties,
            sold: soldProperties
        }
    }

    public findDeals = async (soldProperties: Property[], forSaleProperties: Property[], distance: number, profit: number, soldMinPrice?: number, soldMaxPrice?: number, propertyMinPrice?: number, propertyMaxPrice?: number, soldAge?: number, forSaleAge?: number, minArea?: number, maxArea?: number, minBeds?: number, maxBeds?: number, minBaths?: number, maxBaths?: number) => {
        const deals = await this.dealsFinder.findDeals(soldProperties, forSaleProperties, distance, profit, soldMinPrice, soldMaxPrice, propertyMinPrice, propertyMaxPrice, soldAge, forSaleAge, minArea, maxArea, minBeds, maxBeds, minBaths, maxBaths);
        saveData(deals, 'deals');
        console.log('finished, deals: \n');
        console.log(deals.map(deal => {
            return {
                url: deal.property.address,
                profit: deal.profit
            }
        }));
        return deals;
    }

}
