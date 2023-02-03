import axios from 'axios';

const gateway_url = `${process.env.REACT_APP_DEALS_SERVICE_HOST}:9001`;

const findDeals = async (regionId: number, distance: number, profit: number, soldMinPrice?: number, soldMaxPrice?: number, propertyMinPrice?: number, propertyMaxPrice?: number, daysOnZillow?: string) => {
	return axios.post(`${gateway_url}/api/v1/deals/findDeals`, {
		regionId, profit, distance, soldMinPrice, soldMaxPrice, propertyMinPrice, propertyMaxPrice, daysOnZillow
	}, {
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
	});
};

export {
	findDeals,
};
