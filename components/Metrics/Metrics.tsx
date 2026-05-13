"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Metrics.module.css";
import SectionTitle from "../PortfolioSections/SectionTitle";

const metrics = [
  { label: "Production Screens", value: 10, suffix: "+", desc: "shipped at TCS" },
  { label: "Users Impacted", value: 50, suffix: "K+", desc: "across platforms" },
  { label: "APIs Integrated", value: 5, suffix: "+", desc: "with retry logic" },
  { label: "Sprint Completion", value: 95, suffix: "%", desc: "sustained rate" },
  { label: "Bug Reopen Rate", value: 40, suffix: "% ↓", desc: "reduced at TCS" },
  { label: "Years Experience", value: 2, suffix: "+", desc: "at TCS, Bengaluru" },
];

function OdometerDigit({ digit, delay = 0 }: { digit: string; delay?: number }) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          const target = parseInt(digit) || 0;
          if (target === 0) { setDisplayed(0); return; }
          const intervalTime = Math.max(16, 1200 / target);
          let current = 0;
          const timer = setInterval(() => {
            current++;
            setDisplayed(current);
            if (current >= target) clearInterval(timer);
          }, intervalTime);
        }, delay);
        observer.disconnect();
      }
    }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [digit, delay]);

  return <span ref={ref} className={styles.digit}>{displayed}</span>;
}

function OdometerNumber({ value, suffix, delay }: { value: number; suffix: string; delay: number }) {
  return (
    <span className={styles.value}>
      {String(value).split("").map((d, i) => (
        <OdometerDigit key={i} digit={d} delay={delay + i * 80} />
      ))}
      <span className={styles.suffix}>{suffix}</span>
    </span>
  );
}

export default function Metrics() {
  return (
    <section className={styles.section}>
      <SectionTitle num="02" title="Impact at a glance" />
      <div className={styles.grid}>
        {metrics.map((m, i) => (
          <div key={m.label} className={styles.card}>
            <div className={styles.accentBar} />
            <OdometerNumber value={m.value} suffix={m.suffix} delay={i * 150} />
            <p className={styles.label}>{m.label}</p>
            <p className={styles.desc}>{m.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}