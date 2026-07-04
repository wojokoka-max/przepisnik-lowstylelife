import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { generateSlug, type Recipe } from "@/data/recipes";
import { useRecipes } from "@/context/RecipesContext";
import AddRecipeModal from "@/components/AddRecipeModal";
import { ADD_RECIPE_EVENT } from "@/components/SiteHeader";
import { Check, Link, Star, Search, X } from "lucide-react";

const CATEGORY_EMOJI: Record<string, string> = {
  "Dania główne": "🍝",
  "Zupy":         "🍲",
  "Desery":       "🍰",
  "Śniadania":    "🍳",
  "Pieczywo":     "🍞",
  "Przetwory":    "🫙",
  "Świąteczne":   "🎄🎂",
  "Pobrane":      "🔗",
};

const DIFFICULTY_COLOR: Record<Recipe["difficulty"], string> = {
  "łatwy":  "#15995d",
  "średni": "#b45309",
  "trudny": "#dc2626",
};

// ── Recipe card ───────────────────────────────────────────────────────────────

function RecipeCard({ recipe, index }: { recipe: Recipe; index: number }) {
  const [, navigate] = useLocation();
  const { favorites, toggleFavorite } = useRecipes();
  const isFav = favorites.has(recipe.id);
  const emoji = CATEGORY_EMOJI[recipe.category] ?? "🍽️";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.05, 0.3), ease: "easeOut" }}
      onClick={() => navigate(`/przepis/${recipe.slug ?? recipe.id}`)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "#fffdfb",
        border: "1px solid #ebe3ef",
        borderRadius: "16px",
        padding: "12px 14px",
        cursor: "pointer",
        boxShadow: "0 1px 2px rgba(28,24,16,0.04)",
      }}
      whileHover={{
        y: -2,
        boxShadow: "0 8px 22px rgba(139,79,209,0.14)",
        borderColor: "#dccfea",
        transition: { duration: 0.18, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Emoji badge */}
      <div style={{
        width: "46px", height: "46px", borderRadius: "12px",
        background: "linear-gradient(135deg, #f4ebfa 0%, #ebdcf5 100%)",
        border: "1px solid #e6d8f0",
        display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: "22px", flexShrink: 0,
      }}>
        {emoji}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0, paddingRight: "6px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#a387bf", fontWeight: 700, marginBottom: "2px", textTransform: "uppercase" }}>
          {recipe.category}
        </div>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#34284b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "2px" }}>
          {recipe.title}
        </div>
        <div style={{ display: "flex", gap: "8px", fontSize: "12px" }}>
          {recipe.difficulty && <span style={{ color: DIFFICULTY_COLOR[recipe.difficulty], fontWeight: 600 }}>{recipe.difficulty}</span>}
          {recipe.servings && <span style={{ color: "#8b8198" }}>{recipe.servings} porcji</span>}
        </div>
      </div>

      {/* Star */}
      <motion.button
        onClick={(e) => { e.stopPropagation(); toggleFavorite(recipe.id); }}
        whileTap={{ scale: 0.85 }}
        whileHover={{
          background: isFav ? "#fde68a" : "#ebdcf5",
          borderColor: isFav ? "#fcd34d" : "#d4bce8",
        }}
        aria-label={isFav ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
        style={{
          flexShrink: 0, width: "38px", height: "38px",
          background: isFav ? "#fef3c7" : "#f4ebfa",
          border: isFav ? "1px solid #fde68a" : "1px solid #e6d8f0",
          borderRadius: "12px",
          cursor: "pointer", padding: 0,
          color: isFav ? "#f59e0b" : "#8b4fd1",
          lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.18s",
        }}
      >
        <Star size={19} fill={isFav ? "#f59e0b" : "none"} strokeWidth={isFav ? 0 : 2.2} />
      </motion.button>
    </motion.div>
  );
}

// ── Pobrane list ──────────────────────────────────────────────────────────────

