import SectionTitle from "./SectionTitle";

const skillGroups = [
  {
    category: "// frontend",
    skills: ["React.js", "Next.js", "React Native", "TypeScript", "JavaScript", "HTML & CSS"],
  },
  {
    category: "// state & tools",
    skills: ["Zustand", "Context API", "Expo", "Mapbox GL", "Git", "VS Code"],
  },
  {
    category: "// platforms",
    skills: ["Vercel", "GitHub", "iOS", "Android", "Web"],
  },
  {
    category: "// currently learning",
    skills: ["Node.js", "PostgreSQL", "Docker", "AWS"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-20">
      <SectionTitle num="03" title="Skills & tools" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {skillGroups.map((group) => (
          <div
            key={group.category}
            className="bg-[#112240] border border-[#1e2535] rounded-lg p-5 hover:border-[#64ffda]/30 transition-colors"
          >
            <h4 className="font-mono text-xs text-[#64ffda] mb-4">
              {group.category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs text-[#8892b0] bg-[#0d0f14] px-2.5 py-1 rounded border border-[#1e2535]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
