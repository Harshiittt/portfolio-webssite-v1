import * as cheerio from "cheerio";
import { amazonAffiliate } from '@/lib/affiliate/affiliate';
import { Product } from "../ai/analyzeProducts";

export async function fetchAmazonTop3(query: string) {
  const url = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;

  const res = await fetch(url, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    "Accept-Language": "en-IN,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
  },
});

  const html = await res.text();
  const $ = cheerio.load(html);

  const products: Product[] = [];

  $(".s-result-item").each((i, el) => {
    if (products.length >= 3) return false;

    const title = $(el).find("h2 span").text();
    const price = $(el).find(".a-price-whole").first().text();
    const image = $(el).find("img").attr("src");
    const link = $(el).find("a.a-link-normal.s-no-outline").attr("href");

if (!title || !price || !link || !link.includes("/dp/")) return;

const asinMatch = link.match(/\/dp\/([A-Z0-9]{10})/);
if (!asinMatch) return;

const cleanLink = `https://www.amazon.in/dp/${asinMatch[1]}`;

      products.push({
  id: `amazon-${i}`,
  title,
  price: Number(price.replace(/,/g, "")),
  image: image || "https://via.placeholder.com/200",
  url: `${amazonAffiliate(cleanLink)}`,
  source: "amazon",
  rating: 5,
});

  });

  return products;
}