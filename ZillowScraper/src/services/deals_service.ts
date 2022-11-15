import axios from 'axios';
import DealsFinder from './DealsFinder';

export default class DealsService {
	private dealsFinder: DealsFinder;

	constructor() {
		this.dealsFinder = new DealsFinder();
	}

	public getDeals = async (zillowSearchUrl: string, distance: number, profit: number, soldMinPrice?: number, soldMaxPrice?: number, daysOnZillow?: string) => {
		// const zillowSearchUrl = 'https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState=%7B%22mapBounds%22%3A%7B%22north%22%3A33.52050420220952%2C%22east%22%3A-86.63945459448242%2C%22south%22%3A33.4429026929069%2C%22west%22%3A-86.84029840551757%7D%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22monthlyPayment%22%3A%7B%22min%22%3A0%2C%22max%22%3A3143%7D%2C%22doz%22%3A%7B%22value%22%3A%226m%22%7D%2C%22sortSelection%22%3A%7B%22value%22%3A%22globalrelevanceex%22%7D%2C%22isAllHomes%22%3A%7B%22value%22%3Atrue%7D%2C%22isCondo%22%3A%7B%22value%22%3Afalse%7D%2C%22isMultiFamily%22%3A%7B%22value%22%3Afalse%7D%2C%22isManufactured%22%3A%7B%22value%22%3Afalse%7D%2C%22isLotLand%22%3A%7B%22value%22%3Afalse%7D%2C%22isTownhouse%22%3A%7B%22value%22%3Afalse%7D%2C%22isApartment%22%3A%7B%22value%22%3Afalse%7D%2C%22isApartmentOrCondo%22%3A%7B%22value%22%3Afalse%7D%7D%2C%22isListVisible%22%3Atrue%2C%22mapZoom%22%3A13%2C%22regionSelection%22%3A%5B%7B%22regionId%22%3A26027%2C%22regionType%22%3A6%7D%5D%2C%22pagination%22%3A%7B%7D%7D&wants={%22cat1%22:[%22listResults%22,%22mapResults%22],%22cat2%22:[%22total%22]}&requestId=6';
		// const deals = await this.dealsFinder.getDeals(2, 40, zillowSearchUrl, 800000, undefined, '6m');
		const deals = await this.dealsFinder.getDeals(distance, profit, zillowSearchUrl, soldMinPrice, soldMaxPrice, daysOnZillow);
		return deals;
	};
}
