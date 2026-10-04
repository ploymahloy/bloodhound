export type GeocodeResult = {
  latitude: number;
  longitude: number;
};

/**
 * Resolves a place query to WGS84 coordinates via OpenStreetMap Nominatim.
 * Returns null when no result is found or the request fails.
 */
export const geocodePlace = async (query: string): Promise<GeocodeResult | null> => {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", trimmed);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "bloodhound-local",
      },
      signal: controller.signal,
    });

    if (!response.ok) return null;

    const data = (await response.json()) as Array<{ lat?: string; lon?: string }>;
    const first = data[0];
    if (!first?.lat || !first?.lon) return null;

    const latitude = Number(first.lat);
    const longitude = Number(first.lon);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;

    return { latitude, longitude };
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
};
