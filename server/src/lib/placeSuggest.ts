const PHOTON_URL = "https://photon.komoot.io/api/";
const MIN_QUERY_LENGTH = 2;
const MAX_SUGGESTIONS = 8;
const REQUEST_TIMEOUT_MS = 8_000;
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_MAX_ENTRIES = 500;

type PhotonFeature = {
  properties?: {
    name?: string;
    state?: string;
    country?: string;
    countrycode?: string;
  };
};

type PhotonResponse = {
  features?: PhotonFeature[];
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

const toLabel = (feature: PhotonFeature): string | null => {
  const props = feature.properties;
  const name = props?.name?.trim();
  if (!name) return null;
  const region = props?.countrycode === "US" ? props.state : props?.country;
  const trimmedRegion = region?.trim();
  return trimmedRegion ? `${name}, ${trimmedRegion}` : name;
};

/**
 * Returns city suggestions for a partial query, formatted as "City, State"
 * (or "City, Country" outside the US). Returns [] on any failure.
 */
export const suggestPlaces = async (query: string): Promise<string[]> => {
  const trimmed = query.trim();
  if (trimmed.length < MIN_QUERY_LENGTH) return [];

  const key = trimmed.toLowerCase();
  const cached = readCache(key);
  if (cached) return cached;

  const url = new URL(PHOTON_URL);
  url.searchParams.set("q", trimmed);
  url.searchParams.set("limit", String(MAX_SUGGESTIONS));
  url.searchParams.set("lang", "en");
  url.searchParams.set("layer", "city");

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

    const data = (await response.json()) as PhotonResponse;
    const seen = new Set<string>();
    const suggestions: string[] = [];
    for (const feature of data.features ?? []) {
      const label = toLabel(feature);
      if (!label) continue;
      const labelKey = label.toLowerCase();
      if (seen.has(labelKey)) continue;
      seen.add(labelKey);
      suggestions.push(label);
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
