import { Sparkles } from "lucide-react";
import { useAiLimit } from "@/hooks/useAiLimit";

interface Props {
  onUpgrade?: () => void;
  style?: React.CSSProperties;
}

/** Mała plakietka informująca o pozostałych darmowych użyciach AI dziś. */
export default function AiUsageBadge({ onUpgrade, style }: Props) {
  const { remaining, limit } = useAiLimit();
  const exhausted = remaining === 0;

  const text = exhausted
    ? `Wykorzystałeś dziś ${limit}/${limit} darmowych użyć AI`
    : `Pozostały Ci ${remaining}/${limit} darmowych użyć AI dziś`;

  return (
    <button
      type="button"
      onClick={exhausted ? onUpgrade : undefined}
      disabled={!exhausted}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "6px 12px",
        borderRadius: 999,
        border: exhausted ? "1px solid rgba(216,177,92,0.55)" : "1px solid rgba(139,79,209,0.25)",
        background: exhausted ? "linear-gradient(135deg, #1a0d24 0%, #3d1a6e 100%)" : "#f3eefb",
        color: exhausted ? "#d8b15c" : "#6a4a8e",
        fontSize: 11, fontWeight: 600,
        letterSpacing: "0.02em",
        cursor: exhausted ? "pointer" : "default",
        fontFamily: "inherit",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <Sparkles size={12} />
      {text}
    </button>
  );
}
