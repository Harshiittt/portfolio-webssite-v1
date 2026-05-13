import type { Metadata } from "next";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import Navbar from "@/components/PortfolioSections/Navbar";
import { allProjects } from "@/lib/project/project";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Projects | Harshit Anand",
  description: "Things Harshit has built — AI tools, mobile apps, and enterprise platforms.",
};

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Link href="/" className={styles.backLink}>
          ← back to portfolio
        </Link>
        <div className={styles.pageHeader}>
          <p className={styles.sectionNum}>02.</p>
          <h1 className={styles.pageTitle}>Things I've built</h1>
          <p className={styles.pageSubtitle}>A mix of client work at TCS and personal side projects — hover each card to explore.</p>
        </div>
        <div className={styles.grid}>
          {allProjects.map((project, i) => <ProjectCard key={project.id} project={project} index={i} />)}
        </div>
      </main>
    </>
  );
}
