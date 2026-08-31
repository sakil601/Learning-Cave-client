import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
export async function POST(req) {
  try {
    const body = await req.json();
    await connectDB();
    const order = await Order.create({
      customer: { name: body.name, phone: body.phone, email: body.email },
      items: body.items,
      total: body.total,
      payment: {
        method: body.method,
        account: body.account,
        transactionId: body.transactionId,
      },
    });
    return NextResponse.json({
      ok: true,
      id: order._id.toString(),
      message: "Order received successfully.",
    });
  } catch (e) {
    return NextResponse.json(
      { message: "Could not save order. Check MongoDB configuration." },
      { status: 500 },
    );
  }
}
