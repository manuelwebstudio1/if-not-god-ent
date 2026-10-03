import { NextResponse } from "next/server";
import { z } from "zod";
import { findOrder } from "@/lib/local-db";

const schema = z.object({
  orderNumber: z.string().min(3),
  contact: z.string().min(3),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const order = await findOrder(body.orderNumber, body.contact);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: order.total,
      createdAt: order.createdAt,
      items: order.items,
    });
  } catch {
    return NextResponse.json({ error: "Invalid tracking request" }, { status: 400 });
  }
}
