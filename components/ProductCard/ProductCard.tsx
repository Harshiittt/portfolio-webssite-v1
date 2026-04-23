"use client";
import { Product } from "@/lib/ai/analyzeProducts";

interface Props {
  product: Product;
}

const SOURCE_LABELS: Record<string, string> = {
  amazon: "Amazon",
  flipkart: "Flipkart",
  meesho: "Meesho",
  myntra: "Myntra",
  zepto: "Zepto",
};

function openAmazon(url: string) {
  const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/);
  if (!asinMatch) { window.open(url, "_blank"); return; }

  const asin = asinMatch[1];
  const tag = extractTag(url);
  const isAndroid = /android/i.test(navigator.userAgent);
  const isIOS = /iphone|ipad/i.test(navigator.userAgent);

  if (isAndroid) {
    window.location.href = `intent://detail?ASIN=${asin}&tag=${tag}#Intent;scheme=amzn;package=com.amazon.mShop.android.shopping;S.browser_fallback_url=${encodeURIComponent(url)};end`;
  } else if (isIOS) {
    window.location.href = `https://www.amazon.in/dp/${asin}?tag=${tag}`;
  } else {
    window.open(url, "_blank");
  }
}

function extractTag(url: string): string {
  try {
    return new URL(url).searchParams.get("tag") ?? "";
  } catch {
    return "";
  }
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-40 object-contain rounded-md bg-gray-50"
      />

      <h2 className="text-sm font-semibold text-gray-300 line-clamp-2">
        {product.title}
      </h2>

      <div className="flex items-center justify-between text-sm">
        <span className="text-green-600 font-bold">
          ₹{product.price.toLocaleString("en-IN")}
        </span>
       { product.rating !== 0 && (
          <span className="text-yellow-500">⭐ {product.rating}</span>
        )}
      </div>

      {product.score !== undefined && (
        <span className="text-xs text-gray-400">
          Relevance score: {product.score}/100
        </span>
      )}

      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {SOURCE_LABELS[product.source] ?? product.source}
        </span>
        <button
  onClick={() =>
    product.source === "Amazon"
      ? openAmazon(product.url)
      : window.open(product.url, "_blank")
  }
  className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700"
>
  Buy Now
</button>
      </div>
    </div>
  );
}