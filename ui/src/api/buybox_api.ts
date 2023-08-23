import Property, { PropertyType } from '@/models/property';
import { MenuOpenTwoTone } from '@mui/icons-material';
import axios from 'axios';

const rootUrl = `http://20.85.134.149:8001/buyboxes`;
const generalBuyboxId = '419f2e00-e861-4ae2-8772-32450350468e';


const getAllBuyboxes = async () => {
	return axios.get(`${rootUrl}/all`,
		{
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			withCredentials: true,
			// timeout: 120000
		});
};

const getGeneralBuyboxMetadata = async () => {
	return axios.get(`${rootUrl}/read_config/${generalBuyboxId}`,
		{
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			withCredentials: true,
			// timeout: 120000
		});
};

const getGeneralSummary = async () => {
	return axios.get(`${rootUrl}/analysis/summary/${generalBuyboxId}`,
		{
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			withCredentials: true,
			// timeout: 120000
		});
};

const getGeneralSummary1 = async () => {
	return axios.get(`${rootUrl}/analysis/summary/${generalBuyboxId}`,
		{
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			withCredentials: true,
			// timeout: 120000
		});
};





export {
};
