import Property from "../models/property";
import RegionFilter from "../models/region_filter";
import ScrapeMetadata from "../models/scrape_metadata";
import DataFetcher from "./DataFetcher";

interface PropertyScraper {
  scrapeMetadata: (
    regionFilter: RegionFilter,
    dataFetcher: DataFetcher,
  ) => Promise<ScrapeMetadata[]>;
  scrapeProperties: (
    scrapeInfo: ScrapeMetadata,
    dataFetcher: DataFetcher,
  ) => Promise<Property[]>;
  scrapeProperty: (
    dataFetcher: DataFetcher,
  ) => Promise<Property>;
}

export default PropertyScraper;
