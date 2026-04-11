// app/api/analyze/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getCache, setCache } from "../../../lib/cache/simpleCache";
import { fetchRepoData } from "../../../lib/github/fetchRepoData";
import { analyzeRepo } from "../../../lib/ai/analyzeRepo";


export async function POST(req: NextRequest) {
  try {
    
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    const cached = getCache(url);
    if (cached) {
      return NextResponse.json(cached); 
    }

    const repo = await fetchRepoData(url);
    const analysis = await analyzeRepo(repo);

    setCache(url, analysis);

    return NextResponse.json(analysis);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}