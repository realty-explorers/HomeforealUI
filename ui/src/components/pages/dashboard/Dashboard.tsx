import { useForm, SubmitHandler } from 'react-hook-form';
import {
	Box,
	Modal,
	SpeedDial,
	SpeedDialAction,
	SpeedDialIcon,
	Typography,
} from '@mui/material';
import { Share, Upload, Search } from '@mui/icons-material';
import { Affix, Statistic } from 'antd';
import Reac, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { findDeals } from '../../../api/deals_api';
import Deal from '../../../models/deal';
import HousesList from '../HousesList';
import Maps from './Maps';
import SearchStatus from './SearchStatus';
import PropertySearch from '../propertySearch/PropertySearch';
import './Dashboard.scss';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '50%',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	borderRadius: '20px',
	boxShadow: 24,
	p: 4,
};

type Inputs = {
	zillowUrl: string;
	location: string;
	arv: number;
	underComps: number;
	radius: number;
	age: string;
	price: number[];
};

const Dashboard: React.FC = (props: any) => {
	const { register, handleSubmit, watch, control, formState } =
		useForm<Inputs>();

	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(true);
	const [deals, setDeals] = useState<Deal[]>([]);
	const [selectedDeal, setSelectedDeal] = useState<Deal>();
	const [soldMinPrice, setSoldMinPrice] = useState<number>(800000);
	const [searchParameters, setSearchParameters] = useState<any>({
		minAge: '6m',
		minProfit: 40,
		minARV: 800000,
		radius: 2,
	});
	const [top, setTop] = useState(10);
	const newSearch = () => {
		setOpen(!open);
	};

	const actions = [
		{ icon: <Search />, name: 'Search', action: newSearch },
		{ icon: <Upload />, name: 'Export' },
		{ icon: <Share />, name: 'Share' },
	];

	useEffect(() => {
		const getData = async () => {
			try {
				setLoading(true);
				// await fetchHouses();
			} catch (error: any) {
			} finally {
				setLoading(false);
			}
		};
		getData();
	}, []);

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		try {
			setLoading(true);
			const response = await findDeals(
				data.zillowUrl,
				data.radius,
				data.underComps,
				data.price[0],
				data.price[1],
				'6m'
			);
			if (response.status === 200) {
				setDeals(response.data);
				alert('done');
			} else throw Error(response.data);
		} catch (error) {
			alert(error);
		} finally {
			setLoading(false);
		}
	};

	const fetchHouses = async () => {
		try {
			alert('fetching');
			setLoading(true);
			const res = await findDeals(
				'https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22usersSearchTerm%22%3A%22Homewood%2C%20AL%22%2C%22mapBounds%22%3A%7B%22west%22%3A-86.90875740551759%2C%22east%22%3A-86.70791359448243%2C%22south%22%3A33.418826781825295%2C%22north%22%3A33.496020386086656%7D%2C%22regionSelection%22%3A%5B%7B%22regionId%22%3A45794%2C%22regionType%22%3A6%7D%5D%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22monthlyPayment%22%3A%7B%22min%22%3A0%2C%22max%22%3A3143%7D%2C%22doz%22%3A%7B%22value%22%3A%226m%22%7D%2C%22sortSelection%22%3A%7B%22value%22%3A%22globalrelevanceex%22%7D%2C%22isAllHomes%22%3A%7B%22value%22%3Atrue%7D%2C%22isCondo%22%3A%7B%22value%22%3Afalse%7D%2C%22isMultiFamily%22%3A%7B%22value%22%3Afalse%7D%2C%22isManufactured%22%3A%7B%22value%22%3Afalse%7D%2C%22isLotLand%22%3A%7B%22value%22%3Afalse%7D%2C%22isTownhouse%22%3A%7B%22value%22%3Afalse%7D%2C%22isApartment%22%3A%7B%22value%22%3Afalse%7D%2C%22isApartmentOrCondo%22%3A%7B%22value%22%3Afalse%7D%7D%2C%22isListVisible%22%3Atrue%2C%22mapZoom%22%3A13%7D&wants={%22cat1%22:[%22listResults%22,%22mapResults%22],%22cat2%22:[%22total%22]}&requestId=3',
				2,
				40,
				800000,
				undefined,
				'6m'
			);
			if (res.status === 200) {
				console.log(res.data);
				setDeals(res.data);
			}
		} catch (error: any) {
			// message.error(error.message);
			alert(error);
		} finally {
			setLoading(false);
		}
	};

	const handleSearchProperties = async (properties: Deal[]) => {
		setDeals(properties);
	};

	return (
		<Container>
			<Row className="center-row">
				<Maps selectedDeal={selectedDeal} />
			</Row>
			<Row className="center-row">
				<SearchStatus searchParameters={searchParameters} />
			</Row>
			<Row className="center-row">
				<HousesList deals={deals} setSelectedDeal={setSelectedDeal} />
			</Row>
			<SpeedDial
				ariaLabel="SpeedDial basic example"
				sx={{ position: 'absolute', bottom: 16, right: 16 }}
				icon={<SpeedDialIcon />}>
				{actions.map((action) => (
					<SpeedDialAction
						key={action.name}
						icon={action.icon}
						tooltipTitle={action.name}
						onClick={action.action}
					/>
				))}
			</SpeedDial>
			<Modal
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<Box className="search-modal-container">
					<PropertySearch
						control={control}
						setProperties={handleSearchProperties}
						handleSubmit={handleSubmit(onSubmit)}
						loading={loading}
						setLoading={setLoading}
						// formState={formState}
					/>
				</Box>
			</Modal>
		</Container>
	);
};

export default Dashboard;
