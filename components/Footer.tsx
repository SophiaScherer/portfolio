export default function Footer() {
  return (
    <footer className="bg-footer-bg border-t border-footer-border py-10 px-[clamp(20px,5vw,80px)] transition-colors">
      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-between items-center gap-4">
        <a
          href="#about"
          className="font-epilogue font-black italic text-base text-primary no-underline tracking-tight transition-colors"
        >
          Sophia Scherer
        </a>
        <span className="text-xs text-text-muted tracking-widest uppercase transition-colors">
          © 2026 Built with Precision.
        </span>
        <div className="flex gap-6">
          <a
            href="#"
            className="font-grotesk text-xs font-bold tracking-widest uppercase text-text-muted no-underline transition-colors hover:text-primary"
          >
            GitHub
          </a>
          <a
            href="#"
            className="font-grotesk text-xs font-bold tracking-widest uppercase text-text-muted no-underline transition-colors hover:text-primary"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
