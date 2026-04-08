import SectionTitle from "./SectionTitle";

export default function Contact() {
  return (
    <section id="contact" className="py-20">
      <SectionTitle num="04" title="Get in touch" />

      <div className="text-center max-w-lg mx-auto">
        <p className="text-[#8892b0] text-sm font-mono mb-2 tracking-widest">
          What's next?
        </p>
        <h3 className="text-4xl font-medium text-[#ccd6f6] mb-6">
          Say Hello!
        </h3>
        <p className="text-[#8892b0] text-[15px] leading-relaxed mb-10">
          I'm currently open to new opportunities. Whether you have a question,
          a project idea, or just want to say hi — my inbox is always open and
          I'll do my best to get back!
        </p>

        <a
          href="mailto:anitagibbssuits@gmail.com"
          className="inline-block font-mono text-sm text-[#64ffda] border border-[#64ffda] rounded px-8 py-4 hover:bg-[#64ffda]/10 transition-colors mb-12"
        >
          Say Hello →
        </a>

        <div className="flex justify-center gap-6">
          {[
            { label: "github", href: "https://github.com" },
            { label: "linkedin", href: "https://linkedin.com" },
            { label: "email", href: "mailto:anitagibbssuits@gmail.com" },
            { label: "resume", href: "/resume.pdf" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="font-mono text-xs text-[#8892b0] border border-[#1e2535] rounded px-4 py-2 hover:text-[#64ffda] hover:border-[#64ffda] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
