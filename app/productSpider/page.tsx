import type { Metadata } from "next";
import Navbar from "@/components/PortfolioSections/Navbar";
import ProductSpiderPage from "@/components/ProductSpider/ProductSpider";

export const metadata: Metadata = {
  title: "Repo Analyzer by Harshit Anand",
  description:
    "Analyze and find products from the web with this custom-built product spider.",
};

export default function ProductSpider() {
  return (
    <>
      <Navbar />
      <ProductSpiderPage />
    </>
  );
}
