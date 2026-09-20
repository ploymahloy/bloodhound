import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './SearchMap.css';

const NASHVILLE_CENTER: [number, number] = [36.1627, -86.7816];
const DEFAULT_ZOOM = 13;
const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION =
	'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export type SearchMapItem = {
	id: string;
	name: string;
	latitude: number;
	longitude: number;
};

export type SearchMapProps = {
	items: SearchMapItem[];
	selectedId: string | null;
	onSelect: (item: SearchMapItem) => void;
};

const pinIcon = L.divIcon({
	className: 'SearchMap-pin',
	iconSize: [16, 16],
	iconAnchor: [8, 8],
	html: '<span class="SearchMap-pinDot"></span>'
});

const pinIconSelected = L.divIcon({
	className: 'SearchMap-pin SearchMap-pin--selected',
	iconSize: [22, 22],
	iconAnchor: [11, 11],
	html: '<span class="SearchMap-pinDot"></span>'
});

function prefersReducedMotion() {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function FitBounds({ items, selectedId }: { items: SearchMapItem[]; selectedId: string | null }) {
	const map = useMap();
	const boundsKey = items.map(item => `${item.id}:${item.latitude}:${item.longitude}`).join('|');

	useEffect(() => {
		const animate = !prefersReducedMotion();
		if (items.length === 0) {
			map.setView(NASHVILLE_CENTER, DEFAULT_ZOOM, { animate });
			return;
		}

		const bounds = L.latLngBounds(items.map(item => [item.latitude, item.longitude]));
		map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15, animate });
	}, [map, boundsKey, items]);

	useEffect(() => {
		if (!selectedId) return;
		const item = items.find(result => result.id === selectedId);
		if (!item) return;
		map.panTo([item.latitude, item.longitude], { animate: !prefersReducedMotion() });
	}, [map, selectedId, items]);

	return null;
}

function InvalidateOnResize() {
	const map = useMap();

	useEffect(() => {
		const container = map.getContainer();
		const observer = new ResizeObserver(() => {
			map.invalidateSize();
		});
		observer.observe(container);
		map.invalidateSize();
		return () => observer.disconnect();
	}, [map]);

	return null;
}

export function SearchMap({ items, selectedId, onSelect }: SearchMapProps) {
	return (
		<div className='SearchMap'>
			<MapContainer
				className='SearchMap-leaflet'
				center={NASHVILLE_CENTER}
				zoom={DEFAULT_ZOOM}
				scrollWheelZoom
				attributionControl>
				<TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} />
				<InvalidateOnResize />
				<FitBounds items={items} selectedId={selectedId} />
				{items.map(item => (
					<Marker
						key={item.id}
						position={[item.latitude, item.longitude]}
						icon={item.id === selectedId ? pinIconSelected : pinIcon}
						title={item.name}
						eventHandlers={{
							click: () => onSelect(item)
						}}
					/>
				))}
			</MapContainer>
		</div>
	);
}
