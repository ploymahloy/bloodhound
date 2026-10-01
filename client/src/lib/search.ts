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

export type SearchNear = {
	latitude: number;
	longitude: number;
	/** Defaults to 25 miles when omitted. */
	radiusMiles?: number;
};

export type SearchQuery = {
	q?: string;
	city?: string;
	/** Used when no city is provided to limit results by distance. */
	near?: SearchNear;
};

export const DEFAULT_NEAR_RADIUS_MILES = 25;

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
	},
	{
		id: '4',
		name: 'Jordan Blake',
		type: 'individual',
		service: 'Drummer',
		services: ['Live gigs', 'Studio sessions', 'Touring'],
		city: 'Austin',
		phone: '(555) 410-2288',
		avatarUrl: undefined,
		promo: 'Available for SXSW and summer festival dates.',
		latitude: 30.2672,
		longitude: -97.7431
	},
	{
		id: '5',
		name: 'Maya Ortiz',
		type: 'individual',
		service: 'Guitarist',
		services: ['Session recording', 'Live performance', 'Songwriting'],
		city: 'Los Angeles',
		phone: '(555) 320-9014',
		avatarUrl: undefined,
		promo: 'Sliding-scale rates for indie projects.',
		latitude: 34.0522,
		longitude: -118.2437
	},
	{
		id: '6',
		name: 'Chris Navarro',
		type: 'individual',
		service: 'Bassist',
		services: ['Jazz combos', 'Studio tracking', 'Broadway pit work'],
		city: 'New York',
		phone: '(555) 718-3340',
		avatarUrl: undefined,
		latitude: 40.7282,
		longitude: -73.9942
	},
	{
		id: '7',
		name: 'Delilah Reed',
		type: 'individual',
		service: 'Pianist',
		services: ['Jazz piano', 'Wedding ceremonies', 'Private lessons'],
		city: 'New Orleans',
		phone: '(555) 504-7721',
		avatarUrl: undefined,
		promo: 'French Quarter brunch residencies open for booking.',
		latitude: 29.9511,
		longitude: -90.0715
	},
	{
		id: '8',
		name: 'Sam Okonkwo',
		type: 'individual',
		service: 'Keyboardist',
		services: ['Synth programming', 'Live keys', 'Production'],
		city: 'Chicago',
		phone: '(555) 312-8890',
		avatarUrl: undefined,
		latitude: 41.8781,
		longitude: -87.6298
	},
	{
		id: '9',
		name: 'Amelia Hart',
		type: 'individual',
		service: 'Vocalist',
		services: ['Studio vocals', 'Choir directing', 'Commercial jingles'],
		city: 'London',
		phone: '+44 20 7946 0123',
		avatarUrl: undefined,
		promo: 'West End understudy rates for daytime sessions.',
		latitude: 51.5074,
		longitude: -0.1278
	},
	{
		id: '10',
		name: 'Lukas Weber',
		type: 'individual',
		service: 'Saxophonist',
		services: ['Jazz ensembles', 'Session work', 'Workshops'],
		city: 'Berlin',
		phone: '+49 30 1234 5678',
		avatarUrl: undefined,
		latitude: 52.52,
		longitude: 13.405
	},
	{
		id: '11',
		name: 'Yuki Tanaka',
		type: 'individual',
		service: 'Violinist',
		services: ['Classical performance', 'Film scoring', 'Chamber music'],
		city: 'Tokyo',
		phone: '+81 3-5555-0199',
		avatarUrl: undefined,
		promo: 'Accepting remote overdub bookings worldwide.',
		latitude: 35.6762,
		longitude: 139.6503
	},
	{
		id: '12',
		name: 'Priya Sharma',
		type: 'individual',
		service: 'Guitar Teacher',
		services: ['Beginner lessons', 'Fingerstyle coaching', 'Exam prep'],
		city: 'Toronto',
		phone: '+1 (416) 555-0142',
		avatarUrl: undefined,
		promo: 'First lesson free for new students.',
		latitude: 43.6532,
		longitude: -79.3832
	},
	{
		id: '13',
		name: 'Harbour String & Fret',
		type: 'business',
		service: 'Repair Shop',
		services: ['Guitar setups', 'Fretwork', 'Electronics repair'],
		address: '42 Flinders Lane, Melbourne VIC',
		city: 'Melbourne',
		phone: '+61 3 9555 0188',
		avatarUrl: undefined,
		promo: 'Free setup check with any restring.',
		latitude: -37.8136,
		longitude: 144.9631
	},
	{
		id: '14',
		name: 'The Crown Room',
		type: 'business',
		service: 'Venue',
		services: ['Live music nights', 'Private hire', 'Artist residencies'],
		address: '17 Camden High St, London',
		city: 'London',
		phone: '+44 20 7946 8840',
		avatarUrl: undefined,
		promo: 'Weeknight slots open for emerging acts.',
		latitude: 51.539,
		longitude: -0.1426
	},
	{
		id: '15',
		name: 'Pacific Circuit Tours',
		type: 'business',
		service: 'Tour',
		services: ['Tour routing', 'Crew booking', 'Venue advances'],
		address: '9000 Sunset Blvd, Suite 410, Los Angeles, CA',
		city: 'Los Angeles',
		phone: '(555) 213-6600',
		avatarUrl: undefined,
		promo: 'West Coast package rates for spring runs.',
		latitude: 34.0901,
		longitude: -118.385
	},
	{
		id: '16',
		name: 'Brooklyn Rehearsal Loft',
		type: 'business',
		service: 'Practice Space',
		services: ['Hourly rooms', 'Backline rental', 'Demo tracking'],
		address: '210 Kent Ave, Brooklyn, NY',
		city: 'New York',
		phone: '(555) 347-2290',
		avatarUrl: undefined,
		promo: 'Off-peak discount before noon on weekdays.',
		latitude: 40.7215,
		longitude: -73.9601
	},
	{
		id: '17',
		name: 'Kreuzberg Analog Rooms',
		type: 'business',
		service: 'Recording Studio',
		services: ['Analog tracking', 'Mixing', 'Vinyl mastering'],
		address: 'Oranienstraße 45, Berlin',
		city: 'Berlin',
		phone: '+49 30 9876 5432',
		avatarUrl: undefined,
		promo: 'Night owl rates after 10pm.',
		latitude: 52.5006,
		longitude: 13.418
	},
	{
		id: '18',
		name: 'Shibuya Tone House',
		type: 'business',
		service: 'Music Store',
		services: ['Instrument sales', 'Import gear', 'Accessory shop'],
		address: '1-22-7 Jinnan, Shibuya, Tokyo',
		city: 'Tokyo',
		phone: '+81 3-5555-7744',
		avatarUrl: undefined,
		promo: 'Student discount with valid ID.',
		latitude: 35.662,
		longitude: 139.6982
	},
	{
		id: '19',
		name: 'Marcus Hill',
		type: 'individual',
		service: 'Drummer',
		services: ['Country sessions', 'Live worship', 'Teaching'],
		city: 'Nashville',
		phone: '(555) 615-4402',
		avatarUrl: undefined,
		latitude: 36.152,
		longitude: -86.804
	}
];

