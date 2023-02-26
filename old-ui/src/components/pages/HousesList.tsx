import {
	LikeOutlined,
	MessageOutlined,
	StarOutlined,
	LinkOutlined,
	HeatMapOutlined,
	EnvironmentOutlined,
} from '@ant-design/icons';
import { Avatar, List, Space, Image, Statistic, Card } from 'antd';
import { Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { exportMap } from '../../utils/MapUtils';
import houseIcon from '../../resources/house.png';
import './HousesList.scss';
import { findDeals } from '../../api/deals_api';
import { setDefaultResultOrder } from 'dns/promises';
import Deal from '../../models/deal';

const { Meta } = Card;

const data = Array.from({ length: 23 }).map((_, i) => ({
	href: 'https://ant.design',
	title: `412 Berry Ave, Homewood, AL 35209`,
	avatar: houseIcon,
	profit: 0,
	avr: 800000,
	price: 1200000,
	image: 'https://s',
}));

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
	<Space>
		{React.createElement(icon)}
		{text}
	</Space>
);

const houseLocations = [
	{
		lat: 33.480927,
		lng: -86.78688,
	},
	{
		lat: 33.429565,
		lng: -86.84263,
	},
];

type HouseListProps = {
	deals: Deal[];
	setSelectedDeal: (deal: Deal) => void;
};

const HousesList: React.FC<HouseListProps> = (props: HouseListProps) => {
	const [loading, setLoading] = useState(false);
	const [soldMinPrice, setSoldMinPrice] = useState<number>(800000);

	const mapOptions = {
		center: {
			lat: 33.480927,
			lng: -86.78688,
		},
		zoom: 10,
		mapTypeId: 'roadmap',
	};

	const handleOnsave = (deal: Deal) => {
		alert(deal);
	};
	const handleShowOnMap = (deal: Deal) => {
		props.setSelectedDeal(deal);
	};

	const constructGoogleSearchUrl = (address: string) => {
		const url = `https://www.google.com/search?q=${address}`;
		return url;
	};
	const handleLinkClicked = (address: string) => {
		const url = constructGoogleSearchUrl(address);
		window.open(url, '_blank', 'noopener,noreferrer');
	};

	return (
		<List
			className="houses-list"
			itemLayout="vertical"
			size="large"
			pagination={{
				onChange: (page) => {
					console.log(page);
				},
				pageSize: 3,
			}}
			dataSource={props.deals}
			grid={{
				gutter: 16,
				xs: 1,
				sm: 2,
				md: 2,
				lg: 2,
				xl: 2,
				xxl: 3,
			}}
			renderItem={(deal: Deal) => (
				<List.Item key={deal.house.id}>
					<Card
						// onMouseOver={() => alert('hi')}
						actions={[
							<StarOutlined
								title="Save"
								onClick={() => handleOnsave(deal)}
							/>,
							<EnvironmentOutlined
								title="Show On Map"
								onClick={() => handleShowOnMap(deal)}
							/>,
							<LinkOutlined
								title="Go to link"
								onClick={() =>
									handleLinkClicked(deal.house.address)
								}
							/>,
						]}>
						<Meta
							avatar={<Avatar src={houseIcon} />}
							title={
								<a
									href={constructGoogleSearchUrl(
										deal.house.address
									)}>
									{deal.house.address}
								</a>
							}
						/>
						<Row className="space-row house-row">
							<Col className="center-col">
								<Statistic
									title="Price"
									value={deal.house.price}
									suffix="$"
								/>
								{/* <Statistic
									title="ARV"
									value={soldMinPrice}
									suffix="$"
								/> */}
							</Col>
							<Col className="center-col">
								<Statistic
									title="Under Comps %"
									value={deal.profit}
									precision={0}
									suffix="%"
								/>
								<Statistic
									title="Sqft"
									value={deal.house.area}
								/>
							</Col>
							<Col>
								<Image
									width={200}
									height="100%"
									alt={'logo'}
									src={deal.house.imgSrc}
								/>
							</Col>
						</Row>
					</Card>
				</List.Item>
			)}
		/>
	);
};

export default HousesList;
