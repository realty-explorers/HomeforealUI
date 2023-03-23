import Property from "../models/property";
import RegionProperties from "../models/region_properties";
import DataFetcher from "./DataFetcher";

interface PropertyScraper {
    scrapeProperties: (regionProperties: RegionProperties, dataFetcher: DataFetcher) => Promise<Property[]>;
}

export default PropertyScraper;