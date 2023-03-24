import Property from "../models/property";
import AxiosDataFetcher from "./AxiosDataFetcher";
import DealsEngine from "./DealsEngine";
import ZillowScraper from "./ZillowScraper";
import { constructRegionId, ISODifferenceToDays, saveData } from '../utils/utils';
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

    private calcDateDifference = (dateString: string) => {
        const date = new Date(dateString);
        const difference = Date.now() - date.getTime();
        const daysToMilliseconds = 24 * 60 * 60 * 1000;
        return difference / daysToMilliseconds;
    }

    public findProperties = async (regionProperties: RegionProperties) => {
        const db = new PropertyRepository();
        await db.connect();

        const properties = [];
        const regionStatus = await db.getRegionStatus(regionProperties.city, regionProperties.state);
        if (regionStatus) {
            const results = await db.getProperties(regionProperties.city, regionProperties.state);
            properties.push(...results);
            const lastUpdateAge = this.calcDateDifference(regionStatus.lastUpdated);
            if (lastUpdateAge < 1) return properties;
            const updateTimeFrame = ISODifferenceToDays(regionStatus.lastUpdated);
            regionProperties.forSalePropertiesMaxAge = updateTimeFrame;
            regionProperties.soldPropertiesMaxAge = updateTimeFrame;
            console.log(`Finding new properties in timeframe: ${updateTimeFrame} days`);
        }
        const updatedRegionStatus: RegionStatus = {
            id: constructRegionId(regionProperties.city, regionProperties.state),
            city: regionProperties.city,
            state: regionProperties.state,
            lastUpdated: new Date().toISOString()
        }

        const forSaleRegionProperties = { ...regionProperties, isForSale: true };
        const soldRegionProperties: RegionProperties = { ...regionProperties, isForSale: false };
        const forSalePropertiesScrapeTask = this.propertyScrapers[1].scrapeProperties(forSaleRegionProperties, this.dataFetcher);
        const soldPropertiesScrapeTask = this.propertyScrapers[1].scrapeProperties(soldRegionProperties, this.dataFetcher);
        const [forSaleProperties, soldProperties] = await Promise.all([forSalePropertiesScrapeTask, soldPropertiesScrapeTask]);
        const foundProperties = [...forSaleProperties, ...soldProperties];

        await db.saveProperties(foundProperties, regionProperties.state);
        await db.updateRegionStatus(updatedRegionStatus);

        properties.push(...foundProperties)
        return properties;

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
