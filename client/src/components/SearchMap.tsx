import { useEffect, useRef, useState } from 'react';
import { LngLatBounds, Map as MapLibreMap, Marker, NavigationControl, setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';

import { US_FALLBACK_CENTER } from '../lib/search';
import { searchMapStyle } from './searchMapStyle';
import './SearchMap.css';

setWorkerUrl(workerUrl);

// MapLibre zoom 0 is the world at 512px, one step closer than the old Leaflet zoom numbers.
const DEFAULT_ZOOM = 12;
const EMPTY_FALLBACK_ZOOM = 3;
const FIT_MAX_ZOOM = 14;

export type SearchMapItem = {
	id: string;
	name: string;
	latitude: number;
	longitude: number;
};

export type SearchMapProps = {
	items: SearchMapItem[];
	selectedId: string | null;
	fallbackCenter?: [number, number];
	onSelect: (item: SearchMapItem) => void;
};

const prefersReducedMotion = () => {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const moveDuration = () => (prefersReducedMotion() ? 0 : 500);

const createPinElement = (item: SearchMapItem, onSelect: (item: SearchMapItem) => void) => {
	const button = document.createElement('button');
	button.type = 'button';
	button.className = 'SearchMap-pin';
	button.title = item.name;
	button.setAttribute('aria-label', item.name);
	button.innerHTML = '<span class="SearchMap-pinDot"></span>';
	button.addEventListener('click', event => {
		event.stopPropagation();
		onSelect(item);
	});
	return button;
};

export const SearchMap = ({ items, selectedId, fallbackCenter = US_FALLBACK_CENTER, onSelect }: SearchMapProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const markersRef = useRef<globalThis.Map<string, Marker>>(new globalThis.Map());
	const onSelectRef = useRef(onSelect);
	const fallbackRef = useRef(fallbackCenter);
	const [map, setMap] = useState<MapLibreMap | null>(null);
	onSelectRef.current = onSelect;
	fallbackRef.current = fallbackCenter;

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const nextMap = new MapLibreMap({
			container,
			style: searchMapStyle,
			center: [fallbackRef.current[1], fallbackRef.current[0]],
			zoom: DEFAULT_ZOOM,
			dragRotate: false,
			pitchWithRotate: false,
			touchPitch: false
		});
		nextMap.addControl(new NavigationControl({ showCompass: false }), 'top-left');
		nextMap.touchZoomRotate.disableRotation();
		nextMap.keyboard.disableRotation();

		const observer = new ResizeObserver(() => {
			nextMap.resize();
		});
		observer.observe(container);
		nextMap.resize();
		setMap(nextMap);

		return () => {
			observer.disconnect();
			markersRef.current.forEach(marker => marker.remove());
			markersRef.current.clear();
			nextMap.remove();
			setMap(null);
		};
	}, []);

	useEffect(() => {
		if (!map) return;

		const duration = moveDuration();
		if (items.length === 0) {
			const isUsWide =
				fallbackCenter[0] === US_FALLBACK_CENTER[0] && fallbackCenter[1] === US_FALLBACK_CENTER[1];
			map.easeTo({
				center: [fallbackCenter[1], fallbackCenter[0]],
				zoom: isUsWide ? EMPTY_FALLBACK_ZOOM : DEFAULT_ZOOM,
				duration
			});
			return;
		}

		const bounds = new LngLatBounds();
		for (const item of items) bounds.extend([item.longitude, item.latitude]);
		map.fitBounds(bounds, { padding: 40, maxZoom: FIT_MAX_ZOOM, linear: true, duration });
	}, [map, items, fallbackCenter]);

	useEffect(() => {
		if (!map) return;

		const markers = markersRef.current;
		const nextIds = new Set(items.map(item => item.id));
		for (const [id, marker] of markers) {
			if (nextIds.has(id)) continue;
			marker.remove();
			markers.delete(id);
		}

		for (const item of items) {
			let marker = markers.get(item.id);
			if (!marker) {
				const element = createPinElement(item, selected => onSelectRef.current(selected));
				marker = new Marker({ element, anchor: 'center' })
					.setLngLat([item.longitude, item.latitude])
					.addTo(map);
				markers.set(item.id, marker);
			} else {
				marker.setLngLat([item.longitude, item.latitude]);
			}
			marker.getElement().classList.toggle('SearchMap-pin--selected', item.id === selectedId);
		}
	}, [map, items, selectedId]);

	useEffect(() => {
		if (!map || !selectedId) return;
		const item = items.find(result => result.id === selectedId);
		if (!item) return;
		map.easeTo({
			center: [item.longitude, item.latitude],
			duration: moveDuration()
		});
	}, [map, selectedId, items]);

	return (
		<div className='SearchMap'>
			<div ref={containerRef} className='SearchMap-canvas' />
		</div>
	);
};