const normalizeCityToken = (value: string) => {
	return value.split(',')[0]?.trim().toLowerCase() ?? '';
};

const matchesCity = (item: SearchResultItem, city: string) => {
	const needle = normalizeCityToken(city);
	if (!needle) return true;
	return normalizeCityToken(item.city) === needle;
};

const matchesQuery = (item: SearchResultItem, q: string) => {
	const needle = q.trim().toLowerCase();
	if (!needle) return true;
	const haystack = [item.name, item.service, ...(item.services ?? [])].join(' ').toLowerCase();
	return haystack.includes(needle);
};

const EARTH_RADIUS_MILES = 3958.8;

/** Great-circle distance in miles between two WGS84 points. */
export const distanceMiles = (
	from: { latitude: number; longitude: number },
	to: { latitude: number; longitude: number }
) => {
	const toRad = (degrees: number) => (degrees * Math.PI) / 180;
	const dLat = toRad(to.latitude - from.latitude);
	const dLon = toRad(to.longitude - from.longitude);
	const lat1 = toRad(from.latitude);
	const lat2 = toRad(to.latitude);
	const a =
		Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
	return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(a));
};

const matchesNear = (item: SearchResultItem, near: SearchNear | undefined) => {
	if (!near) return true;
	const radius = near.radiusMiles ?? DEFAULT_NEAR_RADIUS_MILES;
	return distanceMiles(near, item) <= radius;
};

/**
 * Returns listings that match every provided query param.
 * When city is empty and `near` is set, results are limited to that radius (default 25 mi).
 * Swap this body for a fetch of the same { q, city, near } when an API exists.
 */
export const searchListings = (query: SearchQuery): SearchResultItem[] => {
	const q = query.q?.trim() ?? '';
	const city = query.city?.trim() ?? '';
	if (!q && !city) return [];

	const useNear = !city && query.near;

	return MOCK_LISTINGS.filter(
		item =>
			matchesCity(item, city) && matchesQuery(item, q) && matchesNear(item, useNear ? query.near : undefined)
	);
};

export const NASHVILLE_CENTER: [number, number] = [36.1627, -86.7816];
export const US_FALLBACK_CENTER: [number, number] = [39.8283, -98.5795];

export const getSearchMapFallbackCenter = (
	city: string,
	near?: Pick<SearchNear, 'latitude' | 'longitude'>
): [number, number] => {
	if (near) return [near.latitude, near.longitude];
	const token = normalizeCityToken(city);
	if (!token || token === 'nashville') return NASHVILLE_CENTER;
	return US_FALLBACK_CENTER;
};
