import * as fs from 'fs';
import DealsFinder from './DealsFinder';
import housesCache from '../../raw_data/housesCache.json';
import Property from '../models/property';
import RegionProperties from '../models/region_properties';

type PropertiesCache = {
	[id: string]: {
		forSaleProperties: Property[];
		soldProperties: Property[];
	}
}

export default class DealsService {
	private dealsFinder: DealsFinder;
	private propertiesCache: any;


	constructor() {
		this.dealsFinder = new DealsFinder();
		// this.propertiesCache = housesCache as PropertiesCache;
		this.cacheProperties = {} as any;
	}

	public findProperties = async (city: string, state: string, soldPropertiesMaxAge: number, forSalePropertiesMaxAge: number) => {
		const regionProperties: RegionProperties = {
			city: city.toLowerCase(),
			state: state.toLowerCase(),
			soldPropertiesMaxAge,
			forSalePropertiesMaxAge
		}
		// if (address in this.propertiesCache) return this.propertiesCache[address];
		const properties = await this.dealsFinder.findProperties(regionProperties);
		// this.propertiesCache[address] = {
		// 	forSaleProperties: properties.forSale,
		// 	soldProperties: properties.sold
		// }
		// await this.cacheProperties();
		return properties;
	}

	private cacheProperties = async () => {
		fs.writeFile(`raw_data/housesCache.json`, JSON.stringify(this.propertiesCache), function (err) {
			if (err) return console.log(err);
		});
	}

	public findDeals = async (address: string, distance: number, profit: number, soldMinPrice?: number, soldMaxPrice?: number, propertyMinPrice?: number, propertyMaxPrice?: number, soldAge?: number, forSaleAge?: number, minArea?: number, maxArea?: number, minBeds?: number, maxBeds?: number, minBaths?: number, maxBaths?: number) => {
		const inCache = address in this.propertiesCache;
		if (!inCache) throw Error('No cache');
		const deals = await this.dealsFinder.findDeals(this.propertiesCache[address].soldProperties, this.propertiesCache[address].forSaleProperties, distance, profit, soldMinPrice, soldMaxPrice, propertyMinPrice, propertyMaxPrice, soldAge, forSaleAge, minArea, maxArea, minBeds, maxBeds, minBaths, maxBaths);
		return deals;
	}
}
