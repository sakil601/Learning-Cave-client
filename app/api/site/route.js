import { NextResponse } from "next/server";
import { getSiteData } from "@/lib/site-data";
export async function GET() {
  return NextResponse.json({ data: await getSiteData() });
}
