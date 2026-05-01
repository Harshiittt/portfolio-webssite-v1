import { NextResponse } from "next/server";
import { findArbs, type OddsApiEvent, type ArbOpportunity } from "@/lib/arb-engine/arb-engine";
import { getCache, setCache, isCacheStale, getCacheAge } from "@/lib/cache/simpleCache";

const CACHE_KEY     = "odds_scan";
const COOLDOWN_MS   = 10 * 60 * 1000; // 10 minutes

const SPORTS = [
  { key: "soccer_epl",                  label: "EPL" },
  { key: "soccer_spain_la_liga",        label: "La Liga" },
  { key: "soccer_uefa_champs_league",   label: "UCL" },
  { key: "basketball_nba",              label: "NBA" },
];

export interface ScanResult {
  opportunities:    ArbOpportunity[];
  sportSummary:     { sport: string; events: number; arbs: number }[];
  errors:           string[];
  remainingRequests: number | null;
  fromCache:        boolean;
  cacheAgeMs:       number | null;   // how old the cached data is
  nextAllowedMs:    number | null;   // ms until next scan is allowed (null = allowed now)
}

export async function GET(): Promise<NextResponse<ScanResult | { error: string }>> {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ODDS_API_KEY is not set in .env.local" },
      { status: 500 }
    );
  }

  // ── Cooldown check ──────────────────────────────────────────────────────────
  if (!isCacheStale(CACHE_KEY, COOLDOWN_MS)) {
    const cached    = getCache(CACHE_KEY) as ScanResult;
    const cacheAge  = getCacheAge(CACHE_KEY)!;
    return NextResponse.json({
      ...cached,
      fromCache:     true,
      cacheAgeMs:    cacheAge,
      nextAllowedMs: COOLDOWN_MS - cacheAge,
    });
  }

  // ── Fresh scan ──────────────────────────────────────────────────────────────
  const allOpportunities: ArbOpportunity[] = [];
  const sportSummary: ScanResult["sportSummary"] = [];
  const errors: string[] = [];
  let remainingRequests: number | null = null;

  for (const sport of SPORTS) {
    try {
      const res = await fetch(
        `https://api.the-odds-api.com/v4/sports/${sport.key}/odds/` +
        `?apiKey=${apiKey}&regions=uk,eu,us&markets=h2h&oddsFormat=decimal`,
        { cache: "no-store" }
      );

      const remaining = res.headers.get("x-requests-remaining");
      if (remaining) remainingRequests = parseInt(remaining, 10);

      if (res.status === 401) return NextResponse.json({ error: "Invalid Odds API key." }, { status: 401 });
      if (res.status === 422) { sportSummary.push({ sport: sport.label, events: 0, arbs: 0 }); continue; }
      if (!res.ok)            { errors.push(`${sport.label}: HTTP ${res.status}`); continue; }

      const events: OddsApiEvent[] = await res.json();
      const arbs = findArbs(events, sport.label);
      allOpportunities.push(...arbs);
      sportSummary.push({ sport: sport.label, events: events.length, arbs: arbs.length });
    } catch {
      errors.push(`${sport.label}: network error`);
    }
  }

  allOpportunities.sort((a, b) => b.profitPct - a.profitPct);

  const result: ScanResult = {
    opportunities:    allOpportunities,
    sportSummary,
    errors,
    remainingRequests,
    fromCache:        false,
    cacheAgeMs:       0,
    nextAllowedMs:    COOLDOWN_MS,
  };

  setCache(CACHE_KEY, result);
  return NextResponse.json(result);
}   