import { fetchAmazonTop3 } from "@/lib/amazon/amazonTop3Search";
import { optimizeQuery } from "@/lib/ai/optimizeQuery";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  try {
    const optimized = await optimizeQuery(query);
    const products = await fetchAmazonTop3(optimized);
    return NextResponse.json(products);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch Amazon" }, { status: 500 });
  }
}