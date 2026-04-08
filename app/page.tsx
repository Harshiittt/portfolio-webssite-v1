import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-[#0d0f14] min-h-screen">
      <Navbar />
      <div className="max-w-[860px] mx-auto px-6 md:px-12">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
