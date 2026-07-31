type SectionHeaderProps = {
  eyebrow: string;
  title: string;
};

export default function SectionHeader({ eyebrow, title }: SectionHeaderProps) {
  return (
    <div className="mb-10 text-center">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-nlsc-muted">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-bold tracking-tight text-nlsc-text sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}
