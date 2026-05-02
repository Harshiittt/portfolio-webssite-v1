"use client";

import { useState, useCallback, useEffect } from "react";
import {
  calcStakes, fmt, fmtTime, profitColor,
  isFocusedArb, FOCUSED_SITE_LABELS,
  BK_LINKS,
  type ArbOpportunity, type TrackedBet,
} from "@/lib/arb-engine/arb-engine";
import type { ScanResult } from "@/app/api/bet-get/route";
import styles from "./ArbDashboard.module.css";

const SPORT_FILTERS = ["All", "EPL", "La Liga", "UCL", "Bundesliga", "Serie A", "NBA"] as const;

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function StatPill({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={styles.statPill}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue} style={accent ? { color: "var(--color-teal)" } : {}}>{value}</span>
    </div>
  );
}

function BookLink({ bkKey, bkTitle }: { bkKey: string; bkTitle: string }) {
  const url = BK_LINKS[bkKey];
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className={styles.bookLink} onClick={e => e.stopPropagation()}>
      {bkTitle} ↗
    </a>
  );
}

function Cooldown({ nextAllowedMs, onExpire }: { nextAllowedMs: number; onExpire: () => void }) {
  const [remaining, setRemaining] = useState(nextAllowedMs);

  useEffect(() => {
    if (remaining <= 0) { onExpire(); return; }
    const t = setInterval(() => setRemaining(r => {
      if (r <= 1000) { clearInterval(t); onExpire(); return 0; }
      return r - 1000;
    }), 1000);
    return () => clearInterval(t);
  }, []);

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  return (
    <span className={styles.cooldownBadge}>
      Next scan in {mins}:{secs.toString().padStart(2, "0")}
    </span>
  );
}

