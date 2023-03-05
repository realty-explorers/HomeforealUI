import axios from 'axios';

const gateway_url = `${process.env.NEXT_PUBLIC_DEALS_SERVICE_HOST}`;
// const gateway_url = `http://localhost:9001`;

const findNewDeals = async (regionId: number, distance: number, profit: number, soldMinPrice?: number, soldMaxPrice?: number, propertyMinPrice?: number, propertyMaxPrice?: number, daysOnZillow?: string) => {
	return axios.post(`${gateway_url}/api/v1/deals/findNewDeals`, {
		regionId, profit, distance, soldMinPrice, soldMaxPrice, propertyMinPrice, propertyMaxPrice, daysOnZillow
	}, {
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		timeout: 120000
	});
};

const findProperties = async (regionId: number) => {
	return axios.post(`${gateway_url}/api/v1/deals/findProperties`, {
		regionId
	}, {
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		timeout: 120000
	});
};

const findDeals = async (regionId: number, distance: number, profit: number, soldMinPrice?: number, soldMaxPrice?: number, propertyMinPrice?: number, propertyMaxPrice?: number, soldAge?: number, forSaleAge?: number, minArea?: number, maxArea?: number, minBeds?: number, maxBeds?: number, minBaths?: number, maxBaths?: number) => {
	return axios.post(`${gateway_url}/api/v1/deals/findDeals`, {
		regionId, profit, distance, soldMinPrice, soldMaxPrice, propertyMinPrice, propertyMaxPrice, forSaleAge, soldAge, minArea, maxArea, minBeds, maxBeds, minBaths, maxBaths
	}, {
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		timeout: 120000
	});
};

export {
	findNewDeals, findDeals, findProperties
};
