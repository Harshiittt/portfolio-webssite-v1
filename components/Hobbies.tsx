import Link from "next/link";
import SectionTitle from "./SectionTitle";

export default function HobbiesSection() {
  return (
    <section id="contact" className="py-20">
      <SectionTitle num="04" title="Hobbies" />

      <div className="text-center max-w-lg mx-auto">
          <Link
  href="/hobbies"
  className="
    relative inline-flex items-center justify-center
    px-8 py-3
    font-mono text-lg
    text-[#64ffda]
    border border-[#64ffda]/40
    rounded-xl
    overflow-hidden
    transition-all duration-300
    hover:text-black
    hover:bg-[#64ffda]
    hover:shadow-[0_0_25px_#64ffda]

    active:scale-95
  "
>
  <span className="relative z-10">Go to My Hobbies</span>

  {/* subtle animated background */}
  <span className="
    absolute inset-0
    bg-[#64ffda]
    opacity-0
    transition-opacity duration-300
    hover:opacity-100
  " />
</Link>
      </div>
    </section>
  );
}
