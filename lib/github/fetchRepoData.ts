export interface RepoData {
  name: string;
  description: string;
  readme: string;
  files: string[];
  dependencies: string[];
}

export interface AnalysisResult {
  overview: string;
  tech_stack: string[];
  architecture: string;
  features: string[];
  improvements: string[];
}

export async function fetchRepoData(url: string) {
  const match = url.match(/github.com\/(.*?)\/(.*?)(\/|$)/);
  if (!match) throw new Error("Invalid GitHub URL");

  const owner = match[1];
  const repo = match[2];

  const base = `https://api.github.com/repos/${owner}/${repo}`;

  const [repoData, readmeRes, contentsRes, pkgRes] = await Promise.all([
    fetch(base).then((r) => r.json()),
    fetch(`${base}/readme`).then((r) => r.json()),
    fetch(`${base}/contents`).then((r) => r.json()),
    fetch(`${base}/contents/package.json`).then((r) =>
      r.ok ? r.json() : null
    ),
  ]);

  const readme = readmeRes?.content
    ? Buffer.from(readmeRes.content, "base64").toString("utf-8").slice(0, 2000)
    : "";

  const files = contentsRes.map((f: any) => f.name);

  let dependencies: string[] = [];
  if (pkgRes?.content) {
    const pkg = JSON.parse(
      Buffer.from(pkgRes.content, "base64").toString("utf-8")
    );
    dependencies = Object.keys(pkg.dependencies || {});
  }

  return {
    name: repoData.name,
    description: repoData.description,
    readme,
    files,
    dependencies,
  };
}