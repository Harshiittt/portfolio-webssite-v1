export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  source: "amazon" | "flipkart" | "meesho" | "myntra" | string;
  url: string;
  rating: number;
  score?: number;
}

export async function rankWithGrok(
  products: Product[],
  query: string
): Promise<Product[]> {
  // Send only essential fields — reduces payload size
  const trimmed = products.map(({ id, title, price, rating, source }) => ({
    id, title, price, rating, source,
  }));

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,  // reuse existing key
    "Content-Type": "application/json",
  },
   body: JSON.stringify({
    model: "llama-3.3-70b-versatile",   // ← grok-beta is deprecated, use this
      messages: [
        {
          role: "system",
          content: `You are a product ranking AI. Given a user query and a list of products,
return a JSON array of the same products sorted by relevance, price-value ratio, and rating.
Add a "score" field (0-100) to each product. Return ONLY valid JSON — no explanation, no markdown.`,
        },
        {
          role: "user",
          content: `Query: "${query}"\nProducts: ${JSON.stringify(trimmed)}`,
        },
      ],
    }),
  });

  // Log full error body if not ok
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Grok API error: ${response.status} — ${errText}`);
  }

  const data = await response.json();
  const raw: string = data.choices?.[0]?.message?.content ?? "";
  const clean = raw.replace(/```json|```/g, "").trim();
  const ranked: { id: string; score: number }[] = JSON.parse(clean);

  // Merge scores back into original full product objects
  const scoreMap = new Map(ranked.map((r) => [r.id, r.score]));
  return [...products]
    .map((p) => ({ ...p, score: scoreMap.get(p.id) ?? 0 }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}