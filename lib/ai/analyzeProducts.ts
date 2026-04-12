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
  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-beta",
      messages: [
        {
          role: "system",
          content: `You are a product ranking AI. Given a user query and a list of products,
return a JSON array of the same products sorted by relevance, price-value ratio, and rating.
Add a "score" field (0-100) to each product. Return ONLY valid JSON — no explanation, no markdown.`,
        },
        {
          role: "user",
          content: JSON.stringify({ query, products }),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Grok API error: ${response.status}`);
  }

  const data = await response.json();
  const raw: string = data.choices?.[0]?.message?.content ?? "";

  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as Product[];
}