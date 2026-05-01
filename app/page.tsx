import Navbar from "@/components/PortfolioSections/Navbar";
import Hero from "@/components/PortfolioSections/Hero";
import About from "@/components/PortfolioSections/About";
import Projects from "@/components/PortfolioSections/Projects";
import Skills from "@/components/PortfolioSections/Skills";
import Contact from "@/components/PortfolioSections/Contact";
import Footer from "@/components/PortfolioSections/Footer";
import HobbiesSection from "@/components/PortfolioSections/Hobbies";

export default function Home() {
  return (
    <main className="bg-[#0d0f14] min-h-screen">
      <Navbar />
      <div className="max-w-[860px] mx-auto px-6 md:px-12">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <HobbiesSection />
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
