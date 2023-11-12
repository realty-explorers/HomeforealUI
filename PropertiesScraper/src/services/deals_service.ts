import * as fs from "fs";
import DealsFinder from "./DealsFinder";
import Property from "../models/property";
import RegionFilter, { PropertyStatus } from "../models/region_filter";
import PropertiesCache from "./PropertiesCache";
import BuyBox from "../models/buybox";

export default class DealsService {
  private dealsFinder: DealsFinder;
  private propertiesCache: PropertiesCache;

  constructor() {
    this.dealsFinder = new DealsFinder();
    this.propertiesCache = new PropertiesCache();
  }

  public findProperties = async (
    id: string,
    type: string,
    propertyStatuses: PropertyStatus[],
    state: string,
    city?: string,
    zipcode?: string,
    neighborhood?: string,
    daysOnMarket?: number,
  ) => {
    //TODO: change to default ages in production
    // const regionProperties: RegionProperties = {
    // 	city: city.toLowerCase(),
    // 	state: state.toLowerCase(),
    // 	soldPropertiesMaxAge,
    // 	forSalePropertiesMaxAge
    // }

    const regionProperties: RegionFilter = {
      type: type.toLowerCase(),
      state: state.toLowerCase(),
      city: city?.toLowerCase(),
      zipcode: zipcode?.toLowerCase(),
      neighborhood: neighborhood?.toLowerCase(),
      propertyStatuses: propertyStatuses,
    };
    const properties = await this.dealsFinder.findProperties(regionProperties);
    this.propertiesCache.cacheProperties(id, properties);
    const keys = await this.propertiesCache.getKeys();
    // console.log(keys);
    return properties;
  };

  public findDeals = async (
    id: string,
    buyBox: BuyBox,
    updatedProperty?: Property,
  ) => {
    const properties = await this.propertiesCache.getProperties(id);
    const keys = await this.propertiesCache.getKeys();
    // console.log(keys);
    const soldProperties = properties.filter((property) =>
      property.forSale === false
    );
    const forSaleProperties = properties.filter((property) =>
      property.forSale === true
    );
    if (updatedProperty) {
      const index = forSaleProperties.findIndex((property) =>
        property.id === updatedProperty.id
      );
      if (index !== -1) forSaleProperties[index] = updatedProperty;
    }
    // if (updatedProperty && forSaleProperties[0]) {
    // 	forSaleProperties[0].price = updatedProperty.price;
    // 	forSaleProperties[0].area = updatedProperty.area;
    // }
    const deals = await this.dealsFinder.findDeals(
      soldProperties,
      forSaleProperties,
      buyBox,
    );
    return deals;
  };
}
