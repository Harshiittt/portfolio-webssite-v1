interface SectionTitleProps {
  num: string;
  title: string;
}

export default function SectionTitle({ num, title }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-3 mb-10">
      <span className="font-mono text-[#64ffda] text-sm">{num}.</span>
      <h3 className="text-2xl font-medium text-[#ccd6f6] whitespace-nowrap">{title}</h3>
      <div className="flex-1 h-px bg-[#1e2535]" />
    </div>
  );
}
