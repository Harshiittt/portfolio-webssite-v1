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

function getAmazonAppUrl(url: string): string {
  try {
    if (/android/i.test(navigator.userAgent)) {
      return `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=in.amazon.mShop.android.shopping;S.browser_fallback_url=${encodeURIComponent(url)};end`;
    }

    if (/iphone|ipad/i.test(navigator.userAgent)) {
      return url; // iOS handles universal links fine
    }

    return url;
  } catch {
    return url;
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
        <a
          href={product.source === "amazon" ? getAmazonAppUrl(product.url) : product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700"
        >
          Buy Now
        </a>
      </div>
    </div>
  );
}