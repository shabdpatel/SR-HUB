import React, { useEffect, useCallback } from 'react';
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMap,
	useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapContent = ({
	center,
	zoom,
	selectedLocation,
	onLocationChange,
	onZoomChange,
}) => {
	const map = useMap();

	useEffect(() => {
		map.setView(center, zoom);
		map.zoomControl.setPosition('bottomright');
	}, [center, zoom, map]);

	const handleClick = useCallback(
		e => {
			const { lat, lng } = e.latlng;
			onLocationChange(
				[lat, lng],
				null, // Pass null as displayName to trigger reverse geocoding
				false // Don't autocenter on pin drop
			);
		},
		[onLocationChange]
	);

	useMapEvents({
		click: handleClick,
		zoomend: () => {
			onZoomChange(map.getZoom());
		},
	});

	return (
		<>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			{selectedLocation && (
				<Marker position={selectedLocation.coordinates}>
					<Popup>{selectedLocation.displayName}</Popup>
				</Marker>
			)}
		</>
	);
};

const Map = React.forwardRef(
	(
		{ center, zoom, selectedLocation, onLocationChange, onZoomChange },
		ref
	) => {
		return (
			<MapContainer
				center={center}
				zoom={zoom}
				ref={ref}
				style={{ height: '100%', width: '100%' }}
				zoomControl={true}
				minZoom={3}
				maxZoom={18}
				maxBounds={[
					[-90, -180],
					[90, 180],
				]}
				maxBoundsViscosity={1.0}
				worldCopyJump={true}>
				<MapContent
					center={center}
					zoom={zoom}
					selectedLocation={selectedLocation}
					onLocationChange={onLocationChange}
					onZoomChange={onZoomChange}
				/>
			</MapContainer>
		);
	}
);

export default Map;
