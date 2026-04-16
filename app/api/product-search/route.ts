import { attachAffiliateToAll } from "@/lib/affiliate/affiliate";
import { rankWithGrok } from "@/lib/ai/analyzeProducts";
import { fetchProducts } from "@/lib/fetch-products/fetchProducts";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { query, location } = await req.json();

  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  let products = await fetchProducts(query, location ?? "india");

  try {
    products = await rankWithGrok(products, query);
  } catch (e) {
    console.warn("Grok ranking failed, using default order:", e);
  }

 //products = attachAffiliateToAll(products);

  return NextResponse.json(products);
}