"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Hobbies.module.css";

interface Hobby {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}

const hobbies: Hobby[] = [
  {
    title: "Football",
    subtitle: "passion for the game",
    description:
      "A player and fan— from watching top clubs like Manchester United to playing casually with friends. I love the strategy, teamwork, and raw intensity the sport brings. Whether it's a Champions League final or a Sunday kickabout, it's more than a game — it's a mindset.",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 0 1 6.32 2.27L12 8.5 5.68 4.27A10 10 0 0 1 12 2z" />
        <path d="M2.05 12h6.45l3.5-5.5M22 12h-6.45l-3.5-5.5M8.5 21.27l3.5-5.5 3.5 5.5" />
      </svg>
    ),
  },
  {
    title: "Aviation",
    subtitle: "curiosity for the skies",
    description:
      "Fascinated by aircraft systems, flight mechanics, and airport operations. I love watching planespotting videos, reading about different airframes, and understanding how commercial aviation operates at massive scale. Engineering at its finest.",
    image:
      "https://images.unsplash.com/photo-1720518989092-1d07b068c1de?w=400&q=80",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2l-1 1.2L11 10l-2 4-2-.5L6 15l3 1.5 1.5 3 1.5-.5-.5-2 4-2 3.8 7.2 1.2-1z" />
      </svg>
    ),
  },
  {
    title: "Automobiles",
    subtitle: "speed & engineering",
    description:
      "Love anything that involves speed and technology. From the roar of a supercar to the precision of an F1 machine — every vehicle tells a story about human ingenuity. I enjoy a rides on a motorcycle too!",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h10l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
        <path d="M5 9h14" />
      </svg>
    ),
  },
  {
    title: "Scale Models",
    subtitle: "mini machines, big nostalgia",
    description:
      "Collecting and appreciating Hot Wheels is a mix of nostalgia and pure design obsession. Tiny replicas, but huge attention to detail and creativity in every model. It started as a childhood thing and never really stopped — and I'm perfectly fine with that.",
    image:
      "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="10" rx="2" />
        <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
        <circle cx="7" cy="17" r="1" />
        <circle cx="17" cy="17" r="1" />
      </svg>
    ),
  },
];

export default function Hobbies() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          ← back to portfolio
        </Link>

        <div className={styles.header}>
          <p className={styles.eyebrow}>// beyond the code</p>
          <h1 className={styles.title}>What I'm into</h1>
          <p className={styles.subtitle}>
            A few things I'm genuinely passionate about outside of work. Click
            any card to expand.
          </p>
        </div>

        <div className={styles.list}>
          {hobbies.map((hobby, index) => {
            const isOpen = expanded === index;
            return (
              <motion.div
                key={hobby.title}
                layout
                className={`${styles.card} ${isOpen ? styles.open : ""}`}
                onClick={() => setExpanded(isOpen ? null : index)}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardLeft}>
                    <div className={styles.iconWrap}>{hobby.icon}</div>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardTitle}>{hobby.title}</span>
                      <span className={styles.cardSubtitle}>{hobby.subtitle}</span>
                    </div>
                  </div>
                  <svg
                    className={`${styles.chevron} ${isOpen ? styles.rotated : ""}`}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className={styles.cardBody}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className={styles.cardBodyInner}>
                        <Image
                          src={hobby.image}
                          alt={hobby.title}
                          width={260}
                          height={160}
                          className={styles.cardImage}
                          unoptimized
                        />
                        <p className={styles.cardDescription}>
                          {hobby.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
