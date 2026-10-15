type ProfileInsightProps = {
  text: string;
};

export function ProfileInsight({ text }: ProfileInsightProps) {
  return (
    <p className="max-w-[22rem] rounded-xl bg-white/95 px-4 py-3 text-sm font-medium leading-snug text-slate-700 shadow-[0_12px_36px_rgba(30,41,59,0.11)]">
      {text}
    </p>
  );
}
