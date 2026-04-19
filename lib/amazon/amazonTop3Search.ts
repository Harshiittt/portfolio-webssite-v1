import { amazonAffiliate } from '@/lib/affiliate/affiliate';
import { Product } from "../ai/analyzeProducts";

export async function fetchAmazonTop3(query: string): Promise<Product[]> {
  const res = await fetch(
    `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&country=IN&sort_by=RELEVANCE&product_condition=ALL`,
    {
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
        "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      
    }
  );

  if (!res.ok) throw new Error(`RapidAPI error: ${res.status}`);

  const data = await res.json();
  const items = data?.data?.products ?? [];

  return items
    .slice(0, 6)
    .map((item: any, i: number) => {
      const asin = item.asin;
      const cleanLink = `https://www.amazon.in/dp/${asin}`;
      return {
        id: `amazon-${i}`,
        title: item.product_title,
        price: Number(item.product_price?.replace(/[^0-9.]/g, "")) || 0,
        image: item.product_photo ?? "https://via.placeholder.com/200",
        url: amazonAffiliate(cleanLink),
        source: "amazon",
        rating: Number(item.product_star_rating) || 0,
      };
    })
    .filter((p: Product) => p.price > 0);
}