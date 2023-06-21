import Property from "../models/property";
import RegionProperties from "../models/region_properties";
import ScrapeMetadata from "../models/scrape_metadata";
import DataFetcher from "./DataFetcher";

interface PropertyScraper {
    scrapeMetadata: (regionProperties: RegionProperties, dataFetcher: DataFetcher) => Promise<ScrapeMetadata>;
    scrapeProperties: (scrapeInfo: ScrapeMetadata, dataFetcher: DataFetcher) => Promise<Property[]>;
    scrapeProperty: (display: string, dataFetcher: DataFetcher) => Promise<Property>;
}

export default PropertyScraper;