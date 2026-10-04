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

const normalizeCityToken = (value: string) => {
	return value.split(',')[0]?.trim().toLowerCase() ?? '';
};

/**
 * Returns listings that match every provided query param.
 * When city is empty and `near` is set, results are limited to that radius (default 25 mi).
 */
export const searchListings = async (query: SearchQuery): Promise<SearchResultItem[]> => {
	const q = query.q?.trim() ?? '';
	const city = query.city?.trim() ?? '';
	if (!q && !city) return [];

	const params = new URLSearchParams();
	if (q) params.set('q', q);
	if (city) params.set('city', city);
	if (!city && query.near) {
		params.set('latitude', String(query.near.latitude));
		params.set('longitude', String(query.near.longitude));
		params.set('radiusMiles', String(query.near.radiusMiles ?? DEFAULT_NEAR_RADIUS_MILES));
	}

	const response = await fetch(`/api/search?${params.toString()}`);
	if (!response.ok) {
		let message = `Search failed (${response.status})`;
		try {
			const data = (await response.json()) as { error?: string };
			if (data.error) message = data.error;
		} catch {
			// Keep the status message when the body is not JSON.
		}
		throw new Error(message);
	}

	return (await response.json()) as SearchResultItem[];
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
