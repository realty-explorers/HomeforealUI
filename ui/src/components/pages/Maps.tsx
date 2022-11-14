import React, { useCallback, useState, memo } from 'react';
import {
	GoogleMap,
	useJsApiLoader,
	Circle,
	Marker,
} from '@react-google-maps/api';

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
	radius: 3000,
	zIndex: 1,
};

const Maps: React.FC = (props: any) => {
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: 'AIzaSyDRAjRxho27NBp9vLVYmuAxENL0QWf7Cvo',
	});
	const [map, setMap] = useState(null);
	const onLoad = useCallback(function callback(map: any) {
		// This is just an example of getting and using the map instance!!! don't just blindly copy!
		const bounds = new window.google.maps.LatLngBounds(center);
		// map.fitBounds(bounds);

		setMap(map);
	}, []);

	const onUnmount = useCallback(function callback(map: any) {
		setMap(null);
	}, []);
	return isLoaded ? (
		<GoogleMap
			mapContainerStyle={containerStyle}
			center={center}
			zoom={12}
			onLoad={onLoad}
			onUnmount={onUnmount}>
			{/* Child components, such as markers, info windows, etc. */}
			<Circle
				// optional
				// onLoad={onLoad}
				// optional
				// onUnmount={onUnmount}
				// required
				center={center}
				// required
				options={options}
			/>
			{houseLocations.map((houseLocation: any) => (
				<Marker position={houseLocation} />
			))}

			{soldHouseLocations.map((houseLocation: any) => (
				<Marker
					position={houseLocation}
					icon={
						'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
					}
				/>
			))}
			{/* <Marker
				// icon={{
				// 	path: google.maps.SymbolPath.CIRCLE,
				// 	scale: 7,
				// }}
				position={markerCenter}
			/> */}
		</GoogleMap>
	) : (
		<></>
	);
};

export default memo(Maps);
