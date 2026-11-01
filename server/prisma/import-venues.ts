import "dotenv/config";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { PrismaPg } from "@prisma/adapter-pg";
import { ListingType, PrismaClient } from "../src/generated/prisma/client";
import { geocodePlace } from "../src/lib/geocode";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

/** Stable id that cannot collide with seed rows (`…-8000-…`). */
const venueId = (name: string, address: string, city: string) => {
  const hash = createHash("sha256")
    .update([name, address, city].join("\0").toLowerCase())
    .digest("hex")
    .slice(0, 12);
  return `00000000-0000-4000-8001-${hash}`;
};

type VenueRecord = {
  name?: unknown;
  service?: unknown;
  services?: unknown;
  address?: unknown;
  city?: unknown;
  phone?: unknown;
  avatarUrl?: unknown;
  promo?: unknown;
  latitude?: unknown;
  longitude?: unknown;
};

const asTrimmedString = (value: unknown) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

const asFiniteNumber = (value: unknown) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value;
};

const parseServices = (record: VenueRecord) => {
  const tags = Array.isArray(record.services)
    ? record.services
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const kind = asTrimmedString(record.service);
  if (
    kind &&
    kind.toLowerCase() !== "venue" &&
    !tags.some((tag) => tag.toLowerCase() === kind.toLowerCase())
  ) {
    tags.unshift(kind);
  }

  return tags.length > 0 ? tags : ["Live music"];
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function resolveCoordinates(record: VenueRecord, address: string | null, city: string) {
  const latitude = asFiniteNumber(record.latitude);
  const longitude = asFiniteNumber(record.longitude);
  if (latitude !== null && longitude !== null) {
    return { latitude, longitude, geocoded: false };
  }

  const placeQuery = address ? `${address}, ${city}` : city;
  await sleep(1_000);
  const coords = await geocodePlace(placeQuery);
  if (!coords) return null;
  return { ...coords, geocoded: true };
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: npx ts-node prisma/import-venues.ts <venues.json>");
    process.exitCode = 1;
    return;
  }

  const parsed: unknown = JSON.parse(await readFile(filePath, "utf8"));
  if (!Array.isArray(parsed)) {
    console.error("Expected a JSON array of venue records");
    process.exitCode = 1;
    return;
  }

  let imported = 0;
  let skipped = 0;
  let geocoded = 0;

  for (const [index, entry] of parsed.entries()) {
    const row = index + 1;
    if (!entry || typeof entry !== "object") {
      console.warn(`Skip row ${row}: not an object`);
      skipped += 1;
      continue;
    }

    const record = entry as VenueRecord;
    const name = asTrimmedString(record.name);
    const city = asTrimmedString(record.city);
    const phone = asTrimmedString(record.phone);
    const label = name || `row ${row}`;
    const missing = [
      name ? "" : "name",
      city ? "" : "city",
      phone ? "" : "phone",
    ].filter(Boolean);

    if (missing.length > 0) {
      console.warn(`Skip ${label}: missing ${missing.join(", ")}`);
      skipped += 1;
      continue;
    }

    const address = asTrimmedString(record.address) || null;
    const coords = await resolveCoordinates(record, address, city);
    if (!coords) {
      const placeQuery = address ? `${address}, ${city}` : city;
      console.warn(`Skip ${label}: could not geocode "${placeQuery}"`);
      skipped += 1;
      continue;
    }
    if (coords.geocoded) geocoded += 1;

    const id = venueId(name, address ?? "", city);
    const data = {
      name,
      type: ListingType.BUSINESS,
      service: "Venue",
      services: parseServices(record),
      address,
      city,
      phone,
      avatarUrl: asTrimmedString(record.avatarUrl) || null,
      promo: asTrimmedString(record.promo) || null,
      latitude: coords.latitude,
      longitude: coords.longitude,
      claimed: false,
      ownerId: null,
    };

    await prisma.listing.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });
    imported += 1;
  }

  console.log(
    `Imported ${imported}, skipped ${skipped}${geocoded > 0 ? `, geocoded ${geocoded}` : ""}`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
