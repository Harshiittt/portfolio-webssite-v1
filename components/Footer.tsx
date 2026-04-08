export default function Footer() {
  return (
    <footer className="text-center py-8 border-t border-[#1e2535]">
      <p className="font-mono text-xs text-[#4a5568]">
        Designed &amp; built by{" "}
        <span className="text-[#64ffda]">Harshit</span> · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
