import axios from 'axios';

const gateway_url = `${process.env.NEXT_PUBLIC_DEALS_SERVICE_HOST}`;
// const gateway_url = `http://localhost:9001`;

const getLocationSuggestions = async (searchTerm: string) => {
	return axios.get(`${gateway_url}/api/v1/location/suggest?searchTerm=${searchTerm}`, {
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		withCredentials: true
	});
};

const getLocationData = async (display: string, type: string, city: string, state: string) => {
	console.log('searching ' + display);
	return axios.get(`${gateway_url}/api/v1/location/data?display=${display}&type=${type}&city=${city}&state=${state}`, {
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		withCredentials: true
	});
};

export {
	getLocationSuggestions,
	getLocationData
};
