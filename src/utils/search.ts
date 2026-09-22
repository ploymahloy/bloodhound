export type SearchResultItem = {
	id: string;
	name: string;
	type: 'business' | 'individual';
	service: string;
	services?: string[];
	address?: string;
	city: string;
	phone: string;
	avatarUrl?: string;
	promo?: string;
	latitude: number;
	longitude: number;
};

export type SearchQuery = {
	q?: string;
	city?: string;
};

const MOCK_LISTINGS: SearchResultItem[] = [
	{
		id: '1',
		name: 'Riverside Sound Studio',
		type: 'business',
		service: 'Recording Studio',
		services: ['Full-band tracking', 'Mixing & mastering', 'Podcast production'],
		address: '124 Main St, Suite 200, Nashville, TN',
		city: 'Nashville',
		phone: '(555) 123-4567',
		avatarUrl: undefined,
		promo: 'New artist special: 20% off your first full-day session.',
		latitude: 36.1668,
		longitude: -86.7745
	},
	{
		id: '2',
		name: 'Alex Chen',
		type: 'individual',
		service: 'Trumpet Player',
		services: ['Session recording', 'Live performance', 'Private lessons'],
		city: 'Nashville',
		phone: '(555) 987-6543',
		avatarUrl: undefined,
		promo: 'Now accepting new students for spring semester.',
		latitude: 36.1495,
		longitude: -86.792
	},
	{
		id: '3',
		name: 'Downtown Music Co.',
		type: 'business',
		service: 'Music Store',
		services: ['Instrument sales', 'Repairs & maintenance', 'Accessory shop'],
		address: '88 Oak Avenue, Nashville, TN',
		city: 'Nashville',
		phone: '(555) 246-8135',
		avatarUrl: undefined,
		promo: 'Buy one set of strings, get the second half off.',
		latitude: 36.1622,
		longitude: -86.778
	}
];

function normalizeCityToken(value: string) {
	return value.split(',')[0]?.trim().toLowerCase() ?? '';
}

function matchesCity(item: SearchResultItem, city: string) {
	const needle = normalizeCityToken(city);
	if (!needle) return true;
	return normalizeCityToken(item.city) === needle;
}

function matchesQuery(item: SearchResultItem, q: string) {
	const needle = q.trim().toLowerCase();
	if (!needle) return true;
	const haystack = [item.name, item.service, ...(item.services ?? [])].join(' ').toLowerCase();
	return haystack.includes(needle);
}

/**
 * Returns listings that match every provided query param.
 * Swap this body for a fetch of the same { q, city } when an API exists.
 */
export function searchListings(query: SearchQuery): SearchResultItem[] {
	const q = query.q?.trim() ?? '';
	const city = query.city?.trim() ?? '';
	if (!q && !city) return [];

	return MOCK_LISTINGS.filter(item => matchesCity(item, city) && matchesQuery(item, q));
}

export const NASHVILLE_CENTER: [number, number] = [36.1627, -86.7816];
export const US_FALLBACK_CENTER: [number, number] = [39.8283, -98.5795];

export function getSearchMapFallbackCenter(city: string): [number, number] {
	const token = normalizeCityToken(city);
	if (!token || token === 'nashville') return NASHVILLE_CENTER;
	return US_FALLBACK_CENTER;
}
