import React, { useCallback, useState, memo } from 'react';
import {
	GoogleMap,
	useJsApiLoader,
	Circle,
	Marker,
	InfoBox,
	OverlayView,
} from '@react-google-maps/api';

import { EnvironmentOutlined, CodepenCircleOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd';
import Deal from '../../models/deal';
import House from '../../models/house';

const containerStyle = {
	width: '100%',
	height: '25em',
};

const center = {
	lat: 33.429565,
	lng: -86.84005,
};

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

const soldHouseLocations = [
	{
		lat: 33.43208,
		lng: -86.84005,
	},
];

// const options = {
// 	strokeColor: '#FF0000',
// 	strokeOpacity: 0.3,
// 	strokeWeight: 2,
// 	fillColor: '#F9E076',
// 	fillOpacity: 0.15,
// 	clickable: false,
// 	draggable: false,
// 	editable: false,
// 	visible: true,
// 	radius: 3000,
// 	zIndex: 1,
// };

type MapsProps = {
	selectedDeal?: Deal;
};

const Maps: React.FC<MapsProps> = (props: MapsProps) => {
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: 'AIzaSyDRAjRxho27NBp9vLVYmuAxENL0QWf7Cvo',
	});
	const [map, setMap] = useState(null);
	const onLoad = useCallback(function callback(map: any) {
		// This is just an example of getting and using the map instance!!! don't just blindly copy!
		const bounds = new window.google.maps.LatLngBounds(center);
		// map.fitBounds(bounds);

		// setMap(map);
	}, []);

	const onUnmount = useCallback(function callback(map: any) {
		// setMap(null);
	}, []);

	const infoBox = () => {
		const divStyle = {
			background: 'white',
			border: '1px solid #ccc',
			padding: 15,
		};
		const onClick = () => {
			console.info('I have been clicked!');
		};
		const center = {
			lat: 33.772,
			lng: -117.214,
		};
		const options = { closeBoxURL: '', enableEventPropagation: true };
		const getPixelPositionOffset = (width: number, height: number) => ({
			x: -(width / 2),
			y: -(height / 2),
		});
		return (
			// <InfoBox onLoad={onLoad} options={options}>
			// 	<div
			// 		style={{
			// 			backgroundColor: 'yellow',
			// 			opacity: 0.75,
			// 			padding: 12,
			// 		}}>
			// 		<div>Hello, World!</div>
			// 	</div>
			// </InfoBox>
			<OverlayView
				position={center}
				/*
				 * An alternative to specifying position is specifying bounds.
				 * bounds can either be an instance of google.maps.LatLngBounds
				 * or an object in the following format:
				 * bounds={{
				 *    ne: { lat: 62.400471, lng: -150.005608 },
				 *    sw: { lat: 62.281819, lng: -150.287132 }
				 * }}
				 */
				/*
				 * 1. Specify the pane the OverlayView will be rendered to. For
				 *    mouse interactivity, use `OverlayView.OVERLAY_MOUSE_TARGET`.
				 *    Defaults to `OverlayView.OVERLAY_LAYER`.
				 */
				mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
				/*
				 * 2. Tweak the OverlayView's pixel position. In this case, we're
				 *    centering the content.
				 */
				getPixelPositionOffset={getPixelPositionOffset}
				/*
				 * 3. Create OverlayView content using standard React components.
				 */
			>
				<div
					style={{
						background: `white`,
						border: `1px solid #ccc`,
						padding: 15,
					}}>
					<h1>OverlayView</h1>
					{/* <button onClick={props.onClick} style={{ height: 60 }}>
          I have been clicked {props.count} time{props.count > 1 ? `s` : ``}
        </button> */}
				</div>
			</OverlayView>
		);
	};

	const selectedHouseMarker = () => {
		return props.selectedDeal ? (
			<Marker
				position={{
					lat: props.selectedDeal!.house.latitude,
					lng: props.selectedDeal!.house.longitude,
				}}
			/>
		) : (
			<></>
		);
	};

	const soldHousesMarkers = () => {
		return props.selectedDeal ? (
			props.selectedDeal?.relevantSoldHouses.map((house: House) => (
				<Marker
					position={{ lat: house.latitude, lng: house.longitude }}
					icon={
						'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
					}
				/>
			))
		) : (
			<></>
		);
	};

	const houseRadiusCircle = () => {
		const distanceInKilometers =
			(props.selectedDeal?.distance || 0) * 1609.34;
		const options = {
			strokeColor: '#FF0000',
			strokeOpacity: 0.3,
			strokeWeight: 2,
			fillColor: '#F9E076',
			fillOpacity: 0.15,
			clickable: false,
			draggable: false,
			editable: false,
			visible: true,
			radius: distanceInKilometers,
			zIndex: 1,
		};

		return props.selectedDeal ? (
			<Circle
				key={1}
				// optional
				// onLoad={onLoad}
				// optional
				// onUnmount={onUnmount}
				// required
				center={{
					lat: props.selectedDeal.house.latitude,
					lng: props.selectedDeal.house.longitude,
				}}
				// required
				options={options}
			/>
		) : (
			<></>
		);
	};

	return isLoaded ? (
		<GoogleMap
			mapContainerStyle={containerStyle}
			center={
				(props.selectedDeal && {
					lat: props.selectedDeal.house.latitude,
					lng: props.selectedDeal.house.longitude,
				}) ||
				center
			}
			zoom={12}
			onLoad={onLoad}
			onUnmount={onUnmount}>
			{props.selectedDeal ? (
				<>
					{houseRadiusCircle()}
					{selectedHouseMarker()}
					{soldHousesMarkers()}
				</>
			) : (
				<></>
			)}
		</GoogleMap>
	) : (
		<>
			<Skeleton.Node active={true}>
				<CodepenCircleOutlined
					style={{ fontSize: 40, color: '#bfbfbf' }}
				/>
			</Skeleton.Node>
		</>
	);
};

export default memo(Maps);
