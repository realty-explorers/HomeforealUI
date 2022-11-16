import axios from 'axios';

const gateway_url = `http://localhost:9001`;

const findDeals = async (zillowSearchUrl: string, distance: number, profit: number, soldMinPrice?: number, soldMaxPrice?: number, daysOnZillow?: string) => {
	return axios.post(`${gateway_url}/api/v1/deals/findDeals`, {
		zillowSearchUrl, profit, distance, soldMinPrice, soldMaxPrice, daysOnZillow
	}, {
		headers: {
			'Access-Control-Allow-Origin': '*'
		}
	});
};

export {
	findDeals,
};
