"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "about", href: "/#about" },
  { label: "projects", href: "/#projects" },
  { label: "skills", href: "/#skills" },
  { label: "hobbies", href: "/hobbies" },
  { label: "analyzer", href: "/repoAnalyzer" },
  { label: "contact", href: "/#contact" },
  { label: "Product Spider", href: "/productSpider" },
  { label: "Arb⚡SCAN", href: "/arbScanner" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 transition-all duration-300 ${
          scrolled
            ? "bg-[#0d0f14]/95 backdrop-blur border-b border-[#1e2535]"
            : "bg-transparent"
        }`}
      >
        <Link
          href="/"
          className="font-mono text-[#64ffda] text-sm font-medium tracking-widest"
        >
          harshitanand.in
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-xs text-[#8892b0] hover:text-[#64ffda] transition-colors"
            >
              <span className="text-[#64ffda]">0{i + 1}. </span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Hamburger button — mobile only */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden flex flex-col gap-[5px] p-2 z-50"
          aria-label="Open menu"
        >
          <span className="block w-6 h-[2px] bg-[#64ffda]" />
          <span className="block w-6 h-[2px] bg-[#64ffda]" />
          <span className="block w-4 h-[2px] bg-[#64ffda]" />
        </button>
      </nav>

      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 max-w-[300px] z-50 bg-[#0d0f14] border-l border-[#1e2535] flex flex-col px-8 py-10 transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setMenuOpen(false)}
          className="self-end text-[#8892b0] hover:text-[#64ffda] transition-colors mb-10"
          aria-label="Close menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Links */}
        <div className="flex flex-col gap-6">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-mono text-sm text-[#8892b0] hover:text-[#64ffda] transition-colors"
            >
              <span className="text-[#64ffda] text-xs">0{i + 1}. </span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}