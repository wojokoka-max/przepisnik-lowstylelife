import { useLocation } from "wouter";
import { motion } from "framer-motion";

export const ADD_RECIPE_EVENT = "open-add-recipe-modal";

export default function SiteHeader() {
  const [location] = useLocation();
  const showAdd = location === "/" || location === "";

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 210,
      background: "#07111f",
      borderBottom: "1px solid rgba(139,79,209,0.14)",
      boxShadow: "0 2px 14px rgba(7,17,31,0.40)",
      height: 56,
    }}>
      <div style={{
        maxWidth: "860px", margin: "0 auto", padding: "0 18px",
        height: "100%", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: "14px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "11px", minWidth: 0 }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "9px", flexShrink: 0,
            background: "linear-gradient(135deg, #3d1a6e 0%, #1a0d24 100%)",
            border: "1px solid rgba(216,177,92,0.28)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 700, color: "#d8b15c",
            fontFamily: "Georgia, serif", letterSpacing: "0.05em",
          }}>
            LSL
          </div>
          <div style={{
            fontSize: "17px", fontWeight: 600, color: "#f0e9d6",
            lineHeight: 1.1, overflow: "hidden", textOverflow: "ellipsis",
            whiteSpace: "nowrap", fontFamily: "Georgia, serif",
            letterSpacing: "0.005em",
            minWidth: 0,
          }}>
            Przepiśnik
          </div>
        </div>

        {showAdd && (
          <motion.button
            whileTap={{ scale: 0.94 }}
            whileHover={{
              y: -1,
              background: "#7a3fc2",
              boxShadow: "0 4px 16px rgba(139,79,209,0.55)",
            }}
            onClick={() => window.dispatchEvent(new CustomEvent(ADD_RECIPE_EVENT))}
            transition={{ duration: 0.18 }}
            style={{
              background: "#8b4fd1",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "8px 15px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              flexShrink: 0,
              boxShadow: "0 2px 10px rgba(139,79,209,0.4)",
              letterSpacing: "0.01em",
            }}
          >
            + Dodaj
          </motion.button>
        )}
      </div>
    </header>
  );
}
