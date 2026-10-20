// Open-Meteo's geocoder is keyless and answers in ~0.5s. The public Photon
// instance we tried first took 4-6s per request, which made typing feel stuck.
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const MIN_QUERY_LENGTH = 2;
const MAX_SUGGESTIONS = 8;
// Fetch extra rows so we can rank by population before trimming.
const FETCH_COUNT = 20;
const REQUEST_TIMEOUT_MS = 5_000;
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_MAX_ENTRIES = 500;

type GeocodingResult = {
  name?: string;
  admin1?: string;
  country?: string;
  country_code?: string;
  feature_code?: string;
  population?: number;
};

type GeocodingResponse = {
  results?: GeocodingResult[];
};

type CacheEntry = {
  expiresAt: number;
  suggestions: string[];
};

const cache = new Map<string, CacheEntry>();

const readCache = (key: string): string[] | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }
  // Refresh recency so the Map behaves like an LRU.
  cache.delete(key);
  cache.set(key, entry);
  return entry.suggestions;
};

const writeCache = (key: string, suggestions: string[]) => {
  cache.delete(key);
  cache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, suggestions });
  while (cache.size > CACHE_MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest === undefined) break;
    cache.delete(oldest);
  }
};

// GeoNames codes: keep populated places, drop neighborhoods and historical/abandoned ones.
const EXCLUDED_FEATURE_CODES = new Set(["PPLX", "PPLH", "PPLQ", "PPLW"]);

const isCity = (result: GeocodingResult): boolean => {
  const code = result.feature_code;
  return Boolean(code?.startsWith("PPL")) && !EXCLUDED_FEATURE_CODES.has(code ?? "");
};

const toLabel = (result: GeocodingResult): string | null => {
  const name = result.name?.trim();
  if (!name) return null;
  const region = result.country_code === "US" ? result.admin1 : result.country;
  const trimmedRegion = region?.trim();
  return trimmedRegion ? `${name}, ${trimmedRegion}` : name;
};

/**
 * Returns city suggestions for a partial query, formatted as "City, State"
 * (or "City, Country" outside the US), largest places first.
 * Returns [] on any failure.
 */
export const suggestPlaces = async (query: string): Promise<string[]> => {
  const trimmed = query.trim();
  if (trimmed.length < MIN_QUERY_LENGTH) return [];

  const key = trimmed.toLowerCase();
  const cached = readCache(key);
  if (cached) return cached;

  const url = new URL(GEOCODING_URL);
  url.searchParams.set("name", trimmed);
  url.searchParams.set("count", String(FETCH_COUNT));
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "bloodhound-local",
      },
      signal: controller.signal,
    });

    if (!response.ok) return [];

    const data = (await response.json()) as GeocodingResponse;
    // Names starting with what the user typed come first, then biggest places.
    const startsWithQuery = (result: GeocodingResult) =>
      result.name?.trim().toLowerCase().startsWith(key) ? 1 : 0;
    const ranked = (data.results ?? [])
      .filter(isCity)
      .sort(
        (a, b) =>
          startsWithQuery(b) - startsWithQuery(a) || (b.population ?? 0) - (a.population ?? 0)
      );

    const seen = new Set<string>();
    const suggestions: string[] = [];
    for (const result of ranked) {
      const label = toLabel(result);
      if (!label) continue;
      const labelKey = label.toLowerCase();
      if (seen.has(labelKey)) continue;
      seen.add(labelKey);
      suggestions.push(label);
      if (suggestions.length >= MAX_SUGGESTIONS) break;
    }

    writeCache(key, suggestions);
    return suggestions;
  } catch (error) {
    console.error(error);
    return [];
  } finally {
    clearTimeout(timeout);
  }
};
