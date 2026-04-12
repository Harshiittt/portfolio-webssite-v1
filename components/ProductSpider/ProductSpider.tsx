"use client";

import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import ProductCard from "../ProductCard/ProductCard";
import { Product } from "@/lib/ai/analyzeProducts";


export default function ProductSpiderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/product-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, location: "india" }),
      });

      if (!res.ok) throw new Error("Search failed");

      const data: Product[] = await res.json();
      setProducts(data);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-300 mb-8">Product Spider by Harshit</h1>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (<>
        <p className="text-gray-400 text-sm mt-6 mb-4">
         Search for any product to get started.
         Powered by Grok Beta by X AI and Serper.
        </p>
        <h3 className= "text-lg text-gray-300 mb-4">
            Scaffold Page with real products. Full feature being worked on.
        </h3>
        </>
      )}
    </main>
  );
}