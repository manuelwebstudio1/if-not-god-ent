import { siteConfig } from "@/config/site";

export function getWhatsAppNumber() {
  return "233502889487";
}

export function buildWhatsAppUrl(message?: string) {
  const number = getWhatsAppNumber();
  if (!message) return `https://wa.me/${number}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppMessage(product: {
  name: string;
  sku: string;
  price: number;
}) {
  return `Hello ${siteConfig.name}, I am interested in the ${product.name}, SKU ${product.sku}, priced at GH₵${product.price.toFixed(2)}. Please confirm availability and delivery information.`;
}

export function openWhatsApp(message: string) {
  if (typeof window === "undefined") return;
  window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
}
