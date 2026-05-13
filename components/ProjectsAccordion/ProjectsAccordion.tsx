"use client";

import { useRef } from "react";
import Link from "next/link";
import styles from "./ProjectsAccordion.module.css";
import SectionTitle from "../PortfolioSections/SectionTitle";

const projects = [
  { title: "AI Repo Analyzer", subtitle: "GitHub → structured insights", tech: ["Next.js", "Groq", "GitHub API"], color: "#64ffda", media: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80", href: "/repoAnalyzer" },
  { title: "Product Spider", subtitle: "AI e-commerce aggregator", tech: ["Next.js", "Groq", "Serper API"], color: "#f7c948", media: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80", href: "/productSpider" },
  { title: "Arb⚡SCAN", subtitle: "Real-time arbitrage scanner with AuthGate", tech: ["WebSockets", "Next.js", "REST APIs"], color: "#ff6b6b", media: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80", href: "/arbScanner" },
  { title: "TCS x Kenvue", subtitle: "Enterprise mobile frontend solutions", tech: ["React Native", "Expo", "Zustand"], color: "#a78bfa", media: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80", href: "/projects" },
  { title: "Learnerula", subtitle: "Language literacy and spread tool", tech: ["React Native", "JavaScript"], color: "#fb7185", media: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80", href: "/projects" },
];

export default function ProjectsAccordion() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragDistance = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragDistance.current = 0;
    startX.current = e.pageX;
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
    if (scrollRef.current) scrollRef.current.style.cursor = "grabbing";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const dx = e.pageX - startX.current;
    dragDistance.current = Math.abs(dx);
    scrollRef.current.scrollLeft = scrollLeft.current - dx;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  const handleCardClick = (e: React.MouseEvent, href: string) => {
    // block navigation if user was dragging
    if (dragDistance.current > 5) {
      e.preventDefault();
    }
  };

  return (
    <section id="projects" className={styles.section}>
      <SectionTitle num="03" title="Things I've built" />

      <p className={styles.hint}>← drag to explore →</p>

      <div
        ref={scrollRef}
        className={styles.scrollContainer}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div className={styles.track}>
          {projects.map((p, i) => (
            <Link
              key={p.title}
              href={p.href}
              className={styles.card}
              onClick={(e) => handleCardClick(e, p.href)}
              draggable={false}
              style={{
                "--card-color": p.color,
                "--card-media": `url(${p.media})`,
              } as React.CSSProperties}
            >
              {/* use div instead of img to avoid ban cursor on drag */}
              <div className={styles.image} />
              <div className={styles.overlay} />
              <div className={styles.accentBar} />
              <span className={styles.number}>0{i + 1}.</span>

              <div className={styles.content}>
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.subtitle}>{p.subtitle}</p>
                <div className={styles.techList}>
                  {p.tech.map((t) => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                </div>
                <span className={styles.cta}>
                  View project →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.viewAll}>
        <Link href="/projects" className={styles.viewAllBtn}>
          View all projects →
        </Link>
      </div>
    </section>
  );
}