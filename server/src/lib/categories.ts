export const SEARCH_CATEGORIES = [
  "Drummer",
  "Guitarist",
  "Bassist",
  "Pianist",
  "Keyboardist",
  "Vocalist",
  "Trumpet Player",
  "Saxophonist",
  "Violinist",
  "Guitar Teacher",
  "Repair Shop",
  "Venue",
  "Tour",
  "Practice Space",
  "Recording Studio",
  "Music Store",
] as const;

export type SearchCategory = (typeof SEARCH_CATEGORIES)[number];

export const isSearchCategory = (value: string): value is SearchCategory => {
  return (SEARCH_CATEGORIES as readonly string[]).includes(value);
};
