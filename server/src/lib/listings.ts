import { ListingType } from "../generated/prisma/client";
import { isSearchCategory } from "./categories";
import { geocodePlace } from "./geocode";
import { prisma } from "./prisma";
import type { SearchResultItem } from "./search";

export type CreateListingInput = {
  name?: unknown;
  type?: unknown;
  service?: unknown;
  services?: unknown;
  address?: unknown;
  city?: unknown;
  phone?: unknown;
  promo?: unknown;
};

export type CreateListingResult =
  | { ok: true; listing: SearchResultItem }
  | { ok: false; error: string };

const asTrimmedString = (value: unknown) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

const parseServices = (value: unknown, fallbackService: string): string[] => {
  if (Array.isArray(value)) {
    const items = value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
    return items.length > 0 ? items : [fallbackService];
  }
  if (typeof value === "string") {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    return items.length > 0 ? items : [fallbackService];
  }
  return [fallbackService];
};

const toPublicListing = (listing: {
  id: string;
  name: string;
  type: ListingType;
  service: string;
  services: string[];
  address: string | null;
  city: string;
  phone: string;
  avatarUrl: string | null;
  promo: string | null;
  latitude: number;
  longitude: number;
}): SearchResultItem => ({
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

export const createListingForUser = async (
  ownerId: string,
  input: CreateListingInput
): Promise<CreateListingResult> => {
  const name = asTrimmedString(input.name);
  const typeRaw = asTrimmedString(input.type).toLowerCase();
  const service = asTrimmedString(input.service);
  const city = asTrimmedString(input.city);
  const phone = asTrimmedString(input.phone);
  const address = asTrimmedString(input.address) || null;
  const promo = asTrimmedString(input.promo) || null;

  if (!name || !service || !city || !phone) {
    return { ok: false, error: "Missing required fields" };
  }

  if (typeRaw !== "business" && typeRaw !== "individual") {
    return { ok: false, error: "Invalid listing type" };
  }

  if (!isSearchCategory(service)) {
    return { ok: false, error: "Invalid service category" };
  }

  const services = parseServices(input.services, service);
  const placeQuery = address ? `${address}, ${city}` : city;
  const coords = await geocodePlace(placeQuery);
  if (!coords) {
    return { ok: false, error: "Could not find that location" };
  }

  const listing = await prisma.listing.create({
    data: {
      name,
      type: typeRaw === "business" ? ListingType.BUSINESS : ListingType.INDIVIDUAL,
      service,
      services,
      address,
      city,
      phone,
      promo,
      latitude: coords.latitude,
      longitude: coords.longitude,
      ownerId,
    },
  });

  return { ok: true, listing: toPublicListing(listing) };
};
