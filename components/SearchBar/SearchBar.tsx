"use client";

import { useState } from "react";

interface Props {
  onSearch: (query: string) => void;
  loading?: boolean;
}

export default function SearchBar({ onSearch, loading }: Props) {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div className="flex gap-2 w-full max-w-xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Search for a product..."
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
}