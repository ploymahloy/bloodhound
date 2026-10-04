import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { ListingType, PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

const listingId = (n: number) =>
  `00000000-0000-4000-8000-${n.toString().padStart(12, "0")}`;

type SeedListing = {
  id: string;
  name: string;
  type: ListingType;
  service: string;
  services: string[];
  address?: string;
  city: string;
  phone: string;
  promo?: string;
  latitude: number;
  longitude: number;
};

const listings: SeedListing[] = [
  {
    id: listingId(1),
    name: "Riverside Sound Studio",
    type: ListingType.BUSINESS,
    service: "Recording Studio",
    services: ["Full-band tracking", "Mixing & mastering", "Podcast production"],
    address: "124 Main St, Suite 200, Nashville, TN",
    city: "Nashville",
    phone: "(555) 123-4567",
    promo: "New artist special: 20% off your first full-day session.",
    latitude: 36.1668,
    longitude: -86.7745,
  },
  {
    id: listingId(2),
    name: "Alex Chen",
    type: ListingType.INDIVIDUAL,
    service: "Trumpet Player",
    services: ["Session recording", "Live performance", "Private lessons"],
    city: "Nashville",
    phone: "(555) 987-6543",
    promo: "Now accepting new students for spring semester.",
    latitude: 36.1495,
    longitude: -86.792,
  },
  {
    id: listingId(3),
    name: "Downtown Music Co.",
    type: ListingType.BUSINESS,
    service: "Music Store",
    services: ["Instrument sales", "Repairs & maintenance", "Accessory shop"],
    address: "88 Oak Avenue, Nashville, TN",
    city: "Nashville",
    phone: "(555) 246-8135",
    promo: "Buy one set of strings, get the second half off.",
    latitude: 36.1622,
    longitude: -86.778,
  },
  {
    id: listingId(4),
    name: "Jordan Blake",
    type: ListingType.INDIVIDUAL,
    service: "Drummer",
    services: ["Live gigs", "Studio sessions", "Touring"],
    city: "Austin",
    phone: "(555) 410-2288",
    promo: "Available for SXSW and summer festival dates.",
    latitude: 30.2672,
    longitude: -97.7431,
  },
  {
    id: listingId(5),
    name: "Maya Ortiz",
    type: ListingType.INDIVIDUAL,
    service: "Guitarist",
    services: ["Session recording", "Live performance", "Songwriting"],
    city: "Los Angeles",
    phone: "(555) 320-9014",
    promo: "Sliding-scale rates for indie projects.",
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    id: listingId(6),
    name: "Chris Navarro",
    type: ListingType.INDIVIDUAL,
    service: "Bassist",
    services: ["Jazz combos", "Studio tracking", "Broadway pit work"],
    city: "New York",
    phone: "(555) 718-3340",
    latitude: 40.7282,
    longitude: -73.9942,
  },
  {
    id: listingId(7),
    name: "Delilah Reed",
    type: ListingType.INDIVIDUAL,
    service: "Pianist",
    services: ["Jazz piano", "Wedding ceremonies", "Private lessons"],
    city: "New Orleans",
    phone: "(555) 504-7721",
    promo: "French Quarter brunch residencies open for booking.",
    latitude: 29.9511,
    longitude: -90.0715,
  },
  {
    id: listingId(8),
    name: "Sam Okonkwo",
    type: ListingType.INDIVIDUAL,
    service: "Keyboardist",
    services: ["Synth programming", "Live keys", "Production"],
    city: "Chicago",
    phone: "(555) 312-8890",
    latitude: 41.8781,
    longitude: -87.6298,
  },
  {
    id: listingId(9),
    name: "Amelia Hart",
    type: ListingType.INDIVIDUAL,
    service: "Vocalist",
    services: ["Studio vocals", "Choir directing", "Commercial jingles"],
    city: "London",
    phone: "+44 20 7946 0123",
    promo: "West End understudy rates for daytime sessions.",
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    id: listingId(10),
    name: "Lukas Weber",
    type: ListingType.INDIVIDUAL,
    service: "Saxophonist",
    services: ["Jazz ensembles", "Session work", "Workshops"],
    city: "Berlin",
    phone: "+49 30 1234 5678",
    latitude: 52.52,
    longitude: 13.405,
  },
  {
    id: listingId(11),
    name: "Yuki Tanaka",
    type: ListingType.INDIVIDUAL,
    service: "Violinist",
    services: ["Classical performance", "Film scoring", "Chamber music"],
    city: "Tokyo",
    phone: "+81 3-5555-0199",
    promo: "Accepting remote overdub bookings worldwide.",
    latitude: 35.6762,
    longitude: 139.6503,
  },
  {
    id: listingId(12),
    name: "Priya Sharma",
    type: ListingType.INDIVIDUAL,
    service: "Guitar Teacher",
    services: ["Beginner lessons", "Fingerstyle coaching", "Exam prep"],
    city: "Toronto",
    phone: "+1 (416) 555-0142",
    promo: "First lesson free for new students.",
    latitude: 43.6532,
    longitude: -79.3832,
  },
  {
    id: listingId(13),
    name: "Harbour String & Fret",
    type: ListingType.BUSINESS,
    service: "Repair Shop",
    services: ["Guitar setups", "Fretwork", "Electronics repair"],
    address: "42 Flinders Lane, Melbourne VIC",
    city: "Melbourne",
    phone: "+61 3 9555 0188",
    promo: "Free setup check with any restring.",
    latitude: -37.8136,
    longitude: 144.9631,
  },
  {
    id: listingId(14),
    name: "The Crown Room",
    type: ListingType.BUSINESS,
    service: "Venue",
    services: ["Live music nights", "Private hire", "Artist residencies"],
    address: "17 Camden High St, London",
    city: "London",
    phone: "+44 20 7946 8840",
    promo: "Weeknight slots open for emerging acts.",
    latitude: 51.539,
    longitude: -0.1426,
  },
  {
    id: listingId(15),
    name: "Pacific Circuit Tours",
    type: ListingType.BUSINESS,
    service: "Tour",
    services: ["Tour routing", "Crew booking", "Venue advances"],
    address: "9000 Sunset Blvd, Suite 410, Los Angeles, CA",
    city: "Los Angeles",
    phone: "(555) 213-6600",
    promo: "West Coast package rates for spring runs.",
    latitude: 34.0901,
    longitude: -118.385,
  },
  {
    id: listingId(16),
    name: "Brooklyn Rehearsal Loft",
    type: ListingType.BUSINESS,
    service: "Practice Space",
    services: ["Hourly rooms", "Backline rental", "Demo tracking"],
    address: "210 Kent Ave, Brooklyn, NY",
    city: "New York",
    phone: "(555) 347-2290",
    promo: "Off-peak discount before noon on weekdays.",
    latitude: 40.7215,
    longitude: -73.9601,
  },
  {
    id: listingId(17),
    name: "Kreuzberg Analog Rooms",
    type: ListingType.BUSINESS,
    service: "Recording Studio",
    services: ["Analog tracking", "Mixing", "Vinyl mastering"],
    address: "Oranienstraße 45, Berlin",
    city: "Berlin",
    phone: "+49 30 9876 5432",
    promo: "Night owl rates after 10pm.",
    latitude: 52.5006,
    longitude: 13.418,
  },
  {
    id: listingId(18),
    name: "Shibuya Tone House",
    type: ListingType.BUSINESS,
    service: "Music Store",
    services: ["Instrument sales", "Import gear", "Accessory shop"],
    address: "1-22-7 Jinnan, Shibuya, Tokyo",
    city: "Tokyo",
    phone: "+81 3-5555-7744",
    promo: "Student discount with valid ID.",
    latitude: 35.662,
    longitude: 139.6982,
  },
  {
    id: listingId(19),
    name: "Marcus Hill",
    type: ListingType.INDIVIDUAL,
    service: "Drummer",
    services: ["Country sessions", "Live worship", "Teaching"],
    city: "Nashville",
    phone: "(555) 615-4402",
    latitude: 36.152,
    longitude: -86.804,
  },
];

async function main() {
  for (const listing of listings) {
    const data = {
      name: listing.name,
      type: listing.type,
      service: listing.service,
      services: listing.services,
      address: listing.address ?? null,
      city: listing.city,
      phone: listing.phone,
      promo: listing.promo ?? null,
      latitude: listing.latitude,
      longitude: listing.longitude,
    };

    await prisma.listing.upsert({
      where: { id: listing.id },
      update: data,
      create: { id: listing.id, ...data },
    });
  }
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
