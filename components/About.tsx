import SectionTitle from "./SectionTitle";

const techList = [
  "React Native (Expo)",
  "Next.js",
  "TypeScript",
  "React.js",
  "Zustand",
  "Mapbox GL",
];

export default function About() {
  return (
    <section id="about" className="py-20">
      <SectionTitle num="01" title="About me" />

      <div className="grid md:grid-cols-[3fr_2fr] gap-12 items-start">
        <div className="space-y-4 text-[#8892b0] text-[15px] leading-relaxed">
          <p>
            Hey! I'm Harshit, a frontend-focused software engineer based in{" "}
            <span className="text-[#64ffda]">Bengaluru, India</span>. I
            graduated from SRM Institute of Science and Technology with a degree
            in Computer Science Engineering.
          </p>
          <p>
            Currently at{" "}
            <span className="text-[#64ffda]">Tata Consultancy Services</span>,
            I work across multiple client projects — including Kenvue CE
            Platform, Skin360, and Smartcheck — building scalable, polished
            user interfaces.
          </p>
          <p>
            I love the intersection of design and engineering — making things
            look great and work even better. When I'm not at work, I'm tinkering
            on side projects like my road trip discovery app.
          </p>

          <div className="pt-2">
            <p className="mb-3">Technologies I've been working with recently:</p>
            <ul className="grid grid-cols-2 gap-y-1 gap-x-4">
              {techList.map((tech) => (
                <li
                  key={tech}
                  className="font-mono text-xs text-[#8892b0] flex items-center gap-2"
                >
                  <span className="text-[#64ffda]">▹</span> {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-center md:justify-start">
          <div className="relative group">
            <div className="w-[200px] h-[200px] rounded-lg bg-[#112240] border-2 border-[#64ffda] flex items-center justify-center text-[#64ffda] font-mono text-6xl font-medium select-none">
              H
            </div>
            <div className="absolute inset-0 rounded-lg border-2 border-[#64ffda] translate-x-3 translate-y-3 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  );
}
