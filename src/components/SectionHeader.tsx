type SectionHeaderProps = {
  eyebrow: string;
  title: string;
};

export default function SectionHeader({ eyebrow, title }: SectionHeaderProps) {
  return (
    <div className="mb-12 text-center">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-nlsc-gold-text">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-semibold tracking-tight text-nlsc-text sm:text-3xl">
        {title}
      </h2>
      <div className="mx-auto mt-5 h-px w-10 bg-nlsc-gold/50" />
    </div>
  );
}
