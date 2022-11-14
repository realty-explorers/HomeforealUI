import { Container, Row, Col } from 'react-bootstrap';
import HousesList from './HousesList';
import Maps from './Maps';

const Home: React.FC = (props: any) => {
	return (
		<Container>
			<Row className="center-row">
				<Maps />
			</Row>
			<Row className="center-row">
				<HousesList />
			</Row>
		</Container>
	);
};

export default Home;
