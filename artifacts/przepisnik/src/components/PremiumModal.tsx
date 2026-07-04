import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ChefHat, CalendarDays, Wand2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Opcjonalny nagłówek — np. „Wykorzystałeś dziś 3/3 darmowych użyć AI". */
  reason?: string;
}

const FEATURES = [
  { icon: Wand2,        title: "Nielimitowane AI",        desc: "Generuj przepisy bez ograniczeń dziennych." },
  { icon: CalendarDays, title: "Zaawansowany planer",     desc: "Tygodniowe plany, lista zakupów, eksport." },
  { icon: ChefHat,      title: "Inteligentne propozycje", desc: "Dopasowane dania z lodówki i Twoich ulubionych." },
];

export default function PremiumModal({ open, onClose, reason }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 400,
            background: "rgba(7,17,31,0.55)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
          }}
        >
          <motion.div
            key="sheet"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 380,
              background: "linear-gradient(180deg, #ffffff 0%, #faf6ee 100%)",
              borderRadius: 22,
              boxShadow: "0 24px 60px rgba(7,17,31,0.32), 0 0 0 1px rgba(216,177,92,0.25)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* dekoracyjny pasek */}
            <div style={{ height: 4, background: "linear-gradient(90deg, #d8b15c, #c79b3f, #d8b15c)" }} />

            <button
              onClick={onClose}
              aria-label="Zamknij"
              style={{
                position: "absolute", top: 14, right: 14,
                width: 32, height: 32, borderRadius: 999,
                border: "none", background: "rgba(7,17,31,0.06)",
                color: "#1a1a2e", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <X size={16} />
            </button>

            <div style={{ padding: "28px 24px 22px", textAlign: "center" }}>
              <div style={{
                margin: "0 auto 14px",
                width: 56, height: 56, borderRadius: 16,
                background: "linear-gradient(135deg, #1a0d24 0%, #3d1a6e 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 6px 20px rgba(7,17,31,0.25)",
              }}>
                <Sparkles size={26} color="#d8b15c" />
              </div>

              <h2 style={{
                margin: 0,
                fontFamily: "Georgia, serif",
                fontSize: 24, fontWeight: 700,
                color: "#1a1a2e",
                letterSpacing: "0.02em",
              }}>
                Premium wkrótce
              </h2>
              <p style={{
                margin: "8px 0 0",
                fontSize: 13, lineHeight: 1.55,
                color: "#6b6070",
                maxWidth: 300, marginInline: "auto",
              }}>
                {reason || "Wykorzystałeś już dziś darmowe użycia AI."}
                <br />
                Pełna wersja będzie dostępna już niedługo.
              </p>
            </div>

            <div style={{ padding: "0 22px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 12,
                      padding: "12px 14px",
                      borderRadius: 14,
                      background: "#fff",
                      border: "1px solid #efe7d6",
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: "#fbf3df", color: "#9a7726",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={18} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{f.title}</div>
                      <div style={{ fontSize: 12, color: "#6b6070", lineHeight: 1.5, marginTop: 2 }}>{f.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: "0 22px 24px", display: "flex", gap: 10 }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "13px 0",
                  borderRadius: 12,
                  border: "1px solid #e3dcc9",
                  background: "#fff",
                  color: "#5b4d6b",
                  fontSize: 14, fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Może później
              </button>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "13px 0",
                  borderRadius: 12,
                  border: "1px solid transparent",
                  background: "linear-gradient(135deg, #1a0d24 0%, #3d1a6e 100%)",
                  color: "#d8b15c",
                  fontSize: 14, fontWeight: 600,
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 6px 18px rgba(26,13,36,0.35)",
                }}
              >
                Powiadom mnie
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
