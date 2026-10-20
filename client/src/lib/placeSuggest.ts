export const MIN_CITY_SUGGEST_LENGTH = 2;

/** Fetches "City, State" suggestions for a partial city query. */
export const fetchCitySuggestions = async (q: string, signal?: AbortSignal): Promise<string[]> => {
	const trimmed = q.trim();
	if (trimmed.length < MIN_CITY_SUGGEST_LENGTH) return [];

	const params = new URLSearchParams({ q: trimmed });
	const response = await fetch(`/api/places/suggest?${params.toString()}`, { signal });
	if (!response.ok) {
		throw new Error('Could not load suggestions');
	}

	const data: unknown = await response.json();
	if (!Array.isArray(data)) return [];
	return data.filter((item): item is string => typeof item === 'string');
};
