"use client";

import { useState } from "react";

export default function RepoAnalyzerPage() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
  try {
    setLoading(true);
    setData(null);

    const res = await fetch("/api/github-analyzer", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ url }),
});

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error);
    }

    setData(result);
  } catch (err) {
    console.error(err);
    alert("Something failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Analyze My Repo</h1>

      <div className="flex gap-4 mb-8">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste GitHub repo URL..."
          className="flex-1 p-3 rounded-lg bg-zinc-900 border border-zinc-800"
        />
        <button
          onClick={handleAnalyze}
          className="px-6 py-3 bg-[#64ffda] text-black rounded-lg hover:opacity-80"
        >
          Analyze
        </button>
      </div>

      {loading && <p className="text-zinc-400">Analyzing...</p>}

      {data && (
        <div className="space-y-6">
          <Section title="Overview" content={data.overview} />
          <Section title="Tech Stack" content={data.tech_stack.join(", ")} />
          <Section title="Architecture" content={data.architecture} />
          <Section title="Features" content={data.features.join(", ")} />
          <Section title="Improvements" content={data.improvements.join(", ")} />
        </div>
      )}
    </div>
  );
}

function Section({ title, content }: any) {
  return (
    <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-zinc-300">{content}</p>
    </div>
  );
}