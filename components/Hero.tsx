export default function Hero() {
  return (
    <section className="flex flex-col justify-center min-h-[90vh] py-20">
      <p className="font-mono text-[#64ffda] text-sm mb-4">Hi, my name is</p>

      <h1 className="text-5xl md:text-7xl font-medium text-[#ccd6f6] leading-tight">
        Harshit.
      </h1>

      <h2 className="text-3xl md:text-5xl font-medium text-[#8892b0] mt-2 mb-6">
        I build things for the web &amp; mobile.
        <span className="blink text-[#64ffda]">_</span>
      </h2>

      <p className="text-[#8892b0] text-base leading-relaxed max-w-[520px] mb-10">
        I'm a software engineer at{" "}
        <span className="text-[#64ffda]">Tata Consultancy Services</span>{" "}
        specializing in frontend development — crafting high-quality, performant
        experiences with React Native, Next.js, and TypeScript.
      </p>

      <div className="flex gap-4">
        <a
          href="#projects"
          className="font-mono text-sm text-[#64ffda] border border-[#64ffda] rounded px-6 py-3 hover:bg-[#64ffda]/10 transition-colors"
        >
          Check out my work →
        </a>
        <a
          href="#contact"
          className="font-mono text-sm text-[#8892b0] border border-[#1e2535] rounded px-6 py-3 hover:border-[#64ffda] hover:text-[#64ffda] transition-colors"
        >
          Get in touch
        </a>
      </div>
    </section>
  );
}
