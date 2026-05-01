import type { Metadata } from "next";
import Navbar from "@/components/PortfolioSections/Navbar";
import Hobbies from "@/components/Hobbies/Hobbies";

export const metadata: Metadata = {
  title: "Hobbies | Harshit Anand",
  description: "Things Harshit is passionate about beyond code.",
};

export default function HobbiesPage() {
  return (
    <>
      <Navbar />
      <Hobbies />
    </>
  );
}
