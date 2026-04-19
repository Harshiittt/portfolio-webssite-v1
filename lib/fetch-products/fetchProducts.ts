import { attachAffiliate } from "../affiliate/affiliate";
import { Product } from "../ai/analyzeProducts";

// Serper.dev Google Shopping response shape
interface SerperShoppingItem {
  title: string;
  link: string;
  source: string;        // store name e.g. "Amazon.in", "Flipkart"
  price: string;         // e.g. "₹52,000"
  rating?: number;
  ratingCount?: number;
  imageUrl?: string;
  position: number;
}

interface SerperResponse {
  shopping: SerperShoppingItem[];
}

// ─── Normalize source name to our known keys ──────────────────────────────────
function normalizeSource(source: string): string {
  const s = source.toLowerCase();
  if (s.includes("amazon"))   return "amazon";
  if (s.includes("flipkart")) return "flipkart";
  if (s.includes("meesho"))   return "meesho";
  if (s.includes("myntra"))   return "myntra";
  if (s.includes("ajio"))     return "ajio";
  if (s.includes("nykaa"))    return "nykaa";
  return source.toLowerCase().replace(/\s+/g, "_");
}

// ─── Parse price string → number ─────────────────────────────────────────────
// Handles "₹52,000", "Rs. 52,000", "$699", "52000" etc.
function parsePrice(priceStr: string): number {
  const cleaned = priceStr.replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
}
// ─── Direct retailer search URLs ─────────────────────────────────────────────
function resolveProductUrl(link: string, source: string, title: string): string {
  const isGoogleUrl = link.includes("google.com");
  if (!isGoogleUrl) return link;

  const q = encodeURIComponent(title);
  switch (source) {
    case "amazon":   return `https://www.amazon.in/s?k=${q}`;
    case "flipkart": return `https://www.flipkart.com/search?q=${q}`;
    case "meesho":   return `https://www.meesho.com/search?q=${q}`;
    case "myntra":   return `https://www.myntra.com/${q}`;
    case "ajio":     return `https://www.ajio.com/search/?text=${q}`;
    case "nykaa":    return `https://www.nykaa.com/search/result/?q=${q}`;
    default:         return link;
  }
}

// ─── Main fetch function ──────────────────────────────────────────────────────
export async function fetchProducts(
  query: string,
  location: string = "india"
): Promise<Product[]> {
  const apiKey = process.env.SERPER_API_KEY;

  if (!apiKey) {
    throw new Error("SERPER_API_KEY is not set in environment variables.");
  }

  const response = await fetch("https://google.serper.dev/shopping", {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: query,
      gl: "in",      // country: India
      hl: "en",      // language: English
      num: 20,       // fetch 20 results (we'll rank + trim via Grok)
    }),
  });

  if (!response.ok) {
    throw new Error(`Serper API error: ${response.status} ${response.statusText}`);
  }

  const data: SerperResponse = await response.json();

  if (!data.shopping || data.shopping.length === 0) {
    return [];
  }

  // ─── Normalize to our Product type ─────────────────────────────────────────
const products: Product[] = data.shopping.map((item, index) => {
  const source = normalizeSource(item.source);
  const resolvedUrl = resolveProductUrl(item.link, source, item.title);
  return {
    id: `serper_${index}_${Date.now()}`,
    title: item.title,
    price: parsePrice(item.price),
    image: item.imageUrl ?? "https://via.placeholder.com/200",
    source,
    url: attachAffiliate(resolvedUrl, source), // ← direct url + affiliate in one shot
    rating: item.rating ?? 0,
  };
});

  // ─── Filter: only include products with a valid price ──────────────────────
  return products.filter((p) => p.price > 0);
}