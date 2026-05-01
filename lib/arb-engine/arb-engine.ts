// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface Outcome {
  name: string;
  odds: number;
  bookmaker: string;
  bookmakerKey: string;
}

export interface ArbOpportunity {
  id: string;
  sport: string;
  match: string;
  commenceTime: string;
  outcomes: Outcome[];
  profitPct: number;
}

export interface StakeResult {
  legs: (Outcome & { stake: string })[];
  payout: string;
  profit: string;
}

export interface TrackedBet extends ArbOpportunity {
  addedAt: string;
}

export interface OddsApiEvent {
  id: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: {
    key: string;
    title: string;
    markets: {
      key: string;
      outcomes: { name: string; price: number }[];
    }[];
  }[];
}

// ─── BOOKMAKER DEDUPLICATION ──────────────────────────────────────────────────
// Maps every alias key → canonical key so duplicate sources are collapsed.
// e.g. betfair_ex_eu and betfair_ex_uk both count as "betfair".

const BK_CANONICAL: Record<string, string> = {
  // Betfair variants
  betfair_ex_eu:  "betfair",
  betfair_ex_uk:  "betfair",
  // Unibet regional variants (all map to same exchange)
  unibet_eu:      "unibet",
  unibet_us:      "unibet",
  unibet_nl:      "unibet",
  unibet_se:      "unibet",
  unibet_de:      "unibet",
  unibet_fr:      "unibet",
  // 1xBet actual API key
  onexbet:        "onexbet",
};

export function canonicalKey(key: string): string {
  return BK_CANONICAL[key] ?? key;
}

// ─── FOCUSED MODE — the 6 sites worth creating accounts on ───────────────────
// Chosen for: best odds, arb-friendliness, global availability.

export const FOCUSED_SITE_KEYS = new Set([
  "pinnacle",
  "betfair",    // covers betfair_ex_eu / betfair_ex_uk via canonical
  "bet365",
  "onexbet",    // actual API key for 1xBet
  "williamhill",
  "unibet",     // covers all unibet_nl / unibet_se / unibet_eu etc. via canonical
]);

export const FOCUSED_SITE_LABELS: Record<string, string> = {
  pinnacle:    "Pinnacle",
  betfair:     "Betfair",
  bet365:      "Bet365",
  onexbet:     "1xBet",
  williamhill: "William Hill",
  unibet:      "Unibet",
};

/** Returns true if every leg of an opportunity comes from a focused site. */
export function isFocusedArb(opp: ArbOpportunity): boolean {
  return opp.outcomes.every(o => FOCUSED_SITE_KEYS.has(canonicalKey(o.bookmakerKey)));
}

/** Returns true if any canonical bookmaker key appears on more than one leg. */
export function hasDuplicateBooks(opp: ArbOpportunity): boolean {
  const seen = new Set<string>();
  for (const o of opp.outcomes) {
    const ck = canonicalKey(o.bookmakerKey);
    if (seen.has(ck)) return true;
    seen.add(ck);
  }
  return false;
}


// ─── ARB ENGINE ───────────────────────────────────────────────────────────────

export function findArbs(events: OddsApiEvent[], sportLabel: string): ArbOpportunity[] {
  const opps: ArbOpportunity[] = [];

  for (const event of events) {
    // Best odds per outcome, deduplicated by canonical bookmaker key
    const bestOdds: Record<string, Outcome> = {};

    for (const bk of event.bookmakers ?? []) {
      const ck = canonicalKey(bk.key);
      for (const market of bk.markets ?? []) {
        if (market.key !== "h2h") continue;
        for (const outcome of market.outcomes) {
          const existing = bestOdds[outcome.name];
          // Only update if this canonical source gives better odds
          if (!existing || outcome.price > existing.odds) {
            bestOdds[outcome.name] = {
              name:         outcome.name,
              odds:         outcome.price,
              bookmaker:    FOCUSED_SITE_LABELS[ck] ?? bk.title,
              bookmakerKey: ck,
            };
          }
        }
      }
    }

    const outcomes = Object.values(bestOdds);
    if (outcomes.length < 2) continue;

    const sum = outcomes.reduce((s, o) => s + 1 / o.odds, 0);
    if (sum < 1) {
      opps.push({
        id:           event.id,
        sport:        sportLabel,
        match:        `${event.home_team} vs ${event.away_team}`,
        commenceTime: event.commence_time,
        outcomes,
        profitPct:    (1 - sum) * 100,
      });
    }
  }

  return opps.sort((a, b) => b.profitPct - a.profitPct);
}

// ─── STAKE CALCULATOR ─────────────────────────────────────────────────────────

export function calcStakes(outcomes: Outcome[], bankroll: number): StakeResult {
  const sum     = outcomes.reduce((s, o) => s + 1 / o.odds, 0);
  const payout  = bankroll / sum;
  return {
    legs:   outcomes.map(o => ({ ...o, stake: ((bankroll * (1 / o.odds)) / sum).toFixed(2) })),
    payout: payout.toFixed(2),
    profit: (payout - bankroll).toFixed(2),
  };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export const fmt = (n: string | number) =>
  parseFloat(String(n)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

export const profitColor = (pct: number): string =>
  pct >= 3 ? "var(--color-teal)" : pct >= 1.5 ? "#ffd60a" : "var(--color-teal)";

export const BK_LINKS: Record<string, string> = {
  pinnacle:    "https://www.pinnacle.com/en/sports/",
  betfair:     "https://www.betfair.com/sport/",
  bet365:      "https://www.bet365.com/",
  williamhill: "https://www.williamhill.com/",
  unibet:      "https://www.unibet.com/",
  onexbet:     "https://1xbet.com/en/line/",
  draftkings:  "https://sportsbook.draftkings.com/",
  fanduel:     "https://www.fanduel.com/sports",
  betway:      "https://www.betway.com/",
  smarkets:    "https://smarkets.com/sport/",
  matchbook:   "https://www.matchbook.com/",
  betfred_uk:  "https://www.betfred.com/sports/",
  bovada:      "https://www.bovada.lv/",
  betmgm:      "https://sports.betmgm.com/",
  caesars:     "https://www.caesars.com/sportsbook-and-casino",
  betrivers:   "https://www.betrivers.com/",
  mybookie_ag: "https://mybookie.ag/",
  betonlineag: "https://www.betonline.ag/",
  superbook:   "https://www.superbookusa.com/",
  lowvig:      "https://www.lowvig.ag/",
};