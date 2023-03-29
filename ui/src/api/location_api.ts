import axios from 'axios';

const gateway_url = `${process.env.DEALS_SERVICE_HOST}`;
// const gateway_url = `http://localhost:9001`;

const getLocationSuggestions = async (searchTerm: string) => {
	return axios.get(`http://localhost:9001/api/v1/location/suggest?searchTerm=${searchTerm}`, {
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		withCredentials: true
	});
};

export {
	getLocationSuggestions,
};
