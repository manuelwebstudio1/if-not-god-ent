export const siteConfig = {
  name: "IF NOT GOD ENT",
  shortName: "ING",
  slogan: "Building Excellence. Delivering Quality.",
  tagline:
    "Your trusted partner for premium building materials, engineering tools, plumbing supplies, industrial equipment and more.",
  description:
    "Premium building materials, construction tools, engineering equipment, plumbing supplies, power tools, and industrial machinery in Ghana.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "+233 24 000 0000",
  phoneRaw: process.env.NEXT_PUBLIC_PHONE_RAW ?? "233240000000",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "info@ifnotgodent.com",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "233240000000",
  address: "Accra, Greater Accra Region, Ghana",
  businessHours: "Mon – Sat: 8:00 AM – 6:00 PM",
  currency: "GH₵",
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://x.com",
    youtube: "https://youtube.com",
    tiktok: "https://tiktok.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
