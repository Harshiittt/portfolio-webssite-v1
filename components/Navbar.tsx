"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "about", href: "#about" },
  { label: "projects", href: "#projects" },
  { label: "skills", href: "#skills" },
  { label: "contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 transition-all duration-300 ${
        scrolled
          ? "bg-[#0d0f14]/95 backdrop-blur border-b border-[#1e2535]"
          : "bg-transparent"
      }`}
    >
      <a
        href="/"
        className="font-mono text-[#64ffda] text-sm font-medium tracking-widest"
      >
        harshit.dev
      </a>

      <div className="flex items-center gap-6">
        {navLinks.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            className="font-mono text-xs text-[#8892b0] hover:text-[#64ffda] transition-colors"
          >
            <span className="text-[#64ffda]">0{i + 1}. </span>
            {link.label}
          </a>
        ))}
        <a
          href="/resume.pdf"
          target="_blank"
          className="font-mono text-xs text-[#64ffda] border border-[#64ffda] rounded px-4 py-2 hover:bg-[#64ffda]/10 transition-colors"
        >
          resume
        </a>
      </div>
    </nav>
  );
}
