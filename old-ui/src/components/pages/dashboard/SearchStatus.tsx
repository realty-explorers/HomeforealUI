import { Col } from 'react-bootstrap';
import { Statistic } from 'antd';

type SearchParametersProps = {
	searchParameters: {
		minAge: '6m';
		minProfit: 40;
		minARV: 800000;
		radius: 2;
	};
};

const SearchStatus: React.FC<SearchParametersProps> = (
	props: SearchParametersProps
) => {
	return (
		<>
			<Col className="center-col">
				<Statistic
					title="Max time on sale"
					value={props.searchParameters.minAge}
				/>
			</Col>
			<Col className="center-col">
				<Statistic
					title="Min ARV"
					value={props.searchParameters.minARV}
				/>
			</Col>
			<Col className="center-col">
				<Statistic
					title="Min % Under comps"
					value={props.searchParameters.minProfit}
				/>
			</Col>
			<Col className="center-col">
				<Statistic
					title="Radius"
					value={props.searchParameters.radius}
				/>
			</Col>
		</>
	);
};

export default SearchStatus;
