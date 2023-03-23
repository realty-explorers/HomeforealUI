interface RegionProperties {
    city: string,
    state: string,
    isForSale?: boolean;
    soldPropertiesMaxAge: number;
    forSalePropertiesMaxAge?: number;
}

export default RegionProperties;