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
import React from 'react';
import { exportMap } from '../../utils/MapUtils';
import zillowIcon from '../../resources/zillow-icon.svg';
import './HousesList.scss';

const { Meta } = Card;

const data = Array.from({ length: 23 }).map((_, i) => ({
	href: 'https://ant.design',
	title: `412 Berry Ave, Homewood, AL 35209`,
	avatar: zillowIcon,
	content:
		'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
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

const HousesList: React.FC = (props: any) => {
	const mapOptions = {
		center: {
			lat: 33.480927,
			lng: -86.78688,
		},
		zoom: 10,
		mapTypeId: 'roadmap',
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
			dataSource={data}
			grid={{
				gutter: 16,
				xs: 1,
				sm: 2,
				md: 2,
				lg: 2,
				xl: 2,
				xxl: 3,
			}}
			renderItem={(item) => (
				<List.Item key={item.title}>
					<Card
						// onMouseOver={() => alert('hi')}
						actions={[
							<IconText
								icon={StarOutlined}
								text="Save"
								key="list-vertical-star-o"
							/>,
							<IconText
								icon={EnvironmentOutlined}
								text="Show on map"
								key="list-vertical-like-o"
							/>,
							<IconText
								icon={LinkOutlined}
								text="Go to link"
								key="list-vertical-message"
							/>,
						]}>
						<Meta
							avatar={<Avatar src={item.avatar} />}
							title={<a href={item.href}>{item.title}</a>}
						/>
						<Row className="center-row house-row">
							<Col className="center-col">
								<Statistic
									title="Price"
									value={1200000}
									suffix="$"
								/>
								<Statistic
									title="AVR"
									value={800000}
									suffix="$"
								/>
							</Col>
							<Col className="center-col">
								<Statistic
									title="Under Comps"
									value={30}
									suffix="%"
								/>
								<Statistic title="Sqft" value={200} />
							</Col>
							<Col>
								<Image
									width={200}
									height="100%"
									alt={'logo'}
									src="https://photos.zillowstatic.com/fp/be2b09bc41f17fc99efc3cd559c2a8d0-p_e.jpg"
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
