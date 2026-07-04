import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface OnboardingHintProps {
  id: string;
  text: string;
  icon?: ReactNode;
  marginBottom?: number;
}

const STORAGE_PREFIX = "pp-hint-dismissed:";

export default function OnboardingHint({ id, text, icon, marginBottom = 14 }: OnboardingHintProps) {
  const storageKey = `${STORAGE_PREFIX}${id}`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(storageKey);
      if (!dismissed) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, [storageKey]);

  function dismiss() {
    try { localStorage.setItem(storageKey, "1"); } catch { /* ignore quota */ }
    setVisible(false);
  }

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          key={id}
          initial={{ opacity: 0, y: -6, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -4, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            background: "linear-gradient(135deg, #faf5ff 0%, #f4ebfa 100%)",
            border: "1px solid #e6d8f0",
            borderRadius: 14,
            color: "#4a3a66",
            fontSize: 13,
            lineHeight: 1.4,
            boxShadow: "0 1px 3px rgba(139,79,209,0.06)",
            marginBottom,
            overflow: "hidden",
          }}
          role="note"
        >
          <div style={{
            width: 32, height: 32, flexShrink: 0,
            borderRadius: 10,
            background: "#fff",
            border: "1px solid #e6d8f0",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#8b4fd1",
            fontSize: 16,
          }}>
            {icon ?? "💡"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>{text}</div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Zamknij wskazówkę"
            onMouseEnter={(e) => { e.currentTarget.style.background = "#ebdcf5"; e.currentTarget.style.color = "#5a3a8e"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9a8aae"; }}
            onFocus={(e)      => { e.currentTarget.style.background = "#ebdcf5"; e.currentTarget.style.color = "#5a3a8e"; }}
            onBlur={(e)       => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9a8aae"; }}
            style={{
              flexShrink: 0,
              width: 28, height: 28, borderRadius: 8,
              background: "transparent", border: "none", cursor: "pointer",
              color: "#9a8aae",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.18s",
              padding: 0,
            }}
          >
            <X size={14} strokeWidth={2.2} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
