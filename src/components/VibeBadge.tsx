export const VIBE_OPTIONS = [
  { emoji: "😎", label: "Vibin’" },
  { emoji: "🥳", label: "Lit" },
  { emoji: "😡", label: "Mad AF" },
  { emoji: "😢", label: "Lowkey Down" },
  { emoji: "🤡", label: "Clownin’" },
  { emoji: "🚀", label: "Amped" },
  { emoji: "😴", label: "Dead" },
  { emoji: "🤔", label: "Bruh / What?!" },
  { emoji: "🫨", label: "High up there" },
];

interface VibeBadgeProps {
  vibeType?: string | null;
  className?: string;
}

const VibeBadge = ({ vibeType, className = "" }: VibeBadgeProps) => {
  const vibe = VIBE_OPTIONS.find((option) => option.label === vibeType);

  return (
    <span
      className={`inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 ${className}`}
    >
      {vibe ? `${vibe.emoji} ${vibe.label}` : "Unspecified"}
    </span>
  );
};

export default VibeBadge;
