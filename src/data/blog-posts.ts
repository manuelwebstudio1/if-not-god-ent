import type { BlogPost } from "@/types/commerce";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "choosing-the-right-impact-drill",
    title: "Choosing the Right Impact Drill for Ghanaian Construction Sites",
    excerpt:
      "Power, chuck size, and duty cycle matter when selecting drills for masonry and steel work.",
    category: "Tools",
    author: "IF NOT GOD ENT Team",
    publishedAt: "2026-09-12",
    image:
      "https://images.unsplash.com/photo-1572981779307-38bfe4d3a3f8?auto=format&fit=crop&w=1200&q=80",
    content:
      "Impact drills are essential on modern construction sites. Consider wattage, impact rate, and ergonomics before purchase. For block work and light demolition, 850W class tools such as the INGCO Impact Drill 850W offer an excellent balance of performance and value.",
  },
  {
    id: "2",
    slug: "water-pump-sizing-guide",
    title: "Water Pump Sizing for Dewatering and Irrigation",
    excerpt:
      "Learn how to match pump flow rate and head to your project requirements.",
    category: "Plumbing",
    author: "Engineering Desk",
    publishedAt: "2026-08-20",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
    content:
      "Selecting a KOSHIN or equivalent centrifugal pump requires understanding inlet size, flow rate (L/min), and total dynamic head. For most site dewatering, 2-inch pumps provide practical throughput without excessive fuel or power draw.",
  },
  {
    id: "3",
    slug: "bulk-cement-procurement-tips",
    title: "Bulk Building Materials: Procurement Tips for Contractors",
    excerpt:
      "Plan lead times, storage, and delivery windows for cement and aggregates.",
    category: "Building Materials",
    author: "Procurement Team",
    publishedAt: "2026-07-05",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    content:
      "Bulk orders reduce unit cost but require logistics planning. Coordinate delivery slots, moisture protection for cement, and site access for offloading equipment.",
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
