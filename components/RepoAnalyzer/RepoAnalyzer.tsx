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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Github Repo Analyzer by Harshit</h1>
        <p className="text-zinc-400 mb-4">
          Paste a public GitHub repository to get an AI-powered breakdown
        </p>
        <h1 className="text-xl font-bold mb-8">Powered by Grok AI</h1>

        {/* Input */}
        <div className="flex gap-4 mb-10">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/user/repo"
            className="flex-1 p-3 rounded-lg bg-zinc-900 border border-zinc-800 focus:outline-none focus:border-[#64ffda]"
          />
          <button
            onClick={handleAnalyze}
            className="px-6 py-3 bg-[#64ffda] text-black rounded-lg hover:opacity-80 active:scale-95 transition"
          >
            Analyze
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        )}

        {/* Result */}
        {data && (
          <div className="space-y-6">
            {/* Overview */}
            <Card title="Overview">
              <p>{data.overview}</p>
            </Card>

            {/* Tech Stack */}
            <Card title="Tech Stack">
              <div className="flex flex-wrap gap-2">
                {data.tech_stack?.map((tech: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm bg-zinc-800 rounded-full border border-zinc-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Card>

            {/* Architecture */}
            <Card title="Architecture">
              <p>{data.architecture}</p>
            </Card>

            {/* Design Patterns */}
            <Card title="Design Patterns">
              <List items={data.design_patterns} />
            </Card>

            {/* Features */}
            <Card title="Key Features">
              <List items={data.key_features} />
            </Card>

            {/* Scalability */}
            <Card title="Scalability">
              <p>{data.scalability}</p>
            </Card>

            {/* Code Quality */}
            <Card title="Code Quality">
              <p>{data.code_quality}</p>
            </Card>

            {/* Improvements */}
            <Card title="Improvements">
              <List items={data.improvements} />
            </Card>

            {/* Confidence */}
            <Card title="Confidence Score">
              <div className="flex items-center gap-3">
  <div className="flex-1">
    <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
      <div
        className="bg-[#64ffda] h-3 rounded-full transition-all"
        style={{ width: `${data.confidence *100 }%` }}
      />
    </div>
  </div>

  <span className="text-sm text-zinc-400 whitespace-nowrap">
    {data.confidence*100}/100
  </span>
</div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <div
      className="p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-[2px]"
       style={{
        background: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "var(--border-hover)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--border-color)")
      }
    >
      <h2
        className="text-xl font-semibold mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h2>

      <div style={{ color: "var(--text-secondary)" }}>
        {children}
      </div>
    </div>
  );
}

function List({ items = [] }: { items: string[] }) {
  if (!items?.length) return <p className="text-zinc-500">No data</p>;

  return (
    <ul className="list-disc list-inside space-y-1">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function Skeleton() {
  return (
    <div
      className="p-6 rounded-2xl border animate-pulse"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      <div
        className="h-4 rounded w-1/3 mb-4"
        style={{ background: "var(--border-color)" }}
      />

      <div
        className="h-3 rounded w-full mb-2"
        style={{ background: "var(--border-color)" }}
      />

      <div
        className="h-3 rounded w-5/6"
        style={{ background: "var(--border-color)" }}
      />
    </div>
  );
}