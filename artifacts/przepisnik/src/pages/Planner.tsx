import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, RefreshCw, BookmarkPlus, BookmarkCheck } from "lucide-react"
import {
  DIETS, SLOTS, DIET_LABELS, DIET_EMOJI,
  SLOT_LABELS, SLOT_EMOJI, getDish, pickDayPlan,
  type DietName, type MealSlot, type PlanerDish,
} from "@/data/planner"
import { formatScaledIngredients } from "@/data/portions"
import { useRecipes } from "@/context/RecipesContext"
import { generateSlug } from "@/data/recipes"
import OnboardingHint from "@/components/OnboardingHint"

const SLOT_CATEGORY: Record<MealSlot, string> = {
  sniadanie:        "Śniadania",
  drugie_sniadanie: "Śniadania",
  obiad:            "Dania główne",
  podwieczorek:     "Desery",
  kolacja:          "Dania główne",
}

function daySeed() {
  return Math.floor(Date.now() / 86_400_000) // zmienia się każdą dobę
}

function getDailyThree(d: DietName): Record<MealSlot, [number, number, number]> {
  // Cały dzień naraz — dzięki temu dania nie powtarzają się między posiłkami,
  // a każdy posiłek dostaje 3 alternatywy z różnych kategorii.
  return pickDayPlan(d, daySeed())
}

const ZERO_INDEXES: Record<MealSlot, number> = {
  sniadanie: 0, drugie_sniadanie: 0, obiad: 0, podwieczorek: 0, kolacja: 0,
}

const KCAL_TARGETS = [1600, 1800, 2000, 2200, 2500, 2800, 3000] as const
type KcalTarget = typeof KCAL_TARGETS[number]
const KCAL_STORAGE_KEY = "pp-planer-kcal-target"
const DEFAULT_TARGET: KcalTarget = 2000

function loadTarget(): KcalTarget {
  if (typeof window === "undefined") return DEFAULT_TARGET
  const raw = window.localStorage.getItem(KCAL_STORAGE_KEY)
  const n = raw ? Number(raw) : NaN
  return (KCAL_TARGETS as readonly number[]).includes(n) ? (n as KcalTarget) : DEFAULT_TARGET
}

function scaleDish(dish: PlanerDish, factor: number): PlanerDish {
  const r = (n: number) => Math.round(n)
  return {
    ...dish,
    kcal: r(dish.kcal * factor),
    B:    r(dish.B * factor),
    T:    r(dish.T * factor),
    W:    r(dish.W * factor),
  }
}

