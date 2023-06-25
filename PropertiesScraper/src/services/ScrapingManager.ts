import Property from "../models/property";
import RegionProperties from "../models/region_properties";
import ScrapeMetadata from "../models/scrape_metadata";
import AxiosDataFetcher from "./AxiosDataFetcher";
import DataFetcher from "./DataFetcher";
import PropertyScraper from "./PropertyScraper";
import RealtorScraper from "./Scrapers/Realtor/RealtorScraper";
import ZillowScraper from "./Scrapers/ZillowScraper";

enum Scraper {
    Zillow,
    Realtor,
}

export class ScrapingManager {

    private propertyScrapers: { [scraper in Scraper]: PropertyScraper }
    private dataFetcher: DataFetcher;

    constructor() {
        this.propertyScrapers = {
            [Scraper.Zillow]: new ZillowScraper(),
            [Scraper.Realtor]: new RealtorScraper()
        };
        this.dataFetcher = new AxiosDataFetcher();
    }

    private constructScrapersRegionProperties = (regionProperties: RegionProperties) => {
        const scrapersRegionProperties: RegionProperties[] = [];
        const forSaleRegionProperties = { ...regionProperties, isForSale: true };
        const soldRegionProperties: RegionProperties = { ...regionProperties, isForSale: false };
        scrapersRegionProperties.push(forSaleRegionProperties);
        scrapersRegionProperties.push(soldRegionProperties);
        return scrapersRegionProperties;
    }

    private scrapeMetadata = async (scrapersRegionProperties: RegionProperties[]) => {
        const scrapeMetadataTasks: Promise<ScrapeMetadata>[] = [];
        console.log('scraping metadata')
        for (const regionProperties of scrapersRegionProperties) {
            const scrapeMetadataTask = this.propertyScrapers[Scraper.Realtor].scrapeMetadata(regionProperties, this.dataFetcher);
            scrapeMetadataTasks.push(scrapeMetadataTask);
        }
        const scrapersMetadataResults = await Promise.all(scrapeMetadataTasks);
        return scrapersMetadataResults;
    }

    private validateScrapersMetadata = (scrapersMetadata: ScrapeMetadata[]) => {
        const MAX_PAGES = 50;
        console.log(`page: ${scrapersMetadata[0].totalPages}`)
        for (const scraperMetadata of scrapersMetadata) {
            if (scraperMetadata.totalPages > MAX_PAGES) throw Error(`Too much results: ${scraperMetadata.totalPages}`);
        }
    }

    public scrapeProperties = async (regionProperties: RegionProperties) => {
        if (regionProperties.type === 'address') return await this.getAddressProperties(regionProperties);
        const scrapersRegionProperties = this.constructScrapersRegionProperties(regionProperties);
        const scrapersMetadataResults = await this.scrapeMetadata(scrapersRegionProperties);
        console.log('after metadata')

        const scrapeTasks: Promise<Property[]>[] = [];
        this.validateScrapersMetadata(scrapersMetadataResults);
        for (const scrapeMetadata of scrapersMetadataResults) {
            console.log(`Scraping ${scrapeMetadata.totalPages} pages`);
            const scrapeTask = this.propertyScrapers[Scraper.Realtor].scrapeProperties(scrapeMetadata, this.dataFetcher);
            scrapeTasks.push(scrapeTask);
        }
        const propertiesResults = await Promise.all(scrapeTasks);
        const properties = [];
        for (const propertiesResult of propertiesResults) {
            properties.push(...propertiesResult);
        }
        console.log(`Finished scraping, total properties: ${properties.length}`);
        return properties;
    }

    private getAddressProperties = async (regionProperties: RegionProperties) => {
        console.log('scraping address');
        const property = await this.propertyScrapers[Scraper.Realtor].scrapeProperty(regionProperties.display, this.dataFetcher);
        regionProperties.isForSale = false;
        if (property.neighborhood) {
            regionProperties.type = 'neighborhood';
            regionProperties.display = `${property.neighborhood}, ${property.city}, ${property.state}`;
        } else {
            regionProperties.type = 'city';
            regionProperties.display = `${property.city}, ${property.state}`;
        }
        const scrapeMetadata = await this.scrapeMetadata([regionProperties]);
        console.log(`Scraping ${scrapeMetadata[0].totalPages} pages`);
        const soldProperties = await this.propertyScrapers[Scraper.Realtor].scrapeProperties(scrapeMetadata[0], this.dataFetcher);
        return [property, ...soldProperties];
    }
}
