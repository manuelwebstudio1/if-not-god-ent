export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  description?: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logo?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  subcategory?: string;
  subcategorySlug?: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  isAvailable?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  images: string[];
  shortDescription: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  warranty: string;
  shippingInfo: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  image: string;
  content: string;
};

export type OrderStatus =
  | "ORDER_RECEIVED"
  | "PAYMENT_CONFIRMED"
  | "PROCESSING"
  | "READY_FOR_DELIVERY"
  | "SHIPPED"
  | "DELIVERED";

export type PaymentMethod =
  | "MTN_MOMO"
  | "TELECEL_CASH"
  | "AIRTELTIGO"
  | "VISA"
  | "MASTERCARD"
  | "BANK_TRANSFER"
  | "PAYSTACK"
  | "FLUTTERWAVE";
