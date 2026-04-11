import { AnalysisResult, RepoData } from "../github/fetchRepoData";

const SYSTEM_PROMPT = `
You are a senior software engineer analyzing GitHub repositories.

Rules:
- Output STRICT JSON
- Be concise (2-3 lines per field)
- No fluff
- Focus on engineering insights only

Format:
{
  "overview": "",
  "tech_stack": [],
  "architecture": "",
  "features": [],
  "improvements": []
}
`;

export async function analyzeRepo(repo: RepoData): Promise<AnalysisResult> {
  const input = `
Name: ${repo.name}
Description: ${repo.description}

Files: ${repo.files.join(", ")}

Dependencies: ${repo.dependencies.join(", ")}

README:
${repo.readme}`;

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

  const data = await res.json();

  const text = data.choices?.[0]?.message?.content;

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Failed to parse AI response");
  }
}
