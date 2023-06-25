import Property from '@/models/property';
import axios from 'axios';

const gateway_url = `${process.env.NEXT_PUBLIC_DEALS_SERVICE_HOST}`;


const findProperties = async (display: string, type: string, city: string, state: string) => {
	return axios.post(`${gateway_url}/api/v1/deals/findProperties`, {
		city, state, display, type
	}, {
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		withCredentials: true,
		// timeout: 120000
	});
};

const findDeals = async (regionId: number, distance: number, profit: number, soldMinPrice?: number, soldMaxPrice?: number, propertyMinPrice?: number, propertyMaxPrice?: number, soldAge?: number, forSaleAge?: number, minSoldArea?: number, maxSoldArea?: number, minForSaleArea?: number, maxForSaleArea?: number, minBeds?: number, maxBeds?: number, minBaths?: number, maxBaths?: number, updatedProperty?: Property) => {
	const buyBox = {
		compsMaxDistance: distance,
		underComps: profit,
		minArv: soldMinPrice,
		maxArv: soldMaxPrice,
		minPrice: propertyMinPrice,
		maxPrice: propertyMaxPrice,
		onSaleDays: forSaleAge,
		onSoldDays: soldAge,
		forSaleMinArea: minForSaleArea,
		forSaleMaxArea: maxForSaleArea,
		soldMinArea: minSoldArea,
		soldMaxArea: maxSoldArea,
		minBeds: minBeds,
		maxBeds: maxBeds,
		minBaths: minBaths,
		maxBaths: maxBaths
	}
	return axios.post(`${gateway_url}/api/v1/deals/findDeals`, {
		regionId, buyBox, updatedProperty
	}, {
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		withCredentials: true,
		// timeout: 120000
	});
};

export {
	findDeals, findProperties
};
