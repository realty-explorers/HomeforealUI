import RegionProperties from "./region_properties";

interface ScrapeMetadata {
    totalPages: number;
    regionProperties: RegionProperties;
    extra?: any;
}

export default ScrapeMetadata;