function OpportunityRow({
  opp, index, bankroll, isExpanded, inMyBets,
  onToggleExpand, onToggleMyBets,
}: {
  opp: ArbOpportunity; index: number; bankroll: number;
  isExpanded: boolean; inMyBets: boolean;
  onToggleExpand: () => void; onToggleMyBets: () => void;
}) {
  const { legs, profit, payout } = calcStakes(opp.outcomes, bankroll);
  const pc = profitColor(opp.profitPct);

  return (
    <>
      <tr className={`${styles.oppRow} ${isExpanded ? styles.oppRowExpanded : ""}`} onClick={onToggleExpand}>
        <td className={styles.tdIndex}>{index + 1}</td>

        <td className={styles.tdMatch}>
          <div className={styles.matchName}>{opp.match}</div>
          <div className={styles.matchSport}>{opp.sport}</div>
        </td>

        <td className={styles.tdTime}>{fmtTime(opp.commenceTime)}</td>

        {/* Books + stakes inline */}
        <td className={styles.tdBooks}>
          <div className={styles.bookBadges}>
            {legs.map(leg => (
              <span key={leg.name} className={styles.bookBadge}>
                <span className={styles.bookBadgeName}>{leg.bookmaker}</span>
                <span className={styles.bookBadgeOdds}>{leg.name} @ {leg.odds.toFixed(2)}</span>
                <span className={styles.bookBadgeStake}>Stake ${leg.stake}</span>
              </span>
            ))}
          </div>
        </td>

        <td className={styles.tdProfit} style={{ color: pc }}>+{opp.profitPct.toFixed(2)}%</td>
        <td className={styles.tdAmount} style={{ color: pc }}>+${fmt(profit)}</td>

        <td className={styles.tdAction} onClick={e => e.stopPropagation()}>
          <button className={`${styles.trackBtn} ${inMyBets ? styles.trackBtnActive : ""}`} onClick={onToggleMyBets}>
            {inMyBets ? "✓ Tracked" : "+ My Bets"}
          </button>
        </td>
      </tr>

      {isExpanded && (
        <tr className={styles.detailRow}>
          <td colSpan={7}>
            <div className={styles.detailInner}>
              <p className={styles.detailLabel}>
                Stake breakdown · ${fmt(bankroll)} bankroll · guaranteed return ${fmt(payout)}
              </p>
              <div className={styles.stakeGrid} style={{ gridTemplateColumns: `repeat(${legs.length + 2}, 1fr)` }}>
                {legs.map(leg => (
                  <div key={leg.name} className={styles.stakeCard}>
                    <span className={styles.stakeCardLabel}>Bet on</span>
                    <span className={styles.stakeCardOutcome}>{leg.name}</span>
                    <span className={styles.stakeCardBook}>{leg.bookmaker} · {leg.odds.toFixed(2)} odds</span>
                    <span className={styles.stakeCardAmount}>${leg.stake}</span>
                    <BookLink bkKey={leg.bookmakerKey} bkTitle={leg.bookmaker} />
                  </div>
                ))}
                <div className={styles.stakeCard}>
                  <span className={styles.stakeCardLabel}>Total return</span>
                  <span className={styles.stakeCardAmount} style={{ color: "#ffd60a" }}>${fmt(payout)}</span>
                </div>
                <div className={`${styles.stakeCard} ${styles.stakeCardProfit}`}>
                  <span className={styles.stakeCardLabel}>Guaranteed profit</span>
                  <span className={styles.stakeCardAmount} style={{ color: "var(--color-teal)" }}>+${fmt(profit)}</span>
                  <span className={styles.stakeCardBook}>ROI {opp.profitPct.toFixed(2)}%</span>
                </div>
              </div>
              <p className={styles.detailWarning}>⚠ Verify odds are still live before placing — they shift fast.</p>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function MyBets({ bets, bankroll, onRemove }: { bets: TrackedBet[]; bankroll: number; onRemove: (id: string) => void }) {
  const totalProfit = bets.reduce((s, b) => s + parseFloat(calcStakes(b.outcomes, bankroll).profit), 0);

  return (
    <section className={styles.myBetsSection}>
      <div className={styles.myBetsHeader}>
        <div>
          <h2 className={styles.myBetsTitle}>My Bets</h2>
          <p className={styles.myBetsSub}>{bets.length} tracked · refreshes on next scan</p>
        </div>
        <div className={styles.myBetsTotal}>
          <span className={styles.statLabel}>Total expected profit</span>
          <span className={styles.myBetsTotalValue}>+${fmt(totalProfit)}</span>
        </div>
      </div>

      <div className={styles.myBetsList}>
        {bets.map((bet) => {
          const { legs, profit, payout } = calcStakes(bet.outcomes, bankroll);
          return (
            <div key={bet.id} className={styles.myBetCard}>
              <div className={styles.myBetCardTop}>
                <div>
                  <div className={styles.myBetMatch}>{bet.match}</div>
                  <div className={styles.myBetMeta}>
                    {bet.sport} · Added {new Date(bet.addedAt).toLocaleTimeString()} · Starts {fmtTime(bet.commenceTime)}
                  </div>
                </div>
                <div className={styles.myBetRight}>
                  <div>
                    <div className={styles.statLabel}>Profit</div>
                    <div className={styles.myBetProfit}>+${fmt(profit)} <span>({bet.profitPct.toFixed(2)}%)</span></div>
                  </div>
                  <div>
                    <div className={styles.statLabel}>Return</div>
                    <div className={styles.myBetReturn}>${fmt(payout)}</div>
                  </div>
                  <button className={styles.removeBtn} onClick={() => onRemove(bet.id)}>Remove</button>
                </div>
              </div>

              <div className={styles.myBetLegs}>
                {legs.map(leg => (
                  <div key={leg.name} className={styles.myBetLeg}>
                    <div className={styles.myBetLegBook}>{leg.bookmaker}</div>
                    <div className={styles.myBetLegOutcome}>{leg.name} <span>@ {leg.odds.toFixed(2)}</span></div>
                    <div className={styles.myBetLegStake}>${leg.stake}</div>
                    <BookLink bkKey={leg.bookmakerKey} bkTitle={leg.bookmaker} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function ArbDashboard() {
  const [opps, setOpps]             = useState<ArbOpportunity[]>([]);
  const [myBets, setMyBets]         = useState<TrackedBet[]>([]);
  const [scanning, setScanning]     = useState(false);
  const [sportLog, setSportLog]     = useState<ScanResult["sportSummary"]>([]);
  const [apiErrors, setApiErrors]   = useState<string[]>([]);
  const [expanded, setExpanded]     = useState<string | null>(null);
  const [lastScan, setLastScan]     = useState<string | null>(null);
  const [remaining, setRemaining]   = useState<number | null>(null);
  const [error, setError]           = useState<string | null>(null);
  const [nextAllowedMs, setNextAllowedMs] = useState<number | null>(null);
  const [fromCache, setFromCache]   = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const [bankroll, setBankroll]     = useState(1000);
  const [minProfit, setMinProfit]   = useState(0);
  const [sportFilter, setSportFilter] = useState("All");
  const [focusedMode, setFocusedMode] = useState(false);

  const generate = useCallback(async () => {
    if (scanning || (nextAllowedMs !== null && nextAllowedMs > 0)) return;
    setScanning(true);
    setError(null);
    setOpps([]);
    setMyBets([]);
    setExpanded(null);
    setSportLog([]);
    setApiErrors([]);

    try {
      const res  = await fetch("/api/bet-get", { cache: "no-store" });
      const data: ScanResult | { error: string } = await res.json();

      if (!res.ok || "error" in data) {
        setError("error" in data ? data.error : `Server error: ${res.status}`);
        setScanning(false);
        return;
      }

      setOpps(data.opportunities);
      setSportLog(data.sportSummary);
      setApiErrors(data.errors);
      setRemaining(data.remainingRequests);
      setFromCache(data.fromCache);
      setNextAllowedMs(data.nextAllowedMs);
      setLastScan(new Date().toLocaleTimeString());
    } catch {
      setError("Failed to reach /api/bet-get — make sure your dev server is running.");
    } finally {
      setScanning(false);
    }
  }, [scanning, nextAllowedMs]);


  const generateFootball = useCallback(async () => {
  if (scanning || (nextAllowedMs !== null && nextAllowedMs > 0)) return;
  setScanning(true);
  setError(null);
  setOpps([]);
  setMyBets([]);
  setExpanded(null);
  setSportLog([]);
  setApiErrors([]);

  try {
    const res  = await fetch("/api/bet-get-football");
    const data: ScanResult | { error: string } = await res.json();

    if (!res.ok || "error" in data) {
      setError("error" in data ? data.error : `Server error: ${res.status}`);
      setScanning(false);
      return;
    }

    setOpps(data.opportunities);
    setSportLog(data.sportSummary);
    setApiErrors(data.errors);
    setRemaining(data.remainingRequests);
    setFromCache(data.fromCache);
    setNextAllowedMs(data.nextAllowedMs);
    setLastScan(new Date().toLocaleTimeString());
  } catch {
    setError("Failed to reach /api/bet-get-football");
  } finally {
    setScanning(false);
  }
}, [scanning, nextAllowedMs]);

  const addToMyBets = (opp: ArbOpportunity) => {
    if (!myBets.find(b => b.id === opp.id))
      setMyBets(prev => [...prev, { ...opp, addedAt: new Date().toISOString() }]);
  };
  const removeMyBet = (id: string) => setMyBets(prev => prev.filter(b => b.id !== id));

  const filtered = opps
    .filter(o => !focusedMode || isFocusedArb(o))
    .filter(o => sportFilter === "All" || o.sport === sportFilter)
    .filter(o => o.profitPct >= minProfit);

  const bestPct = filtered.length ? Math.max(...filtered.map(o => o.profitPct)) : 0;
  const avgPct  = filtered.length ? filtered.reduce((s, o) => s + o.profitPct, 0) / filtered.length : 0;

  const isCoolingDown = nextAllowedMs !== null && nextAllowedMs > 0;

  function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState("");
  const [error, setError]  = useState(false);

  const attempt = () => {
    if (input === process.env.NEXT_PUBLIC_ARB_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setInput("");
    }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", minHeight:"100vh", gap:20, background:"var(--bg-primary)" }}>
      <h1 style={{ fontFamily:"var(--font-mono)", color:"var(--color-teal)",
        fontSize:"1.6rem", letterSpacing:"4px" }}>ARB⚡SCAN</h1>
      <div style={{ display:"flex", flexDirection:"column", gap:12,
        background:"var(--bg-card)", border:"1px solid var(--border-color)",
        padding:"32px 40px", borderRadius:"var(--radius-md)", minWidth:300 }}>
        <label style={{ fontFamily:"var(--font-mono)", fontSize:"0.72rem",
          color:"var(--text-secondary)", letterSpacing:"1.5px" }}>PASSWORD</label>
        <input
          type="password"
          value={input}
          onChange={e => { setInput(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && attempt()}
          autoFocus
          style={{ background:"var(--bg-primary)", border:`1px solid ${error ? "#ff4466" : "var(--border-color)"}`,
            color:"var(--color-teal)", padding:"10px 14px", fontFamily:"var(--font-mono)",
            fontSize:"0.95rem", outline:"none", borderRadius:"var(--radius-sm)" }}
        />
        {error && <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.72rem", color:"#ff4466" }}>
          Incorrect password
        </span>}
        <button onClick={attempt} style={{ marginTop:4, padding:"10px", background:"var(--color-teal)",
          color:"var(--bg-primary)", border:"none", fontFamily:"var(--font-mono)",
          fontWeight:700, fontSize:"0.82rem", letterSpacing:"1.5px", cursor:"pointer",
          borderRadius:"var(--radius-sm)" }}>
          ENTER
        </button>
      </div>
    </div>
  );
}


if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;


  return (
    <div className={styles.root}>

      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerBrand}>
          <h1 className={styles.brandTitle}>ARB<span className={styles.brandAccent}>⚡</span>SCAN</h1>
          <p className={styles.brandSub}>Arbitrage Opportunity Scanner</p>
        </div>

        <div className={styles.headerMeta}>
          {lastScan && (
            <span className={styles.lastScan}>
              {fromCache ? "📦 Cached · " : ""}Last scan: {lastScan}
            </span>
          )}
          {remaining !== null && <span className={styles.quota}>{remaining} API requests left</span>}
          {isCoolingDown && nextAllowedMs !== null && (
            <Cooldown nextAllowedMs={nextAllowedMs} onExpire={() => setNextAllowedMs(0)} />
          )}
        </div>

        <button
          className={styles.generateBtn}
          onClick={generate}
          disabled={scanning || isCoolingDown}
        >
          {scanning ? <><span className={styles.spinner} /> Scanning…</> : "⚡ Generate"}
        </button>
        <button
  className={styles.generateBtnFootball}
  onClick={generateFootball}
  disabled={scanning || isCoolingDown}
>
  {scanning ? <><span className={styles.spinner} /> Scanning…</> : "⚽ Football"}
</button>
      </header>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {/* CONTROLS */}
      <div className={styles.controls}>
        <label className={styles.controlField}>
          <span>Bankroll ($)</span>
          <input type="number" min={1} value={bankroll}
            onChange={e => setBankroll(Math.max(1, Number(e.target.value)))}
            className={styles.controlInput} />
        </label>

        <label className={styles.controlField}>
          <span>Min Profit (%)</span>
          <input type="number" min={0} step={0.1} value={minProfit}
            onChange={e => setMinProfit(Math.max(0, Number(e.target.value)))}
            className={styles.controlInput} />
        </label>

        {/* Focused Mode Toggle */}
        <div className={styles.toggleWrap}>
          <button
            className={`${styles.toggle} ${focusedMode ? styles.toggleOn : ""}`}
            onClick={() => setFocusedMode(v => !v)}
            title="Only show arbs where both legs are from your 6 core sites"
          >
            <span className={styles.toggleKnob} />
          </button>
          <div className={styles.toggleLabel}>
            <span className={focusedMode ? styles.toggleLabelOn : styles.toggleLabelOff}>
              {focusedMode ? "Focused (6 sites)" : "All sites"}
            </span>
            {focusedMode && (
              <span className={styles.toggleSites}>
                {Object.values(FOCUSED_SITE_LABELS).join(" · ")}
              </span>
            )}
          </div>
        </div>

        <div className={styles.filterTabs}>
          {SPORT_FILTERS.map(s => (
            <button key={s}
              className={`${styles.filterTab} ${sportFilter === s ? styles.filterTabActive : ""}`}
              onClick={() => setSportFilter(s)}>{s}</button>
          ))}
        </div>
      </div>

      {/* STATS BAR */}
      {opps.length > 0 && (
        <div className={styles.statsBar}>
          <StatPill label="Opportunities" value={filtered.length} />
          <StatPill label="Best profit"   value={`+${bestPct.toFixed(2)}%`} accent />
          <StatPill label="Avg profit"    value={`+${avgPct.toFixed(2)}%`} />
          <StatPill label="In My Bets"   value={myBets.length} />
          <div className={styles.sportSummary}>
            {sportLog.map(s => (
              <span key={s.sport} className={styles.sportChip}>
                {s.sport}: <strong>{s.events}</strong> events,{" "}
                <strong style={{ color: s.arbs > 0 ? "var(--color-teal)" : "inherit" }}>{s.arbs}</strong> arbs
              </span>
            ))}
            {apiErrors.map(e => <span key={e} className={styles.sportChipError}>{e}</span>)}
          </div>
        </div>
      )}

      {/* LOADING */}
      {scanning && (
        <div className={styles.loadingState}>
          <div className={styles.loadingDots}><span /><span /><span /></div>
          <p>Scanning EPL · La Liga · UCL · NBA · NFL · ATP across bookmakers…</p>
        </div>
      )}

      {/* EMPTY STATES */}
      {!scanning && opps.length === 0 && sportLog.length === 0 && !error && (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>⚡</span>
          <p className={styles.emptyTitle}>Hit Generate to scan for arbitrage opportunities</p>
          <p className={styles.emptySub}>
            Set <code>ODDS_API_KEY</code> in <code>.env.local</code> ·{" "}
            <a href="https://the-odds-api.com" target="_blank" rel="noopener noreferrer">get a free key</a>
          </p>
        </div>
      )}
      {!scanning && opps.length === 0 && sportLog.length > 0 && (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🔍</span>
          <p className={styles.emptyTitle}>No arbitrage opportunities right now</p>
          <p className={styles.emptySub}>Markets are efficient at the moment — try again shortly.</p>
        </div>
      )}

      {/* TABLE */}
      {filtered.length > 0 && (
        <div className={styles.tableWrap}>
          <p className={styles.tableHint}>{filtered.length} opportunities · expand row for full detail</p>
          <table className={styles.table}>
            <thead>
              <tr>
                {["#", "Match", "Starts", "Books / Odds / Stakes", "Profit %", "Profit $", ""].map((h, i) => (
                  <th key={i} className={styles.th} style={{ textAlign: i >= 4 ? "right" : "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((opp, idx) => (
                <OpportunityRow
                  key={opp.id} opp={opp} index={idx} bankroll={bankroll}
                  isExpanded={expanded === opp.id}
                  inMyBets={myBets.some(b => b.id === opp.id)}
                  onToggleExpand={() => setExpanded(expanded === opp.id ? null : opp.id)}
                  onToggleMyBets={() =>
                    myBets.some(b => b.id === opp.id) ? removeMyBet(opp.id) : addToMyBets(opp)
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {myBets.length > 0 && <MyBets bets={myBets} bankroll={bankroll} onRemove={removeMyBet} />}
    </div>
  );
}