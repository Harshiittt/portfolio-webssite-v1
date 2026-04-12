import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ProductSpiderPage from "@/components/ProductSpider/ProductSpider";

export const metadata: Metadata = {
  title: "Repo Analyzer by Harshit Anand",
  description: "Analyze GitHub repositories with AI-powered insights.",
};

export default function ProductSpider() {
  return (
    <>
      <Navbar />
      <ProductSpiderPage/>
    </>
  );
}
