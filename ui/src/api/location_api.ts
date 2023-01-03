import axios from 'axios';

const gateway_url = `${process.env.REACT_APP_DEALS_SERVICE_HOST}:9001`;

const getLocationSuggestions = async (searchTerm: string) => {
	return axios.get(`${gateway_url}/api/v1/location/suggest?searchTerm=${searchTerm}`, {
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
	});
};

export {
	getLocationSuggestions,
};
