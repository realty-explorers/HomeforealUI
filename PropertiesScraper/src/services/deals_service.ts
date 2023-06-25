import * as fs from 'fs';
import DealsFinder from './DealsFinder';
import Property from '../models/property';
import RegionProperties from '../models/region_properties';
import PropertiesCache from './PropertiesCache';
import BuyBox from '../models/buybox';

export default class DealsService {
	private dealsFinder: DealsFinder;
	private propertiesCache: PropertiesCache;

	constructor() {
		this.dealsFinder = new DealsFinder();
		this.propertiesCache = new PropertiesCache();
	}


	public findProperties = async (id: string, display: string, type: string, city: string, state: string, soldPropertiesMaxAge: number, forSalePropertiesMaxAge: number) => {
		//TODO: change to default ages in production
		// const regionProperties: RegionProperties = {
		// 	city: city.toLowerCase(),
		// 	state: state.toLowerCase(),
		// 	soldPropertiesMaxAge,
		// 	forSalePropertiesMaxAge
		// }

		const regionProperties: RegionProperties = {
			display: display.toLowerCase(),
			type: type.toLowerCase(),
			city: city.toLowerCase(),
			state: state.toLowerCase(),
			soldPropertiesMaxAge: 180,
			forSalePropertiesMaxAge: 180
		}
		const properties = await this.dealsFinder.findProperties(regionProperties);
		this.propertiesCache.cacheProperties(id, properties);
		const keys = await this.propertiesCache.getKeys();
		console.log(keys);
		return properties;
	}

	public findDeals = async (id: string, buyBox: BuyBox, updatedProperty?: Property) => {
		const properties = await this.propertiesCache.getProperties(id);
		const keys = await this.propertiesCache.getKeys();
		console.log(keys);
		const forSaleProperties = properties.filter(property => property.forSale === true);
		const soldProperties = properties.filter(property => property.forSale === false);
		if (updatedProperty && forSaleProperties[0]) {
			forSaleProperties[0].price = updatedProperty.price;
			forSaleProperties[0].area = updatedProperty.area;
		}
		const deals = await this.dealsFinder.findDeals(soldProperties, forSaleProperties, buyBox);
		return deals;
	}
}