export default function Planner() {
  const { addRecipe, allRecipes } = useRecipes()
  const [diet, setDiet]       = useState<DietName>("low_carb")
  const [selection, setSelection] = useState(() => getDailyThree("low_carb"))
  const [indexes, setIndexes] = useState<Record<MealSlot, number>>(ZERO_INDEXES)
  const [toast, setToast]     = useState<string | null>(null)
  const [kcalTarget, setKcalTarget] = useState<KcalTarget>(loadTarget)

  useEffect(() => {
    try { window.localStorage.setItem(KCAL_STORAGE_KEY, String(kcalTarget)) } catch {}
  }, [kcalTarget])

  // Suma bazowych kcal wybranych dziś dań — używana do skalowania pod cel kaloryczny
  const baseKcalSum = useMemo(
    () => SLOTS.reduce((s, slot) => s + getDish(selection[slot][indexes[slot]]).kcal, 0),
    [selection, indexes],
  )
  const scaleFactor = baseKcalSum > 0 ? kcalTarget / baseKcalSum : 1

  function isSaved(dish: PlanerDish) {
    return allRecipes.some(r => r.title === dish.nazwa)
  }

  function saveToBook(baseDish: PlanerDish, slot: MealSlot) {
    const dish = scaleDish(baseDish, scaleFactor)
    if (isSaved(dish)) return
    addRecipe({
      id:          `planer-${dish.id}-${Date.now()}`,
      slug:        generateSlug(dish.nazwa),
      title:       dish.nazwa,
      description: dish.opis,
      category:    SLOT_CATEGORY[slot],
      prepTime:    `${dish.czas} min`,
      servings:    2,
      difficulty:  "łatwy",
      emoji:       SLOT_EMOJI[slot],
      ingredients: formatScaledIngredients(dish.skladniki, dish.kcal),
      steps:       dish.przygotowanie.split(".").map(s => s.trim()).filter(Boolean),
      notes:       `kcal: ${dish.kcal} | B: ${dish.B}g | T: ${dish.T}g | W: ${dish.W}g`,
    })
    setToast(`„${dish.nazwa}" zapisano w przepisach`)
    setTimeout(() => setToast(null), 2800)
  }

  function swap(slot: MealSlot, dir: 1 | -1) {
    setIndexes(prev => ({ ...prev, [slot]: (prev[slot] + dir + 3) % 3 }))
  }

  function resetAll() {
    setIndexes(ZERO_INDEXES)
  }

  const dayMacros = SLOTS.reduce(
    (acc, slot) => {
      const dish = scaleDish(getDish(selection[slot][indexes[slot]]), scaleFactor)
      return { kcal: acc.kcal + dish.kcal, B: acc.B + dish.B, T: acc.T + dish.T, W: acc.W + dish.W }
    },
    { kcal: 0, B: 0, T: 0, W: 0 },
  )

  const today = new Date().toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long" })

  return (
    <div style={{ background: "#f5f1ea", minHeight: "100vh", paddingTop: 100, paddingBottom: 24, overflowX: "hidden", width: "100%" }}>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div style={{ background: "#07111f", padding: "28px 20px 24px", textAlign: "center" }}>
        <p style={{ color: "#d8b15c", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>
          {today}
        </p>
        <h1 style={{ fontFamily: "Georgia, serif", color: "#f5f1ea", fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
          Planer posiłków
        </h1>

        {/* macro summary */}
        <div style={{ display: "flex", justifyContent: "center", gap: 0, background: "rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden", maxWidth: 360, margin: "0 auto" }}>
          {[
            { label: `cel ${kcalTarget}`, val: dayMacros.kcal, unit: "" },
            { label: "białko", val: dayMacros.B, unit: "g" },
            { label: "tłuszcz", val: dayMacros.T, unit: "g" },
            { label: "węgl.", val: dayMacros.W, unit: "g" },
          ].map((m, i) => (
            <div key={i} style={{ flex: 1, padding: "10px 4px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none", textAlign: "center" }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: i === 0 ? "#d8b15c" : "#f5f1ea", lineHeight: 1 }}>
                {m.val}<span style={{ fontSize: 10, opacity: 0.5, fontFamily: "sans-serif" }}>{m.unit}</span>
              </div>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(245,241,234,0.4)", marginTop: 3 }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Onboarding hint ───────────────────────────────────────────── */}
      <div style={{ padding: "20px 16px 0" }}>
        <OnboardingHint
          id="planer-v1"
          text="Wybierz dietę i zaplanuj dzień jedzenia."
          icon="📅"
          marginBottom={0}
        />
      </div>

      {/* ── Kcal target selector ──────────────────────────────────────── */}
      <div style={{ padding: "18px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "#9a8aa0", fontWeight: 600 }}>
            Cel kaloryczny / dobę
          </span>
          <span style={{ fontSize: 11, color: "#a09090" }}>{kcalTarget} kcal</span>
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }} className="no-scrollbar">
          {KCAL_TARGETS.map(t => {
            const active = kcalTarget === t
            return (
              <button
                key={t}
                onClick={() => setKcalTarget(t)}
                style={{
                  flexShrink: 0,
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: active ? "1px solid transparent" : "1px solid #ddd3e7",
                  background: active ? "linear-gradient(135deg, #d8b15c 0%, #c79b3f 100%)" : "#fff",
                  color: active ? "#1a0d24" : "#7a6d8a",
                  fontSize: 13, fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                  boxShadow: active ? "0 2px 10px rgba(216,177,92,0.35)" : "none",
                  transition: "all 0.18s",
                  whiteSpace: "nowrap",
                  fontFamily: "inherit",
                }}
              >
                {t} kcal
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Diet selector ─────────────────────────────────────────────── */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }} className="no-scrollbar">
          {DIETS.map(d => {
            const active = diet === d
            return (
              <button
                key={d}
                onClick={() => { setDiet(d); setSelection(getDailyThree(d)); setIndexes(ZERO_INDEXES) }}
                onMouseEnter={(e) => {
                  if (active) return
                  e.currentTarget.style.borderColor = "#c8b4dc"
                  e.currentTarget.style.background = "#fbf6fd"
                  e.currentTarget.style.color = "#6a4a8e"
                }}
                onMouseLeave={(e) => {
                  if (active) return
                  e.currentTarget.style.borderColor = "#ddd3e7"
                  e.currentTarget.style.background = "#fff"
                  e.currentTarget.style.color = "#7a6d8a"
                }}
                onFocus={(e) => {
                  if (active) return
                  e.currentTarget.style.borderColor = "#c8b4dc"
                  e.currentTarget.style.background = "#fbf6fd"
                  e.currentTarget.style.color = "#6a4a8e"
                }}
                onBlur={(e) => {
                  if (active) return
                  e.currentTarget.style.borderColor = "#ddd3e7"
                  e.currentTarget.style.background = "#fff"
                  e.currentTarget.style.color = "#7a6d8a"
                }}
                style={{
                  flexShrink: 0,
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: active ? "1px solid transparent" : "1px solid #ddd3e7",
                  background: active ? "linear-gradient(135deg, #9a5fde 0%, #8b4fd1 100%)" : "#fff",
                  color: active ? "#fff" : "#7a6d8a",
                  fontSize: 13, fontWeight: active ? 600 : 500,
                  cursor: "pointer",
                  boxShadow: active ? "0 2px 10px rgba(139,79,209,0.28)" : "none",
                  transition: "all 0.18s",
                  whiteSpace: "nowrap",
                  display: "flex", alignItems: "center", gap: 6,
                  fontFamily: "inherit",
                }}
              >
                <span>{DIET_EMOJI[d]}</span>
                <span>{DIET_LABELS[d]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Meal cards ────────────────────────────────────────────────── */}
      <div style={{ padding: "20px 16px 0" }}>
        {SLOTS.map((slot, si) => {
          const idx  = indexes[slot]
          const dish = scaleDish(getDish(selection[slot][idx]), scaleFactor)

          return (
            <AnimatePresence key={slot} mode="wait">
              <motion.div
                key={`${diet}-${slot}-${idx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                whileHover={{
                  y: -2,
                  boxShadow: "0 8px 24px rgba(7,17,31,0.10)",
                  borderColor: "rgba(139,79,209,0.18)",
                }}
                transition={{ duration: 0.22, delay: si * 0.04 }}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  marginBottom: 12,
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(7,17,31,0.06)",
                  border: "1px solid rgba(7,17,31,0.07)",
                }}
              >
                {/* card header */}
                <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid #f0ece4", background: "#faf8f4" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: "#f5f1ea", border: "1px solid #e8e2d8",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, flexShrink: 0,
                      }}>
                        {SLOT_EMOJI[slot]}
                      </div>
                      <div>
                        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#a09090", fontWeight: 500 }}>
                          {SLOT_LABELS[slot]}
                        </div>
                        <div style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 600, color: "#1a1a2e", lineHeight: 1.2, marginTop: 1 }}>
                          {dish.nazwa}
                        </div>
                      </div>
                    </div>
                    {/* kcal badge */}
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: "#8b4fd1" }}>
                        {dish.kcal}
                      </div>
                      <div style={{ fontSize: 9, color: "#a09090", textTransform: "uppercase", letterSpacing: "0.1em" }}>kcal</div>
                    </div>
                  </div>
                </div>

                {/* card body */}
                <div style={{ padding: "12px 16px 14px" }}>
                  {/* ingredients (scaled to kcal) */}
                  <div style={{
                    background: "#faf6f0",
                    borderRadius: 10,
                    border: "1px solid #efe9df",
                    padding: "10px 12px",
                    marginBottom: 12,
                  }}>
                    <div style={{
                      fontSize: 9.5, fontWeight: 700, color: "#8a6a1f",
                      letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6,
                    }}>
                      Składniki — {dish.kcal} kcal
                    </div>
                    {formatScaledIngredients(dish.skladniki, dish.kcal).map((line, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: i === 0 ? 0 : 2 }}>
                        <span style={{ width: 4, height: 4, borderRadius: 2, background: "#8b4fd1", marginTop: 7, flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: 12.5, lineHeight: 1.45, color: "#3a302a", fontWeight: 500 }}>{line}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 6, fontSize: 11, color: "#9a8e78", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
                      ilości orientacyjne — dostosuj do siebie
                    </div>
                  </div>

                  {/* macros */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 12 }}>
                    {[
                      { l: "Białko", v: dish.B, u: "g", c: "#8b4fd1" },
                      { l: "Tłuszcz", v: dish.T, u: "g", c: "#6b6070" },
                      { l: "Węgle.", v: dish.W, u: "g", c: "#2e7d32" },
                    ].map(m => (
                      <div key={m.l} style={{ background: "#f7f4f0", borderRadius: 8, padding: "7px 8px", textAlign: "center", border: "1px solid #ede8e0" }}>
                        <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: m.c, lineHeight: 1 }}>
                          {m.v}<span style={{ fontSize: 10, color: "#b0a8b0", fontFamily: "sans-serif" }}>{m.u}</span>
                        </div>
                        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#b0a8b0", marginTop: 2 }}>
                          {m.l}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* swap controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid #f0ece4", paddingTop: 10 }}>
                    <button
                      onClick={() => swap(slot, -1)}
                      style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #ddd8e8", background: "#f7f4f0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b4fd1" }}
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                      {[0, 1, 2].map(i => (
                        <button
                          key={i}
                          onClick={() => setIndexes(prev => ({ ...prev, [slot]: i }))}
                          style={{
                            width: i === idx ? 20 : 8, height: 8,
                            borderRadius: 4,
                            background: i === idx ? "#8b4fd1" : "#ddd8e8",
                            border: "none", cursor: "pointer",
                            transition: "all 0.2s",
                            padding: 0,
                          }}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => swap(slot, 1)}
                      style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #ddd8e8", background: "#f7f4f0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b4fd1" }}
                    >
                      <ChevronRight size={16} />
                    </button>

                    <span style={{ fontSize: 11, color: "#b0a8b0", flexShrink: 0 }}>
                      {idx + 1} / 3
                    </span>
                  </div>

                  {/* prep hint (collapsed) */}
                  <details style={{ marginTop: 8 }}>
                    <summary style={{ fontSize: 11, color: "#a09090", cursor: "pointer", listStyle: "none", display: "flex", alignItems: "center", gap: 4 }}>
                      <RefreshCw size={10} />
                      Sposób przygotowania
                    </summary>
                    <p style={{ fontSize: 12, color: "#6b6070", lineHeight: 1.6, marginTop: 6, paddingLeft: 4 }}>
                      {dish.przygotowanie}
                    </p>
                  </details>

                  {/* save button */}
                  {(() => {
                    const saved = isSaved(dish)
                    return (
                      <button
                        onClick={() => saveToBook(dish, slot)}
                        disabled={saved}
                        onMouseEnter={(e) => {
                          if (saved) return
                          e.currentTarget.style.background = "#7a3fc2"
                          e.currentTarget.style.boxShadow = "0 4px 14px rgba(139,79,209,0.45)"
                          e.currentTarget.style.transform = "translateY(-1px)"
                        }}
                        onMouseLeave={(e) => {
                          if (saved) return
                          e.currentTarget.style.background = "#8b4fd1"
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(139,79,209,0.25)"
                          e.currentTarget.style.transform = "translateY(0)"
                        }}
                        onFocus={(e) => {
                          if (saved) return
                          e.currentTarget.style.background = "#7a3fc2"
                          e.currentTarget.style.boxShadow = "0 4px 14px rgba(139,79,209,0.45)"
                        }}
                        onBlur={(e) => {
                          if (saved) return
                          e.currentTarget.style.background = "#8b4fd1"
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(139,79,209,0.25)"
                          e.currentTarget.style.transform = "translateY(0)"
                        }}
                        style={{
                          marginTop: 10,
                          width: "100%",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          padding: "10px 0",
                          borderRadius: 10,
                          border: saved ? "1px solid #c8b8e8" : "1px solid #8b4fd1",
                          background: saved ? "#f3eefb" : "#8b4fd1",
                          color: saved ? "#8b4fd1" : "#fff",
                          fontSize: 13, fontWeight: 600,
                          cursor: saved ? "default" : "pointer",
                          boxShadow: saved ? "none" : "0 2px 8px rgba(139,79,209,0.25)",
                          transition: "all 0.18s",
                        }}
                      >
                        {saved
                          ? <><BookmarkCheck size={15} /> Zapisano w przepisach</>
                          : <><BookmarkPlus size={15} /> Zapisz w przepisach</>
                        }
                      </button>
                    )
                  })()}
                </div>
              </motion.div>
            </AnimatePresence>
          )
        })}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ duration: 0.22 }}
            style={{
              position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
              zIndex: 300,
              background: "#1e1030", color: "#f0e9d6",
              fontSize: 13, fontWeight: 500,
              padding: "11px 20px", borderRadius: 16,
              boxShadow: "0 8px 28px rgba(0,0,0,0.3), 0 0 0 1px rgba(139,79,209,0.3)",
              whiteSpace: "nowrap",
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            <BookmarkCheck size={15} color="#a78bfa" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
