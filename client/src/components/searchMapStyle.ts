import type { StyleSpecification } from 'maplibre-gl';

const SOURCE = 'openmaptiles';

/**
 * Planet tiles omit roads below zoom 4. The wide US view is zoom 3, so
 * the source minzoom samples those road tiles there.
 */
const SOURCE_MIN_ZOOM = 4;

const LINE_GEOMETRY = ['match', ['geometry-type'], ['LineString', 'MultiLineString'], true, false];
const POINT_GEOMETRY = ['match', ['geometry-type'], ['Point', 'MultiPoint'], true, false];

const PLACE_NAME = ['coalesce', ['get', 'name_en'], ['get', 'name:latin'], ['get', 'name']];

const roadLayer = (
	id: string,
	classes: string[],
	color: string,
	widths: number[],
	minzoom?: number
) => ({
	id,
	type: 'line' as const,
	source: SOURCE,
	'source-layer': 'transportation',
	minzoom,
	filter: ['all', LINE_GEOMETRY, ['match', ['get', 'class'], classes, true, false]],
	layout: {
		'line-cap': 'round',
		'line-join': 'round'
	},
	paint: {
		'line-color': color,
		'line-width': ['interpolate', ['exponential', 1.4], ['zoom'], ...widths]
	}
});

const placeLayer = (
	id: string,
	filter: unknown[],
	size: number | unknown[],
	minzoom?: number
) => ({
	id,
	type: 'symbol',
	source: SOURCE,
	'source-layer': 'place',
	minzoom,
	filter,
	layout: {
		'text-field': PLACE_NAME,
		'text-font': ['Noto Sans Regular'],
		'text-size': size,
		'text-transform': 'uppercase',
		'text-letter-spacing': 0.06,
		'text-max-width': 8,
		'text-padding': 2,
		'symbol-sort-key': ['get', 'rank']
	},
	paint: {
		'text-color': '#888888',
		'text-halo-color': '#0a0a0a',
		'text-halo-width': 1.25
	}
});

export const searchMapStyle = {
	version: 8,
	glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
	sources: {
		[SOURCE]: {
			type: 'vector',
			url: 'https://tiles.openfreemap.org/planet',
			minzoom: SOURCE_MIN_ZOOM
		}
	},
	layers: [
		{
			id: 'background',
			type: 'background',
			paint: { 'background-color': '#0a0a0a' }
		},
		roadLayer('road-service', ['service'], '#3a3a3a', [11, 0.4, 13, 1.1, 16, 6], 11),
		roadLayer('road-minor', ['minor'], '#454545', [8, 0.4, 12, 1.5, 16, 10], 8),
		roadLayer('road-secondary', ['secondary', 'tertiary'], '#5c5c5c', [6, 0.5, 10, 1.6, 14, 6, 16, 12], 6),
		roadLayer('road-primary', ['trunk', 'primary'], '#707070', [4, 0.7, 8, 1.5, 12, 3.2, 16, 12], 4),
		roadLayer('road-motorway', ['motorway'], '#8a8a8a', [2, 1.1, 3, 1.5, 6, 2.2, 12, 4.5, 16, 16]),
		placeLayer('place-town', ['all', POINT_GEOMETRY, ['==', ['get', 'class'], 'town']], 11, 7),
		placeLayer(
			'place-city',
			['all', POINT_GEOMETRY, ['==', ['get', 'class'], 'city'], ['>', ['get', 'rank'], 5]],
			12,
			5
		),
		placeLayer(
			'place-city-major',
			['all', POINT_GEOMETRY, ['==', ['get', 'class'], 'city'], ['<=', ['get', 'rank'], 5]],
			['interpolate', ['linear'], ['zoom'], 3, 12, 8, 14, 14, 16]
		)
	]
} as unknown as StyleSpecification;
