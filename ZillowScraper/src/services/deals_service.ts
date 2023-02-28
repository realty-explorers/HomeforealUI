import axios from 'axios';
import House from '../models/house';
import { RegionSelection } from '../models/region_info';
import DealsFinder from './DealsFinder';
import housesMockData from '../../raw_data/housesMockData.json';

export default class DealsService {
	private dealsFinder: DealsFinder;
	private propertiesCache: {
		[id: string]: {
			forSaleProperties: House[];
			soldProperties: House[];
		}
	}


	constructor() {
		this.dealsFinder = new DealsFinder();
		this.propertiesCache = {
			'1': {
				forSaleProperties: housesMockData['forSale'] as House[],
				soldProperties: housesMockData['sold'] as House[]
			}
		};
	}

	public findNewDeals = async (regionId: number, distance: number, profit: number, soldMinPrice?: number, soldMaxPrice?: number, propertyMinPrice?: number, propertyMaxPrice?: number, daysOnZillow?: string) => {
		// const zillowSearchUrl2 = 'https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22usersSearchTerm%22%3A%22Homewood%2C%20AL%22%2C%22mapBounds%22%3A%7B%22west%22%3A-86.90875740551759%2C%22east%22%3A-86.70791359448243%2C%22south%22%3A33.418826781825295%2C%22north%22%3A33.496020386086656%7D%2C%22regionSelection%22%3A%5B%7B%22regionId%22%3A45794%2C%22regionType%22%3A6%7D%5D%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22monthlyPayment%22%3A%7B%22min%22%3A0%2C%22max%22%3A3143%7D%2C%22doz%22%3A%7B%22value%22%3A%226m%22%7D%2C%22sortSelection%22%3A%7B%22value%22%3A%22globalrelevanceex%22%7D%2C%22isAllHomes%22%3A%7B%22value%22%3Atrue%7D%2C%22isCondo%22%3A%7B%22value%22%3Afalse%7D%2C%22isMultiFamily%22%3A%7B%22value%22%3Afalse%7D%2C%22isManufactured%22%3A%7B%22value%22%3Afalse%7D%2C%22isLotLand%22%3A%7B%22value%22%3Afalse%7D%2C%22isTownhouse%22%3A%7B%22value%22%3Afalse%7D%2C%22isApartment%22%3A%7B%22value%22%3Afalse%7D%2C%22isApartmentOrCondo%22%3A%7B%22value%22%3Afalse%7D%7D%2C%22isListVisible%22%3Atrue%2C%22mapZoom%22%3A13%7D&wants={%22cat1%22:[%22listResults%22,%22mapResults%22],%22cat2%22:[%22total%22]}&requestId=3';
		// const deals = await this.dealsFinder.getDeals(2, 40, zillowSearchUrl2, 500000, undefined, '6m');
		const deals = await this.dealsFinder.findNewDeals(regionId, distance, profit, soldMinPrice, soldMaxPrice, propertyMinPrice, propertyMaxPrice, daysOnZillow);
		return deals;
	};

	public findProperties = async (regionId: number) => {
		const properties = await this.dealsFinder.findProperties(regionId);
		this.propertiesCache['1'] = {
			forSaleProperties: properties.forSale,
			soldProperties: properties.sold
		}
		return properties;
	}

	public findDeals = async (distance: number, profit: number, soldMinPrice?: number, soldMaxPrice?: number, propertyMinPrice?: number, propertyMaxPrice?: number, forSaleAge?: string, soldAge?: string) => {
		if (!('1' in this.propertiesCache)) throw Error('No cache');
		const deals = await this.dealsFinder.findDeals(this.propertiesCache['1'].soldProperties, this.propertiesCache['1'].forSaleProperties, distance, profit, soldMinPrice, soldMaxPrice, propertyMinPrice, propertyMaxPrice, forSaleAge, soldAge);
		return deals;
	}
}
