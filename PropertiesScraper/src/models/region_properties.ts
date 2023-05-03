interface RegionProperties {
    display: string,
    type: string,
    city: string,
    state: string,
    isForSale?: boolean;
    soldPropertiesMaxAge?: number;
    forSalePropertiesMaxAge?: number;
}

export default RegionProperties;