function PobraneTitleList({ recipes, emptyLabel = "Brak zapisanych linków." }: {
  recipes: Recipe[];
  emptyLabel?: string;
}) {
  const [, navigate] = useLocation();
  const { favorites, toggleFavorite } = useRecipes();

  if (recipes.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "24px 0", color: "#8b8198", fontSize: "14px" }}>
        {emptyLabel}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      style={{ background: "#fffdfb", border: "1px solid #ebe3ef", borderRadius: "16px", overflow: "hidden" }}
    >
      {recipes.map((recipe, i) => {
        const isFav = favorites.has(recipe.id);
        return (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.25) }}
            style={{
              display: "flex", alignItems: "center", gap: "6px", paddingRight: "10px",
              borderBottom: i < recipes.length - 1 ? "1px solid #ebe3ef" : "none",
            }}
          >
            <button
              onClick={() => {
                if (recipe.sourceUrl) {
                  window.open(recipe.sourceUrl, "_blank", "noopener,noreferrer");
                } else {
                  navigate(`/przepis/${recipe.slug ?? recipe.id}`);
                }
              }}
              style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", textAlign: "left", background: "none", border: "none", cursor: "pointer", minWidth: 0 }}
            >
              <Link size={12} color={recipe.sourceUrl ? "#8b4fd1" : "#60b4e8"} style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: "14px", color: "#34284b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                  {recipe.title}
                </span>
                {recipe.sourceUrl && (
                  <span style={{ fontSize: "11px", color: "#a387bf", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                    {(() => { try { return new URL(recipe.sourceUrl).hostname.replace("www.", ""); } catch { return recipe.sourceUrl; } })()}
                  </span>
                )}
              </div>
            </button>
            <motion.button
              onClick={() => toggleFavorite(recipe.id)}
              whileTap={{ scale: 0.85 }}
              whileHover={{
                background: isFav ? "#fde68a" : "#ebdcf5",
                borderColor: isFav ? "#fcd34d" : "#d4bce8",
              }}
              style={{
                flexShrink: 0, width: "34px", height: "34px",
                background: isFav ? "#fef3c7" : "#f4ebfa",
                border: isFav ? "1px solid #fde68a" : "1px solid #e6d8f0",
                borderRadius: "10px",
                cursor: "pointer", padding: 0,
                color: isFav ? "#f59e0b" : "#8b4fd1",
                lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.18s",
              }}
              aria-label={isFav ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
            >
              <Star size={16} fill={isFav ? "#f59e0b" : "none"} strokeWidth={isFav ? 0 : 2.2} />
            </motion.button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ── Category chip ─────────────────────────────────────────────────────────────

function CategoryChip({ label, active, count, isUlubione, onClick }: {
  label: string; active: boolean; count: number | null; isUlubione: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={(e) => {
        if (active) return;
        e.currentTarget.style.borderColor = "#c8b4dc";
        e.currentTarget.style.background = "#fbf6fd";
        e.currentTarget.style.color = "#6a4a8e";
      }}
      onMouseLeave={(e) => {
        if (active) return;
        e.currentTarget.style.borderColor = "#ddd3e7";
        e.currentTarget.style.background = "#f7f3f9";
        e.currentTarget.style.color = "#837694";
      }}
      onFocus={(e) => {
        if (active) return;
        e.currentTarget.style.borderColor = "#c8b4dc";
        e.currentTarget.style.background = "#fbf6fd";
        e.currentTarget.style.color = "#6a4a8e";
      }}
      onBlur={(e) => {
        if (active) return;
        e.currentTarget.style.borderColor = "#ddd3e7";
        e.currentTarget.style.background = "#f7f3f9";
        e.currentTarget.style.color = "#837694";
      }}
      style={{
        padding: "8px 15px",
        borderRadius: "999px",
        border: active ? "1px solid transparent" : "1px solid #ddd3e7",
        background: active
          ? (isUlubione
            ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
            : "linear-gradient(135deg, #9a5fde 0%, #8b4fd1 100%)")
          : "#f7f3f9",
        color: active ? "#fff" : "#837694",
        fontSize: "13px",
        fontWeight: active ? 600 : 500,
        cursor: "pointer",
        boxShadow: active
          ? (isUlubione
            ? "0 2px 10px rgba(217,119,6,0.30)"
            : "0 2px 10px rgba(139,79,209,0.28)")
          : "none",
        transition: "all 0.18s",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        whiteSpace: "nowrap",
        fontFamily: "inherit",
      }}
    >
      {isUlubione && <Star size={11} fill={active ? "currentColor" : "none"} strokeWidth={active ? 0 : 1.5} />}
      {label}
      {count !== null && count > 0 && (
        <span style={{
          fontSize: "10px",
          fontWeight: 700,
          opacity: 0.95,
          background: active ? "rgba(255,255,255,0.22)" : "rgba(139,79,209,0.12)",
          color: active ? "#fff" : "#8b4fd1",
          padding: "1px 6px",
          borderRadius: "999px",
          marginLeft: "1px",
        }}>{count}</span>
      )}
    </button>
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES = ["Wszystkie", "Dania główne", "Zupy", "Desery", "Śniadania", "Pieczywo", "Przetwory", "Świąteczne", "Pobrane", "Ulubione"];

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Wszystkie");
  const [modalOpen, setModalOpen] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { allRecipes, favorites, addRecipe } = useRecipes();

  useEffect(() => {
    const handler = () => setModalOpen(true);
    window.addEventListener(ADD_RECIPE_EVENT, handler);
    return () => window.removeEventListener(ADD_RECIPE_EVENT, handler);
  }, []);

  const q = searchQuery.trim().toLowerCase();

  const pobrane   = allRecipes.filter(r => r.category === "Pobrane");
  const ulubione  = allRecipes.filter(r => favorites.has(r.id));
  const showPobrane  = selectedCategory === "Pobrane";
  const showUlubione = selectedCategory === "Ulubione";

  const regularAll = selectedCategory === "Wszystkie"
    ? allRecipes.filter(r => r.category !== "Pobrane")
    : allRecipes.filter(r => r.category === selectedCategory && r.category !== "Pobrane");

  const filter = (list: Recipe[]) =>
    q ? list.filter(r => r.title.toLowerCase().includes(q)) : list;

  const regularFiltered  = filter(regularAll);
  const pobraneFiltered  = filter(pobrane);
  const ulubioneFiltered = filter(ulubione);

  return (
    <div style={{ minHeight: "100dvh", background: "#f5f1ea", fontFamily: "inherit", color: "#33274a", paddingTop: 100, overflowX: "hidden", width: "100%" }}>

      {/* Page content */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "14px 16px 24px", boxSizing: "border-box" }}>

        {/* ── Search ──────────────────────────────────────────────────── */}
        <div style={{ position: "relative", marginBottom: "16px" }}>
          <Search size={15} color="#8b4fd1" style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Szukaj przepisu..."
            onFocusCapture={(e) => {
              e.currentTarget.style.borderColor = "#8b4fd1";
              e.currentTarget.style.boxShadow = "0 0 0 4px rgba(139,79,209,0.13)";
              e.currentTarget.style.background = "#ffffff";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#dccfea";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.background = "#fbf8fd";
            }}
            style={{
              width: "100%",
              padding: "11px 38px",
              borderRadius: "14px",
              border: "1px solid #dccfea",
              background: "#fbf8fd",
              fontSize: "15px",
              outline: "none",
              color: "#6d5f82",
              boxSizing: "border-box",
              height: "44px",
              transition: "all 0.18s",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8b8198", display: "flex", padding: "4px" }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* ── Category chips ───────────────────────────────────────────── */}
        <div className="no-scrollbar" style={{
          display: "flex", flexWrap: "nowrap", gap: "7px", marginBottom: "20px",
          overflowX: "auto", paddingBottom: "4px",
          msOverflowStyle: "none", scrollbarWidth: "none",
        }}>
          {CATEGORIES.map((cat) => {
            const isUlubione = cat === "Ulubione";
            const isPobrane  = cat === "Pobrane";
            const count      = isUlubione ? ulubione.length : isPobrane ? pobrane.length : null;
            return (
              <CategoryChip
                key={cat}
                label={cat}
                active={selectedCategory === cat}
                count={count}
                isUlubione={isUlubione}
                onClick={() => setSelectedCategory(cat)}
              />
            );
          })}
        </div>

        {/* ── Recipe lists ─────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {showPobrane && (
            <motion.div key="pobrane" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <PobraneTitleList
                recipes={pobraneFiltered}
                emptyLabel={q ? "Brak wyników." : "Brak zapisanych linków."}
              />
            </motion.div>
          )}

          {showUlubione && (
            <motion.div key="ulubione" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              {ulubioneFiltered.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "32px 20px",
                  color: "#8b8198",
                  fontSize: "14px",
                  background: "#fbf8fd",
                  border: "1px dashed #ddd3e7",
                  borderRadius: "16px",
                }}>
                  <div style={{ fontSize: "30px", marginBottom: "8px", opacity: 0.55 }}>⭐</div>
                  {q ? "Brak wyników." : "Brak ulubionych. Kliknij gwiazdkę przy przepisie."}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {ulubioneFiltered.filter(r => r.category === "Pobrane").length > 0 && (
                    <PobraneTitleList recipes={ulubioneFiltered.filter(r => r.category === "Pobrane")} />
                  )}
                  {ulubioneFiltered.filter(r => r.category !== "Pobrane").map((recipe, i) => (
                    <RecipeCard key={recipe.id} recipe={recipe} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {!showPobrane && !showUlubione && (
            <motion.div key="regular" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <div style={{ display: "grid", gap: "10px" }}>
                {regularFiltered.map((recipe, i) => (
                  <RecipeCard key={recipe.id} recipe={recipe} index={i} />
                ))}
              </div>
              {regularFiltered.length === 0 && (
                <div style={{
                  textAlign: "center",
                  padding: "32px 20px",
                  color: "#8b8198",
                  fontSize: "14px",
                  background: "#fbf8fd",
                  border: "1px dashed #ddd3e7",
                  borderRadius: "16px",
                }}>
                  <div style={{ fontSize: "30px", marginBottom: "8px", opacity: 0.55 }}>
                    {q ? "🔍" : allRecipes.length === 0 ? "📖" : "🍽️"}
                  </div>
                  {q
                    ? "Brak wyników."
                    : allRecipes.length === 0
                      ? "Brak przepisów. Dodaj swój pierwszy przepis."
                      : "Brak przepisów w tej kategorii."}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {savedMsg && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{
              position: "fixed", bottom: "28px", left: "50%", transform: "translateX(-50%)",
              zIndex: 50, display: "flex", alignItems: "center", gap: "8px",
              background: "#1e1030", color: "#f0e9d6", fontSize: "14px", fontWeight: 500,
              padding: "11px 20px", borderRadius: "16px",
              boxShadow: "0 8px 28px rgba(0,0,0,0.3), 0 0 0 1px rgba(139,79,209,0.3)",
              whiteSpace: "nowrap",
            }}
          >
            <Check size={14} color="#4ade80" strokeWidth={2.5} />
            {savedMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <AddRecipeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(recipe) => {
          addRecipe(recipe);
          const msg = recipe.category === "Pobrane" ? "Link zapisany" : "Przepis zapisany";
          setSavedMsg(msg);
          setTimeout(() => setSavedMsg(""), 2500);
        }}
      />
    </div>
  );
}
