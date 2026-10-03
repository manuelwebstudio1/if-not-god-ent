import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { listOrders, saveOrder } from "@/lib/local-db";
import type { OrderStatus, PaymentMethod } from "@/types/commerce";

const paymentMethods = z.enum([
  "MTN_MOMO",
  "TELECEL_CASH",
  "AIRTELTIGO",
  "VISA",
  "MASTERCARD",
  "BANK_TRANSFER",
  "PAYSTACK",
  "FLUTTERWAVE",
]);

const schema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  region: z.string().min(2),
  city: z.string().min(2),
  digitalAddress: z.string().optional(),
  streetAddress: z.string().min(3),
  deliveryNotes: z.string().optional(),
  paymentMethod: paymentMethods,
  subtotal: z.number().nonnegative(),
  deliveryCost: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  total: z.number().nonnegative(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string(),
        sku: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().nonnegative(),
      }),
    )
    .min(1),
});

function generateOrderNumber() {
  return `ING-${Date.now().toString(36).toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const order = await saveOrder({
      orderNumber: generateOrderNumber(),
      status: "ORDER_RECEIVED" as OrderStatus,
      paymentMethod: body.paymentMethod as PaymentMethod,
      paymentStatus: "PENDING",
      subtotal: body.subtotal,
      deliveryCost: body.deliveryCost,
      discount: body.discount,
      total: body.total,
      customerName: body.customerName,
      phone: body.phone,
      email: body.email,
      region: body.region,
      city: body.city,
      digitalAddress: body.digitalAddress,
      streetAddress: body.streetAddress,
      deliveryNotes: body.deliveryNotes,
      items: body.items,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
      message:
        "Order received. Complete payment using your selected method. Our team will confirm shortly.",
    });
  } catch {
    return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
  }
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ orders: await listOrders() });
}
