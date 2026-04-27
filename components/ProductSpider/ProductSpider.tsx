"use client";

import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import ProductCard from "../ProductCard/ProductCard";
import { Product } from "@/lib/ai/analyzeProducts";


export default function ProductSpiderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [amazonProducts, setAmazonProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (query: string) => {
    setLoading(true);
    setSearchLoading(true);
    setError("");

    try {
      const res = await fetch("/api/product-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, location: "india" }),
      });

      if(res.ok) setSearchLoading(false);

      const amazonRes = await fetch("/api/amazon-top-6", {
        method: "POST",
        body: JSON.stringify({ query }),
      });

      const amazonData = await amazonRes.json();
      setAmazonProducts(amazonData || []);

      if (!res.ok) throw new Error("Search failed");

      const data: Product[] = await res.json();
      setProducts(data);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSearchLoading(false);
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-300 mb-8">Product Spider by Harshit</h1>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

      {/* Loading states */}
      {searchLoading && <p className="text-gray-400 text-sm mt-6">Finding your products...</p>}
      {loading && !searchLoading && <p className="text-gray-400 text-sm mt-6">Our AI is Analyzing products...</p>}
       
      {/* Affilite Products mapped */}
      { amazonProducts.length > 0 && <>
         <h2 className="mt-6 font-semibold">Top 6 Amazon Results</h2>
         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
            {amazonProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          </>}

      {/* Serper Products mapped */}
      {products.length > 0 && (
        <>
        <h2 className="mt-6 font-semibold">Top Ranked Web Results</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
         </>
      )}
      
      {!loading && products.length === 0 && (<>
        <p className="text-gray-400 text-sm mt-6 mb-4">
         Search for any product to get started.
         Powered by Groq AI, Serper and RapidAPI.
        </p>
        <h3 className= "text-lg text-gray-300 mb-4">
            Scaffold Page with real products. Amazon products are fetched using RapidAPI's Amazon Data API, 
            while the rest are sourced from Serper's web search results. Each product card includes an affiliate link, to demonstrate monetization potential.
        </h3>
        </>
      )}
    </main>
  );
}