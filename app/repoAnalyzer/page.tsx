import type { Metadata } from "next";
import Navbar from "@/components/PortfolioSections/Navbar";
import RepoAnalyzerPage from "@/components/RepoAnalyzer/RepoAnalyzer";

export const metadata: Metadata = {
  title: "Repo Analyzer by Harshit Anand",
  description: "Analyze GitHub repositories with AI-powered insights.",
};

export default function RepoAnalyzer() {
  return (
    <>
      <Navbar />
      <RepoAnalyzerPage />
    </>
  );
}
