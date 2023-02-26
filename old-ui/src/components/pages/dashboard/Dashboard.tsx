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
import LocationSuggestion from '../../../models/location_suggestions';

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
	location: LocationSuggestion;
	arv: number[];
	price: number[];
	underComps: number;
	radius: number;
	age: number;
};

const Dashboard: React.FC = (props: any) => {
	const { register, handleSubmit, watch, control, formState, setValue } =
		useForm<Inputs>();

	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(true);
	const [deals, setDeals] = useState<Deal[]>([]);
	const [selectedDeal, setSelectedDeal] = useState<Deal>();
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
			setSearchParameters({
				location: data.location,
				minAge: data.age,
				minProfit: data.underComps,
				minARV: data.price[0],
				radius: data.radius,
			});
			const ageIndex: { [index: number]: string } = {
				0: '1d',
				1: '7d',
				2: '14d',
				3: '30d',
				4: '90d',
				5: '6m',
				6: '12m',
				7: '24m',
				8: '36m',
			};
			const response = await findDeals(
				data.location.metaData.regionId,
				data.radius,
				data.underComps,
				data.arv[0],
				data.arv[1],
				data.price[0],
				data.price[1],
				ageIndex[data.age]
			);
			if (response.status === 200) {
				setDeals(response.data);
				alert('done');
			} else throw Error(response.data);
		} catch (error) {
			console.log(JSON.stringify(error));
			alert(JSON.stringify(error));
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
						setValue={setValue}
						setProperties={handleSearchProperties}
						handleSubmit={handleSubmit(onSubmit)}
						loading={loading}
						setLoading={setLoading}
					/>
				</Box>
			</Modal>
		</Container>
	);
};

export default Dashboard;
