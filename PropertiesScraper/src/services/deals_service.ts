import * as fs from 'fs';
import DealsFinder from './DealsFinder';
import Property from '../models/property';
import RegionProperties from '../models/region_properties';
import PropertiesCache from './PropertiesCache';

export default class DealsService {
	private dealsFinder: DealsFinder;
	private propertiesCache: PropertiesCache;

	constructor() {
		this.dealsFinder = new DealsFinder();
		this.propertiesCache = new PropertiesCache();
	}


	public findProperties = async (id: string, city: string, state: string, soldPropertiesMaxAge: number, forSalePropertiesMaxAge: number) => {
		//TODO: change to default ages in production
		// const regionProperties: RegionProperties = {
		// 	city: city.toLowerCase(),
		// 	state: state.toLowerCase(),
		// 	soldPropertiesMaxAge,
		// 	forSalePropertiesMaxAge
		// }

		const regionProperties: RegionProperties = {
			city: city.toLowerCase(),
			state: state.toLowerCase(),
			soldPropertiesMaxAge: 180,
			forSalePropertiesMaxAge: 180
		}
		const properties = await this.dealsFinder.findProperties(regionProperties);
		this.propertiesCache.cacheProperties(id, properties);
		return properties;
	}

	public findDeals = async (id: string, distance: number, profit: number, soldMinPrice?: number, soldMaxPrice?: number, propertyMinPrice?: number, propertyMaxPrice?: number, soldAge?: number, forSaleAge?: number, minArea?: number, maxArea?: number, minBeds?: number, maxBeds?: number, minBaths?: number, maxBaths?: number) => {
		const properties = await this.propertiesCache.getProperties(id);
		const forSaleProperties = properties.filter(property => property.forSale === true);
		const soldProperties = properties.filter(property => property.forSale === false);
		const deals = await this.dealsFinder.findDeals(soldProperties, forSaleProperties, distance, profit, soldMinPrice, soldMaxPrice, propertyMinPrice, propertyMaxPrice, soldAge, forSaleAge, minArea, maxArea, minBeds, maxBeds, minBaths, maxBaths);
		return deals;
	}
}
