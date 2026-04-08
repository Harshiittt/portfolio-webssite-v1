import SectionTitle from "./SectionTitle";

interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
}

const projects: Project[] = [
  {
    title: "Skin360",
    description:
      "A skincare platform built for Kenvue enabling users to analyze skin health, discover personalized routines, and track progress over time with a seamless mobile experience.",
    tech: ["React Native", "Expo", "TypeScript", "Zustand"],
    github: "https://github.com",
  },
  {
    title: "Smartcheck",
    description:
      "An intelligent checklist and compliance tool for enterprise clients, streamlining QA workflows and surfacing actionable insights in real time.",
    tech: ["React.js", "Next.js", "TypeScript", "Context API"],
    github: "https://github.com",
    live: "https://example.com",
  },
  {
    title: "Kenvue CE Platform",
    description:
      "Consumer engagement platform for Kenvue — a multi-brand frontend solution handling user authentication, product discovery, and campaign management at scale.",
    tech: ["React.js", "TypeScript", "Next.js", "REST APIs"],
    github: "https://github.com",
  },
  {
    title: "RoadTrip",
    description:
      "A side project — a road trip discovery app that surfaces tourist attractions along a driving route using Mapbox and location-aware search. Built with Expo for iOS and Android.",
    tech: ["React Native", "Expo", "Mapbox", "TypeScript"],
    github: "https://github.com",
  },
];

function FolderIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#64ffda"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-20">
      <SectionTitle num="02" title="Things I've built" />

      <div className="grid sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.title}
            className="bg-[#112240] border border-[#1e2535] rounded-lg p-6 flex flex-col gap-4 hover:-translate-y-1 hover:border-[#64ffda]/30 transition-all duration-200 group"
          >
            <div className="flex justify-between items-start">
              <FolderIcon />
              <div className="flex gap-3 text-[#8892b0]">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#64ffda] transition-colors"
                  >
                    <GitHubIcon />
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#64ffda] transition-colors"
                  >
                    <ExternalIcon />
                  </a>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h4 className="text-[#ccd6f6] font-medium text-base mb-2 group-hover:text-[#64ffda] transition-colors">
                {project.title}
              </h4>
              <p className="text-[#8892b0] text-sm leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[11px] text-[#64ffda] bg-[#64ffda]/10 px-2 py-1 rounded"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
