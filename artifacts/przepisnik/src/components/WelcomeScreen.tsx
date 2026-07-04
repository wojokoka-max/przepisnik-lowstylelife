import { motion } from "framer-motion";
import logoLsl from "../assets/logo-lsl.png";

interface Props {
  onEnter: () => void;
}

const BG = "linear-gradient(180deg, #07111f 0%, #12081f 28%, #1a0d24 62%, #241119 100%)";

export default function WelcomeScreen({ onEnter }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed", inset: 0,
        background: BG,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
        padding: "56px 24px 40px",
        boxSizing: "border-box",
      }}
    >
      {/* Top: brand mark */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <img
          src={logoLsl}
          alt="LowStyleLife"
          style={{
            width: 96, height: 96,
            objectFit: "contain",
            filter: "drop-shadow(0 6px 24px rgba(216,177,92,0.25))",
          }}
        />
      </div>

      {/* Middle: title + tagline */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: 380, width: "100%" }}>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{
            margin: 0,
            color: "#d8b15c",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 700,
            fontSize: "clamp(40px, 9vw, 60px)",
            lineHeight: 1.1,
            letterSpacing: "0.06em",
          }}
        >
          Przepiśnik
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{
            marginTop: 14,
            fontSize: "clamp(13px, 3.5vw, 16px)",
            fontWeight: 400,
            letterSpacing: "0.32em",
            color: "#d8b15c",
            opacity: 0.85,
          }}
        >
          LOWSTYLELIFE
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          style={{
            width: 40, height: 1,
            background: "rgba(216,177,92,0.4)",
            margin: "26px auto 22px",
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          style={{
            color: "rgba(245,241,234,0.65)",
            fontSize: 14,
            fontWeight: 300,
            letterSpacing: "0.04em",
            lineHeight: 1.6,
            margin: 0,
            fontStyle: "italic",
            fontFamily: "Georgia, serif",
          }}
        >
          Tworzony z pasji do smaków i chwili
        </motion.p>
      </div>

      {/* Bottom: CTA + footer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.05 }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, width: "100%", maxWidth: 380 }}
      >
        <motion.button
          onClick={() => {
            try { window.localStorage.removeItem("pp-admin"); } catch {}
            onEnter();
          }}
          whileHover={{ background: "rgba(216,177,92,0.10)", borderColor: "rgba(216,177,92,0.75)" }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: "16px 56px",
            borderRadius: 999,
            border: "1px solid rgba(216,177,92,0.55)",
            background: "transparent",
            color: "#d8b15c",
            fontFamily: "inherit",
            fontSize: 15,
            fontWeight: 500,
            letterSpacing: "0.32em",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          WEJDŹ
        </motion.button>

        <motion.button
          onClick={() => {
            try { window.localStorage.setItem("pp-admin", "1"); } catch {}
            onEnter();
          }}
          whileHover={{ background: "linear-gradient(135deg, #e6c070 0%, #d8b15c 100%)" }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: "14px 36px",
            borderRadius: 999,
            border: "1px solid #d8b15c",
            background: "linear-gradient(135deg, #d8b15c 0%, #c79b3f 100%)",
            color: "#1a0d24",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.22em",
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: "0 4px 18px rgba(216,177,92,0.35)",
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          ✨ WEJDŹ JAKO ADMIN
        </motion.button>
        <div style={{
          marginTop: -10,
          color: "rgba(245,241,234,0.55)",
          fontSize: 11,
          letterSpacing: "0.06em",
          textAlign: "center",
        }}>
          kontakt@lowstylelife.art — bez limitu AI
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <a
            href="https://lowstylelife.art"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(216,177,92,0.85)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(216,177,92,0.55)")}
            style={{
              color: "rgba(216,177,92,0.55)",
              fontSize: 11,
              letterSpacing: "0.22em",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            lowstylelife.art
          </a>
          <div style={{
            color: "rgba(245,241,234,0.30)",
            fontSize: 10,
            letterSpacing: "0.14em",
            textAlign: "center",
            lineHeight: 1.7,
          }}>
            Wszelkie prawa zastrzeżone
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
