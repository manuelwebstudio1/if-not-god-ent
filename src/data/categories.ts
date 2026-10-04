/** URL aliases for old category slugs. Catalog content itself comes from Supabase. */
const SLUG_ALIASES: Record<string, string> = {
  "building-materials": "building-materials",
  "water-pump": "water-pump",
  "water-pumps": "water-pump",
  machines: "machines",
  "power-tools": "machines",
  "hand-tools": "machines",
  generators: "machines",
  "industrial-equipment": "machines",
  "engineering-equipment": "machines",
  "construction-machines": "machines",
  "plumbing-supplies": "building-materials",
  "safety-equipment": "building-materials",
  electrical: "building-materials",
  "electrical-supplies": "building-materials",
  hardware: "building-materials",
  "construction-accessories": "building-materials",
};

export function aliasCategorySlug(slug?: string | null) {
  if (!slug) return "";
  return SLUG_ALIASES[slug] ?? slug;
}
