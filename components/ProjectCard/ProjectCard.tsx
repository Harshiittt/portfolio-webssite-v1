"use client";

import Link from "next/link";
import styles from "./ProjectCard.module.css";

export interface ProjectData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  href: string;
  color: string;
  media: string;
}

export default function ProjectCard({ project, index }: { project: ProjectData; index: number }) {
  const isEven = index % 2 === 0;
  return (
    <Link
      href={project.href}
      className={`${styles.card} ${isEven ? styles.even : styles.odd}`}
      style={{
        "--project-color": project.color,
        "--project-color-hover": project.color + "66",
        "--project-media": `url(${project.media})`,
        "--image-overlay": `linear-gradient(135deg, ${project.color}22, #0d192988)`,
        "--tag-bg": project.color + "15",
      } as React.CSSProperties}
    >
      <div className={styles.image}>
        <div className={styles.imageOverlay} />
      </div>

      <div className={styles.text}>
        <p className={styles.subtitle}>{project.subtitle}</p>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>
        <div className={styles.techList}>
          {project.tech.map((t) => (
            <span key={t} className={styles.techTag}>{t}</span>
          ))}
        </div>
      </div>

      <div className={styles.hoverOverlay}>
        <h3 className={styles.hoverTitle}>{project.title}</h3>
        <p className={styles.hoverCta}>View project →</p>
      </div>

      <div className={styles.accentBar} />
    </Link>
  );
}
