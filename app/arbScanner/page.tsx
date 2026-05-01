import type { Metadata } from "next";
import Navbar from "@/components/PortfolioSections/Navbar";
import ArbDashboard from "@/components/ArbDashboard/ArbDashboard";

export const metadata: Metadata = {
  title: "Arbitrage Scanner | Harshit Anand",
  description:
    "Side project: A tool that scans multiple bookmakers for arbitrage opportunities in sports betting.",
};

export default function ArbScannerPage() {
  return (
    <>
      <Navbar />
      <ArbDashboard />
    </>
  );
}
