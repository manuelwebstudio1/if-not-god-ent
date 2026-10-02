import type { Product } from "@/types/commerce";

const p = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

export const products: Product[] = [
  {
    id: "1",
    name: "Impact Drill 850W",
    slug: "ingco-impact-drill-850w",
    sku: "ID8508",
    brand: "INGCO",
    brandSlug: "ingco",
    category: "Power Tools",
    categorySlug: "power-tools",
    price: 420,
    compareAtPrice: 495,
    rating: 4.7,
    reviewCount: 128,
    stock: 24,
    isFeatured: true,
    isBestSeller: true,
    images: [
      p("photo-1572981779307-38bfe4d3a3f8"),
      p("photo-1504148455328-c376ef8136c3"),
    ],
    shortDescription:
      "Professional 850W impact drill with variable speed for masonry, steel and wood.",
    description:
      "The INGCO Impact Drill 850W delivers reliable torque for professional construction sites. Built with a robust motor, ergonomic grip and precision chuck for daily heavy-duty use.",
    features: [
      "850W high-torque motor",
      "Variable speed control",
      "Impact & drill modes",
      "Auxiliary handle included",
      "Professional-grade chuck",
    ],
    specifications: {
      Power: "850W",
      "No-load speed": "0–3000 RPM",
      Chuck: "13mm keyless",
      Weight: "2.1 kg",
      Voltage: "220–240V",
    },
    warranty: "12 months manufacturer warranty",
    shippingInfo: "Nationwide delivery within 2–5 business days",
  },
  {
    id: "2",
    name: 'Water Pump 2"',
    slug: "koshin-water-pump-2in",
    sku: "KP200X",
    brand: "KOSHIN",
    brandSlug: "koshin",
    category: "Water Pumps",
    categorySlug: "water-pumps",
    price: 1850,
    rating: 4.8,
    reviewCount: 64,
    stock: 12,
    isFeatured: true,
    images: [p("photo-1621905251189-08b45d6a269e")],
    shortDescription:
      "High-flow 2-inch centrifugal water pump for construction and irrigation.",
    description:
      "KOSHIN 2-inch water pump engineered for reliable dewatering and transfer applications on job sites across Ghana.",
    features: [
      "2-inch inlet/outlet",
      "Durable cast iron body",
      "High flow rate",
      "Easy maintenance design",
    ],
    specifications: {
      Inlet: '2"',
      "Max flow": "600 L/min",
      Engine: "Petrol 5.5HP compatible",
      Weight: "18 kg",
    },
    warranty: "12 months warranty",
    shippingInfo: "Bulky item — delivery quote on checkout",
  },
  {
    id: "3",
    name: 'Angle Grinder 4.5"',
    slug: "total-angle-grinder-4-5",
    sku: "TAG115",
    brand: "TOTAL",
    brandSlug: "total",
    category: "Power Tools",
    categorySlug: "power-tools",
    price: 285,
    compareAtPrice: 340,
    rating: 4.5,
    reviewCount: 89,
    stock: 35,
    isFeatured: true,
    images: [p("photo-1504148455328-c376ef8136c3")],
    shortDescription: "Compact 710W angle grinder for cutting and grinding metal.",
    description:
      "TOTAL 4.5-inch angle grinder with side handle and safety guard for professional metalwork and fabrication.",
    features: ["710W motor", "Spindle lock", "Adjustable guard", "Soft grip"],
    specifications: {
      Power: "710W",
      Disc: '115mm (4.5")',
      Speed: "11000 RPM",
    },
    warranty: "6 months warranty",
    shippingInfo: "Standard nationwide delivery",
  },
  {
    id: "4",
    name: "Combination Spanner Set",
    slug: "tolsen-combination-spanner-set",
    sku: "TS8140",
    brand: "TOLSEN",
    brandSlug: "tolsen",
    category: "Hand Tools",
    categorySlug: "hand-tools",
    price: 165,
    rating: 4.6,
    reviewCount: 42,
    stock: 50,
    isNew: true,
    isFeatured: true,
    images: [p("photo-1581244277943-fe4c9d3d9f44")],
    shortDescription: "14-piece chrome vanadium combination spanner set.",
    description:
      "TOLSEN professional spanner set for mechanical, plumbing and engineering applications.",
    features: ["Chrome vanadium steel", "14 sizes", "Organizer roll"],
    specifications: { Pieces: "14", Material: "Cr-V steel", Finish: "Polished" },
    warranty: "Limited lifetime on manufacturing defects",
    shippingInfo: "Ships within 24 hours",
  },
  {
    id: "5",
    name: "Measuring Tape 8m",
    slug: "stanley-measuring-tape-8m",
    sku: "STHT36031",
    brand: "STANLEY",
    brandSlug: "stanley",
    category: "Hand Tools",
    categorySlug: "hand-tools",
    price: 45,
    rating: 4.9,
    reviewCount: 210,
    stock: 120,
    isFeatured: true,
    isBestSeller: true,
    images: [p("photo-1504917595217-d4dc5ebe6122")],
    shortDescription: "STANLEY FatMax 8m tape with standout blade.",
    description: "Industry-standard measuring tape trusted on construction sites worldwide.",
    features: ["8m length", "Blade lock", "Belt clip", "Impact-resistant case"],
    specifications: { Length: "8m", Width: "25mm", Standout: "2.5m" },
    warranty: "Manufacturer warranty",
    shippingInfo: "Standard delivery",
  },
  {
    id: "6",
    name: "Gasoline Generator 3.0kW",
    slug: "ingco-gasoline-generator-3kw",
    sku: "IG3000",
    brand: "INGCO",
    brandSlug: "ingco",
    category: "Generators",
    categorySlug: "generators",
    price: 3200,
    compareAtPrice: 3599,
    rating: 4.4,
    reviewCount: 37,
    stock: 8,
    isFeatured: true,
    images: [p("photo-1558618666-fcd25c85cd64")],
    shortDescription: "3.0kW portable generator for sites and backup power.",
    description:
      "INGCO gasoline generator with stable output for tools, lighting and essential equipment on remote job sites.",
    features: ["3.0kW rated output", "Low oil shutdown", "Easy start", "Fuel gauge"],
    specifications: {
      Output: "3.0 kW",
      Tank: "15L",
      Runtime: "Up to 8 hours",
    },
    warranty: "12 months warranty",
    shippingInfo: "Delivery & setup support available",
  },
  {
    id: "7",
    name: "Professional Safety Helmet",
    slug: "ing-safety-helmet-pro",
    sku: "SH100",
    brand: "INGCO",
    brandSlug: "ingco",
    category: "Safety Equipment",
    categorySlug: "safety-equipment",
    price: 55,
    rating: 4.3,
    reviewCount: 76,
    stock: 200,
    images: [p("photo-1576091160550-2173dba999ef")],
    shortDescription: "ANSI-rated safety helmet with adjustable suspension.",
    description: "Essential head protection for construction and industrial environments.",
    features: ["Adjustable fit", "Ventilation slots", "Chin strap"],
    specifications: { Standard: "EN397", Color: "Yellow" },
    warranty: "6 months",
    shippingInfo: "Standard delivery",
  },
  {
    id: "8",
    name: "Cordless Drill Driver 20V",
    slug: "dewalt-cordless-drill-20v",
    sku: "DCD777",
    brand: "DEWALT",
    brandSlug: "dewalt",
    category: "Power Tools",
    categorySlug: "power-tools",
    price: 890,
    rating: 4.8,
    reviewCount: 95,
    stock: 18,
    isNew: true,
    images: [p("photo-1572981779307-38bfe4d3a3f8")],
    shortDescription: "20V MAX compact drill/driver with LED work light.",
    description: "DEWALT cordless drill for professional carpentry and installation work.",
    features: ["20V MAX platform", "2-speed transmission", "LED light"],
    specifications: { Voltage: "20V MAX", Chuck: "13mm", Torque: "65 Nm" },
    warranty: "3 year limited warranty",
    shippingInfo: "Express delivery available in Accra",
  },
  {
    id: "9",
    name: "PVC Pipe Cutter",
    slug: "tolsen-pvc-pipe-cutter",
    sku: "TS5123",
    brand: "TOLSEN",
    brandSlug: "tolsen",
    category: "Plumbing Supplies",
    categorySlug: "plumbing-supplies",
    price: 78,
    rating: 4.4,
    reviewCount: 33,
    stock: 45,
    images: [p("photo-1607472586893-a037c0a546a8")],
    shortDescription: "Ratchet PVC pipe cutter up to 42mm.",
    description: "Clean cuts for plumbing installations with minimal burr.",
    features: ["Ratchet action", "Sharp SK5 blade", "Ergonomic grip"],
    specifications: { "Max cut": "42mm", Material: "Aluminum body" },
    warranty: "12 months",
    shippingInfo: "Standard delivery",
  },
  {
    id: "10",
    name: "Industrial Extension Cable 50m",
    slug: "ingco-extension-cable-50m",
    sku: "IEC50",
    brand: "INGCO",
    brandSlug: "ingco",
    category: "Electrical Supplies",
    categorySlug: "electrical-supplies",
    price: 320,
    rating: 4.5,
    reviewCount: 51,
    stock: 30,
    images: [p("photo-1621905252507-b35492cc74b4")],
    shortDescription: "Heavy-duty 50m extension reel for site power.",
    description: "Industrial-grade cable reel with thermal protection for construction sites.",
    features: ["50m cable", "4 outlets", "Thermal overload protection"],
    specifications: { Length: "50m", Rating: "16A", Outlets: "4" },
    warranty: "12 months",
    shippingInfo: "Nationwide delivery",
  },
  {
    id: "11",
    name: "Concrete Mixer 350L",
    slug: "industrial-concrete-mixer-350l",
    sku: "CM350",
    brand: "TOTAL",
    brandSlug: "total",
    category: "Industrial Equipment",
    categorySlug: "industrial-equipment",
    price: 12500,
    rating: 4.6,
    reviewCount: 12,
    stock: 3,
    images: [p("photo-1541888946425-d81bb19240f5")],
    shortDescription: "350L drum concrete mixer for medium-scale projects.",
    description: "Reliable mixing capacity for contractors and block manufacturing.",
    features: ["350L drum", "Steel frame", "Easy dump mechanism"],
    specifications: { Capacity: "350L", Power: "Electric 2.2kW option" },
    warranty: "12 months on-site support",
    shippingInfo: "Freight delivery — quote required",
  },
  {
    id: "12",
    name: "Rotary Hammer 1050W",
    slug: "bosch-rotary-hammer-1050w",
    sku: "GBH2-26",
    brand: "BOSCH",
    brandSlug: "bosch",
    category: "Power Tools",
    categorySlug: "power-tools",
    price: 1450,
    compareAtPrice: 1620,
    rating: 4.9,
    reviewCount: 67,
    stock: 14,
    isBestSeller: true,
    images: [p("photo-1504148455328-c376ef8136c3")],
    shortDescription: "BOSCH SDS-plus rotary hammer for concrete drilling.",
    description: "Professional demolition and drilling tool for structural work.",
    features: ["SDS-plus", "Anti-vibration", "3 modes"],
    specifications: { Power: "1050W", Impact: "2.7J", Weight: "2.9kg" },
    warranty: "24 months Bosch warranty",
    shippingInfo: "Insured delivery",
  },
];

export function getProductBySlug(categorySlug: string, slug: string) {
  return products.find(
    (p) => p.categorySlug === categorySlug && p.slug === slug,
  );
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getProductsByBrand(brandSlug: string) {
  return products.filter((p) => p.brandSlug === brandSlug);
}

export function searchProducts(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q),
  );
}

export function getFeaturedProducts() {
  return products.filter((p) => p.isFeatured);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.categorySlug === product.categorySlug ||
          p.brandSlug === product.brandSlug),
    )
    .slice(0, limit);
}
