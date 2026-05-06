interface SectionLabelProps {
  children: React.ReactNode;
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <span className="font-grotesk text-xs font-bold tracking-[0.18em] uppercase text-secondary block mb-3">
      {children}
    </span>
  );
}
