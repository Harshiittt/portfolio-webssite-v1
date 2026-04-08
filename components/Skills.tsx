import SectionTitle from "./SectionTitle";

const skillGroups = [
  {
    category: "// languages",
    skills: ["TypeScript", "JavaScript (ES6+)", "Python", "SQL", "C++"],
  },
  {
    category: "// frameworks",
    skills: ["React Native (Expo)", "React.js", "Next.js", "Flutter"],
  },
  {
    category: "// state & apis",
    skills: ["Zustand", "Context API", "REST APIs", "Axios", "SSR"],
  },
  {
    category: "// tools & platforms",
    skills: ["Git", "GitHub", "Jira", "Xcode", "Android Studio", "Vercel", "CI/CD"],
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
