import { RepoData, AnalysisResult } from "../github/fetchRepoData";

const SYSTEM_PROMPT = `
You are a senior staff software engineer analyzing GitHub repositories.

Your job:
- Reverse engineer architecture
- Infer design decisions
- Identify patterns and scalability

Rules:
- STRICT JSON output only
- Max 5 lines per field
- No fluff, no generic statements
- Make intelligent assumptions if needed

Format:
{
  "overview": "",
  "tech_stack": [],
  "architecture": "",
  "design_patterns": [],
  "key_features": [],
  "scalability": "",
  "code_quality": "",
  "improvements": [],
  "confidence": 0
}
`;

function detectProjectType(files: string[]) {
  if (files.includes("next.config.js")) return "Next.js App";
  if (files.includes("package.json")) return "Node.js App";
  if (files.includes("requirements.txt")) return "Python App";
  return "Unknown";
}

function extractStructure(files: string[]) {
  return files.slice(0, 16); // keep it small
}

function filterDependencies(deps: string[]) {
  const important = [
    "react",
    "next",
    "express",
    "mongodb",
    "axios",
    "tailwindcss",
    "typescript",
  ];
  return deps.filter((d) => important.includes(d));
}

export async function analyzeRepo(repo: RepoData): Promise<AnalysisResult> {
  const projectType = detectProjectType(repo.files);
  const structure = extractStructure(repo.files);
  const deps = filterDependencies(repo.dependencies);

  const input = `
Project: ${repo.name}

Description:
${repo.description}

Type:
${projectType}

Structure:
${structure.join(", ")}

Key Dependencies:
${deps.join(", ")}

README:
${repo.readme}
`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: input },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq error: ${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;

  try {
    return JSON.parse(text);
  } catch {
    console.error("RAW AI:", text);
    throw new Error("Invalid JSON from AI");
  }
}