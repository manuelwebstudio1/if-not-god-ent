import type { Category } from "@/types/commerce";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

export const categories: Category[] = [
  {
    id: "1",
    name: "Building Materials",
    slug: "building-materials",
    image: img("photo-1504307651254-35680f356dfd"),
    productCount: 320,
  },
  {
    id: "2",
    name: "Power Tools",
    slug: "power-tools",
    image: img("photo-1572981779307-38bfe4d3a3f8"),
    productCount: 185,
  },
  {
    id: "3",
    name: "Hand Tools",
    slug: "hand-tools",
    image: img("photo-1581244277943-fe4c9d3d9f44"),
    productCount: 240,
  },
  {
    id: "4",
    name: "Plumbing Supplies",
    slug: "plumbing-supplies",
    image: img("photo-1607472586893-a037c0a546a8"),
    productCount: 156,
  },
  {
    id: "5",
    name: "Water Pumps",
    slug: "water-pumps",
    image: img("photo-1621905251189-08b45d6a269e"),
    productCount: 68,
  },
  {
    id: "6",
    name: "Safety Equipment",
    slug: "safety-equipment",
    image: img("photo-1576091160550-2173dba999ef"),
    productCount: 92,
  },
  {
    id: "7",
    name: "Electrical Supplies",
    slug: "electrical-supplies",
    image: img("photo-1621905252507-b35492cc74b4"),
    productCount: 210,
  },
  {
    id: "8",
    name: "Industrial Equipment",
    slug: "industrial-equipment",
    image: img("photo-1581094794329-c8112a89af12"),
    productCount: 74,
  },
  {
    id: "9",
    name: "Engineering Equipment",
    slug: "engineering-equipment",
    image: img("photo-1504917595217-d4dc5ebe6122"),
    productCount: 58,
  },
  {
    id: "10",
    name: "Generators",
    slug: "generators",
    image: img("photo-1558618666-fcd25c85cd64"),
    productCount: 45,
  },
  {
    id: "11",
    name: "Hardware",
    slug: "hardware",
    image: img("photo-1504148455328-c376ef8136c3"),
    productCount: 380,
  },
  {
    id: "12",
    name: "Construction Accessories",
    slug: "construction-accessories",
    image: img("photo-1541888946425-d81bb19240f5"),
    productCount: 125,
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
