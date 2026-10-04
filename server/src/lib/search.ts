import { ListingType, Prisma } from "../generated/prisma/client";
import { prisma } from "./prisma";

export const DEFAULT_NEAR_RADIUS_MILES = 25;

const EARTH_RADIUS_MILES = 3958.8;

export type SearchResultItem = {
  id: string;
  name: string;
  type: "business" | "individual";
  service: string;
  services: string[];
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
  radiusMiles?: number;
};

export type SearchQuery = {
  q?: string;
  city?: string;
  near?: SearchNear;
};

const normalizeCityToken = (value: string) => {
  return value.split(",")[0]?.trim().toLowerCase() ?? "";
};

const matchesCity = (item: SearchResultItem, city: string) => {
  const needle = normalizeCityToken(city);
  if (!needle) return true;
  return normalizeCityToken(item.city) === needle;
};

const matchesQuery = (item: SearchResultItem, q: string) => {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [item.name, item.service, ...item.services].join(" ").toLowerCase();
  return haystack.includes(needle);
};

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

const toResult = (
  listing: Prisma.ListingGetPayload<Record<string, never>>
): SearchResultItem => ({
  id: listing.id,
  name: listing.name,
  type: listing.type === ListingType.BUSINESS ? "business" : "individual",
  service: listing.service,
  services: listing.services,
  address: listing.address ?? undefined,
  city: listing.city,
  phone: listing.phone,
  avatarUrl: listing.avatarUrl ?? undefined,
  promo: listing.promo ?? undefined,
  latitude: listing.latitude,
  longitude: listing.longitude,
});

/**
 * Returns listings that match every provided query param.
 * When city is empty and `near` is set, results are limited to that radius (default 25 mi).
 */
export const searchListings = async (query: SearchQuery): Promise<SearchResultItem[]> => {
  const q = query.q?.trim() ?? "";
  const city = query.city?.trim() ?? "";
  if (!q && !city) return [];

  const listings = await prisma.listing.findMany();
  const items = listings.map(toResult);
  const useNear = !city && query.near;

  return items.filter(
    (item) =>
      matchesCity(item, city) &&
      matchesQuery(item, q) &&
      matchesNear(item, useNear ? query.near : undefined)
  );
};
