import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  DB,
  CAT_ICONS,
  CAT_LABELS,
  QUICK_CATS,
  findRecipe,
  findKreatorProposalsForCategory,
  resolveIngredients,
  stripHtml,
  type Product,
  type Category,
  type KreatorRecipe,
  type KreatorProposal,
  type ResolvedIngredient,
} from "@/data/kreator";
import {
  CUISINES,
  CUISINE_EMOJI,
  CUISINE_LABELS,
  findPlanerDishesForCategory,
  getCuisineFromText,
  type Cuisine,
  type PlanerDish,
} from "@/data/planner";
import { useRecipes } from "@/context/RecipesContext";
import { generateSlug, type Recipe } from "@/data/recipes";
import OnboardingHint from "@/components/OnboardingHint";
import PremiumModal from "@/components/PremiumModal";
import AiUsageBadge from "@/components/AiUsageBadge";
import { useAiLimit } from "@/hooks/useAiLimit";

const RECENT_KEY = "przepisnik-kreator-recent";
const MAX_RECENT = 5;

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(ids: string[]): void {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(ids));
  } catch {
    /* quota — ignoruj */
  }
}

interface RenderedMeal {
  recipe: KreatorRecipe;
  ingredients: ResolvedIngredient[];
  steps: string[];
  title: string;
  type: string;
  time: number;
  tip: string;
  starProduct: Product;
}

// Historia ostatnio wylosowanych przepisów (per produkt-gwiazdka).
// Trzymamy ograniczoną listę, by kolejne generowania nie powtarzały dań.
const MAX_RECENT_RECIPES = 12;
function pushRecent(list: string[], id: string): string[] {
  return [id, ...list.filter((x) => x !== id)].slice(0, MAX_RECENT_RECIPES);
}

function buildMeal(starProduct: Product, recentRecipeIds: string[]): RenderedMeal {
  const recipe = findRecipe(starProduct, recentRecipeIds);
  return buildMealFromRecipe(recipe, starProduct);
}

function buildMealFromRecipe(recipe: KreatorRecipe, starProduct: Product): RenderedMeal {
  return {
    recipe,
    ingredients: resolveIngredients(recipe, starProduct),
    steps: recipe.steps(starProduct),
    title: recipe.name(starProduct),
    type: recipe.type,
    time: recipe.time,
    tip: recipe.tip || "Smacznego!",
    starProduct,
  };
}

export default function Kreator() {
  const [, setLocation] = useLocation();
  const { addRecipe } = useRecipes();

  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownItems, setDropdownItems] = useState<Product[]>([]);
  const [hiIdx, setHiIdx] = useState(-1);
  const [starProduct, setStarProduct] = useState<Product | null>(null);
  const [recent, setRecent] = useState<string[]>(loadRecent);
  const [loading, setLoading] = useState(false);
  const [meal, setMeal] = useState<RenderedMeal | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [categoryView, setCategoryView] = useState<Category | null>(null);
  const [planerDish, setPlanerDish] = useState<PlanerDish | null>(null);
  const [planerSavedId, setPlanerSavedId] = useState<string | null>(null);
  const [cuisine, setCuisine] = useState<Cuisine | null>(null);
  const [mode, setMode] = useState<"ingredient" | "name">("ingredient");

  // ── DISH-NAME AI GENERATOR (independent flow) ─────────────────────────────
  const [dishName, setDishName]         = useState("");
  const [dishLoading, setDishLoading]   = useState(false);
  const [dishError, setDishError]       = useState("");
  const [dishRecipe, setDishRecipe]     = useState<Recipe | null>(null);
  const [dishSavedId, setDishSavedId]   = useState<string | null>(null);
  const [premiumOpen, setPremiumOpen]   = useState(false);
  const aiLimit = useAiLimit();

  const recentRecipeIdsRef = useRef<string[]>([]);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const dishResultRef = useRef<HTMLDivElement | null>(null);

  // Zamknij dropdown klikając poza nim
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Skroluj do wyniku po wygenerowaniu
  useEffect(() => {
    if (!meal || !resultRef.current) return;
    const t = setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => clearTimeout(t);
  }, [meal]);

  // Skroluj do wygenerowanego z nazwy przepisu
  useEffect(() => {
    if (!dishRecipe || !dishResultRef.current) return;
    const t = setTimeout(() => {
      dishResultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => clearTimeout(t);
  }, [dishRecipe]);

  const recentProducts = useMemo(
    () => recent.map((id) => DB.find((p) => p.id === id)).filter(Boolean) as Product[],
    [recent]
  );

  const kreatorProposals = useMemo<KreatorProposal[]>(
    () => {
      if (!categoryView) return [];
      const all = findKreatorProposalsForCategory(categoryView);
      if (!cuisine) return all;
      return all.filter((prop) => {
        const text = `${stripHtml(prop.recipe.name(prop.starProduct))} ${prop.recipe.type} ${prop.starProduct.name}`;
        return getCuisineFromText(text) === cuisine;
      });
    },
    [categoryView, cuisine]
  );

  const planerProposals = useMemo<PlanerDish[]>(
    () => {
      if (!categoryView) return [];
      const all = findPlanerDishesForCategory(categoryView);
      if (!cuisine) return all;
      return all.filter((d) => getCuisineFromText(`${d.nazwa} ${d.opis} ${d.skladniki}`) === cuisine);
    },
    [categoryView, cuisine]
  );

  function refreshDropdown(items: Product[]) {
    setDropdownItems(items);
    setHiIdx(-1);
    setDropdownOpen(items.length > 0);
  }

  function onSearchChange(value: string) {
    setQuery(value);
    const q = value.trim().toLowerCase();
    if (!q) {
      setDropdownOpen(false);
      return;
    }
    refreshDropdown(DB.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 10));
  }

  function showCategoryProposals(cat: Category, e: React.MouseEvent) {
    e.stopPropagation();
    setQuery("");
    setDropdownOpen(false);
    setStarProduct(null);
    setMeal(null);
    setPlanerDish(null);
    setSavedId(null);
    setPlanerSavedId(null);
    recentRecipeIdsRef.current = [];
    setCategoryView(cat);
  }

  function clearCategoryView() {
    setCategoryView(null);
  }

  function selectProduct(id: string) {
    const p = DB.find((x) => x.id === id);
    if (!p) return;
    setStarProduct(p);
    setDropdownOpen(false);
    setQuery("");
    setMeal(null);
    setPlanerDish(null);
    setSavedId(null);
    setPlanerSavedId(null);
    setCategoryView(null);
    recentRecipeIdsRef.current = [];

    setRecent((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX_RECENT);
      saveRecent(next);
      return next;
    });
  }

  function selectKreatorProposal(prop: KreatorProposal) {
    setStarProduct(prop.starProduct);
    setQuery("");
    setDropdownOpen(false);
    setSavedId(null);
    setPlanerSavedId(null);
    setPlanerDish(null);
    setCategoryView(null);
    setRecent((prev) => {
      const next = [prop.starProduct.id, ...prev.filter((x) => x !== prop.starProduct.id)].slice(0, MAX_RECENT);
      saveRecent(next);
      return next;
    });
    setLoading(true);
    setMeal(null);
    setTimeout(() => {
      const m = buildMealFromRecipe(prop.recipe, prop.starProduct);
      recentRecipeIdsRef.current = pushRecent(recentRecipeIdsRef.current, m.recipe.id);
      setMeal(m);
      setLoading(false);
    }, 350);
  }

  function selectPlanerProposal(dish: PlanerDish) {
    setStarProduct(null);
    setMeal(null);
    setSavedId(null);
    setPlanerSavedId(null);
    setQuery("");
    setDropdownOpen(false);
    setCategoryView(null);
    recentRecipeIdsRef.current = [];
    setPlanerDish(dish);
  }

  function clearSelected() {
    setStarProduct(null);
    setMeal(null);
    setPlanerDish(null);
    setSavedId(null);
    setPlanerSavedId(null);
    recentRecipeIdsRef.current = [];
    setQuery("");
    inputRef.current?.focus();
  }

  function createMeal() {
    if (!starProduct) return;
    setLoading(true);
    setMeal(null);
    setSavedId(null);
    setTimeout(() => {
      const m = buildMeal(starProduct, recentRecipeIdsRef.current);
      recentRecipeIdsRef.current = pushRecent(recentRecipeIdsRef.current, m.recipe.id);
      setMeal(m);
      setLoading(false);
    }, 600);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!dropdownOpen || !dropdownItems.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHiIdx((i) => Math.min(i + 1, dropdownItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHiIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && hiIdx >= 0) {
      e.preventDefault();
      selectProduct(dropdownItems[hiIdx].id);
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
    }
  }

  function clearDishResult() {
    setDishRecipe(null);
    setDishError("");
    setDishSavedId(null);
  }

  async function generateFromName() {
    const name = dishName.trim();
    if (!name) {
      setDishError("Podaj pełną nazwę dania.");
      return;
    }
    if (!aiLimit.canUse) {
      setPremiumOpen(true);
      return;
    }
    setDishError("");
    setDishLoading(true);
    setDishRecipe(null);
    setDishSavedId(null);
    try {
      if (!aiLimit.consume()) {
        setPremiumOpen(true);
        setDishLoading(false);
        return;
      }
      const res = await fetch("/api/recipe-from-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data: { error?: string } = await res.json().catch(() => ({}));
        setDishError(data.error || "Nie udało się wygenerować przepisu. Spróbuj ponownie.");
        return;
      }
      const raw: unknown = await res.json().catch(() => null);
      const data = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
      const ts = Date.now();
      const id = `kreator-ai-${ts}`;
      const slugSuffix = ts.toString(36).slice(-5);
      const titleSafe: string =
        typeof data.title === "string" && data.title.trim() ? data.title.trim() : name;
      const slug = `${generateSlug(titleSafe)}-${slugSuffix}`;
      const difficulty: Recipe["difficulty"] =
        data.difficulty === "łatwy" || data.difficulty === "średni" || data.difficulty === "trudny"
          ? data.difficulty
          : "średni";
      const cleanList = (v: unknown): string[] =>
        Array.isArray(v)
          ? v
              .filter((s: unknown): s is string => typeof s === "string")
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
          : [];
      const recipe: Recipe = {
        id,
        slug,
        title: titleSafe,
        description: typeof data.description === "string" ? data.description.trim() : "",
        category:
          typeof data.category === "string" && data.category.trim() ? data.category.trim() : "Dania główne",
        prepTime:
          typeof data.prepTime === "string" && data.prepTime.trim() ? data.prepTime.trim() : "30 min",
        servings: typeof data.servings === "number" && data.servings > 0 ? data.servings : 2,
        difficulty,
        ingredients: cleanList(data.ingredients),
        steps: cleanList(data.steps),
        emoji: typeof data.emoji === "string" && data.emoji.trim() ? data.emoji.trim() : "🍽️",
        notes:
          typeof data.notes === "string" && data.notes.trim()
            ? data.notes.trim()
            : "Przepis wygenerowany przez AI z nazwy. Możesz go edytować.",
      };
      setDishRecipe(recipe);
    } catch {
      setDishError("Błąd połączenia. Spróbuj ponownie.");
    } finally {
      setDishLoading(false);
    }
  }

  function saveDishToMyRecipes() {
    if (!dishRecipe) return;
    addRecipe(dishRecipe);
    setDishSavedId(dishRecipe.slug || dishRecipe.id);
  }

  function savePlanerToMyRecipes() {
    if (!planerDish) return;
    const ts = Date.now();
    const id = `planer-${planerDish.id}-${ts}`;
    const slugSuffix = ts.toString(36).slice(-5);
    const slug = `${generateSlug(planerDish.nazwa)}-${slugSuffix}`;
    const ingredients = planerDish.skladniki
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const steps = planerDish.przygotowanie
      .split(/(?<=\.)\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const recipe: Recipe = {
      id,
      slug,
      title: planerDish.nazwa,
      description: planerDish.opis,
      category: "Planer",
      prepTime: `${planerDish.czas} min`,
      servings: 1,
      difficulty: "łatwy",
      ingredients,
      steps,
      emoji: "🍽️",
      notes: `Wartości: ${planerDish.kcal} kcal · B ${planerDish.B} g · T ${planerDish.T} g · W ${planerDish.W} g`,
    };
    addRecipe(recipe);
    setPlanerSavedId(slug);
  }

  function saveToMyRecipes() {
    if (!meal) return;
    const title = stripHtml(meal.title);
    const ts = Date.now();
    const id = `kreator-${ts}`;
    const slugSuffix = ts.toString(36).slice(-5);
    const slug = `${generateSlug(title)}-${slugSuffix}`;
    const ingredientLines = meal.ingredients.map((ing) => {
      const name = stripHtml(ing.product.name);
      return `${name} – ${ing.g} g${ing.isStar ? " ★" : ""}`;
    });
    const stepLines = meal.steps.map((s) => stripHtml(s));
    const recipe: Recipe = {
      id,
      slug,
      title,
      description: meal.type,
      category: "Kreator",
      prepTime: `${meal.time} min`,
      servings: 1,
      difficulty: "łatwy",
      ingredients: ingredientLines,
      steps: stepLines,
      emoji: CAT_ICONS[meal.starProduct.cat],
      notes: meal.tip,
    };
    addRecipe(recipe);
    setSavedId(slug);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f1ea",
        paddingTop: 100,
        paddingBottom: 60,
      }}
    >
      <div
        style={{
          maxWidth: 780,
          margin: "0 auto",
          padding: "0 16px",
          fontFamily: "'Outfit', -apple-system, system-ui, sans-serif",
          color: "#1c1810",
        }}
      >
        {/* ONBOARDING HINT */}
        <OnboardingHint
          id="kreator-v1"
          text="Podaj składnik — stworzymy z niego posiłek."
          icon="🥕"
          marginBottom={12}
        />

        {/* AI USAGE BADGE */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <AiUsageBadge onUpgrade={() => setPremiumOpen(true)} />
        </div>

        {/* HEADER */}
        <header style={{ marginBottom: 28, paddingBottom: 18, borderBottom: "1px solid #d8d0bc" }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "#8b4fd1", marginBottom: 10 }}>
            Przepiśnik · Kreator
          </div>
          <h1 style={{ fontFamily: "Georgia, 'Playfair Display', serif", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.3px", margin: 0 }}>
            Sprawdź, co masz <em style={{ fontStyle: "italic", fontWeight: 400, color: "#8b4fd1" }}>w lodówce</em>
          </h1>
          <div style={{ fontSize: 13, fontWeight: 300, color: "#5a5040", marginTop: 6 }}>
            {mode === "ingredient"
              ? "Wybierz jeden składnik — zaproponujemy z niego cały posiłek"
              : "Wpisz nazwę dania — AI ułoży dla Ciebie przepis krok po kroku"}
          </div>
        </header>

        {/* MODE SWITCH */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
            background: "rgba(139,79,209,0.08)",
            border: "1px solid rgba(139,79,209,0.18)",
            borderRadius: 999,
            padding: 4,
            marginBottom: 14,
          }}
        >
          {([
            { key: "ingredient" as const, icon: "🌿", label: "Mam składnik" },
            { key: "name" as const, icon: "✨", label: "Mam nazwę dania" },
          ]).map((opt) => {
            const active = mode === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setMode(opt.key)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "9px 14px",
                  borderRadius: 999,
                  border: "none",
                  background: active ? "#8b4fd1" : "transparent",
                  color: active ? "#fff" : "#8b4fd1",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.18s",
                  boxShadow: active ? "0 2px 8px rgba(139,79,209,0.25)" : "none",
                }}
              >
                <span>{opt.icon}</span>
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* HERO SEARCH */}
        {mode === "ingredient" && (
        <div
          style={{
            background: "#fffdf8",
            border: "1.5px solid #d8d0bc",
            borderRadius: 14,
            padding: "22px 20px",
            boxShadow: "0 2px 12px rgba(28,24,16,0.08)",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(16px, 2.5vw, 20px)",
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            Co masz w lodówce?
          </div>
          <div style={{ fontSize: 13, color: "#9a8e78", marginBottom: 16 }}>
            Wpisz jeden składnik — resztę dobierzemy za Ciebie
          </div>

          <div ref={wrapRef} style={{ position: "relative", maxWidth: 480, margin: "0 auto" }}>
            <span
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 16,
                pointerEvents: "none",
                color: "#9a8e78",
              }}
            >
              🔍
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => onSearchChange(query)}
              onKeyDown={onKeyDown}
              placeholder="np. łosoś, jajka, awokado…"
              autoComplete="off"
              style={{
                width: "100%",
                background: "#f5f0e6",
                border: "2px solid #d8d0bc",
                borderRadius: 50,
                padding: "13px 18px 13px 42px",
                fontFamily: "inherit",
                fontSize: 15,
                color: "#1c1810",
                outline: "none",
                WebkitAppearance: "none",
                boxSizing: "border-box",
              }}
              onFocusCapture={(e) => {
                e.currentTarget.style.borderColor = "#8b4fd1";
                e.currentTarget.style.boxShadow = "0 0 0 4px rgba(139,79,209,0.15)";
                e.currentTarget.style.background = "#fffdf8";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d8d0bc";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = "#f5f0e6";
              }}
            />
            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  right: 0,
                  background: "#fffdf8",
                  border: "1.5px solid #d8d0bc",
                  borderRadius: 12,
                  boxShadow: "0 4px 24px rgba(28,24,16,0.13)",
                  maxHeight: 260,
                  overflowY: "auto",
                  zIndex: 100,
                  textAlign: "left",
                }}
              >
                {dropdownItems.map((p, i) => (
                  <div
                    key={p.id}
                    onClick={() => selectProduct(p.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "11px 16px",
                      cursor: "pointer",
                      borderBottom: i < dropdownItems.length - 1 ? "1px solid #ede8dc" : "none",
                      background: i === hiIdx ? "rgba(139,79,209,0.08)" : "transparent",
                    }}
                    onMouseEnter={() => setHiIdx(i)}
                  >
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{CAT_ICONS[p.cat]}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#1c1810" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#9a8e78" }}>{CAT_LABELS[p.cat]}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick categories */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 7,
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid #d8d0bc",
            }}
          >
            {QUICK_CATS.map((c) => (
              <button
                key={c}
                onClick={(e) => showCategoryProposals(c, e)}
                style={{
                  padding: "8px 13px",
                  borderRadius: 20,
                  border: "1.5px solid #d8d0bc",
                  background: "#f5f0e6",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  color: "#5a5040",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#8b4fd1";
                  e.currentTarget.style.color = "#8b4fd1";
                  e.currentTarget.style.background = "rgba(139,79,209,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#d8d0bc";
                  e.currentTarget.style.color = "#5a5040";
                  e.currentTarget.style.background = "#f5f0e6";
                }}
              >
                {CAT_LABELS[c]}
              </button>
            ))}
          </div>

          {/* Kuchnia świata */}
          <div style={{ marginTop: 14 }}>
            <div style={{
              fontSize: 9.5, fontWeight: 700, color: "#8a6a1f",
              letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8,
            }}>
              Kuchnia świata
            </div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }} className="no-scrollbar">
              {([null, ...CUISINES] as (Cuisine | null)[]).map((c) => {
                const active = cuisine === c;
                const label = c === null ? "🌍 Wszystkie" : `${CUISINE_EMOJI[c]} ${CUISINE_LABELS[c]}`;
                return (
                  <button
                    key={c ?? "all"}
                    onClick={() => setCuisine(active ? null : c)}
                    style={{
                      flexShrink: 0,
                      padding: "7px 12px",
                      borderRadius: 999,
                      border: active ? "1px solid #1e1030" : "1px solid #ede5d4",
                      background: active ? "#1e1030" : "#f7f2ea",
                      color: active ? "#fbf6ec" : "#5a5040",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      fontFamily: "inherit",
                      transition: "all 0.18s",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        )}

        {/* DISH-NAME AI INPUT */}
        {mode === "name" && (
        <div
          style={{
            background: "#fffdf8",
            border: "1.5px solid #d8d0bc",
            borderRadius: 14,
            padding: "22px 20px",
            boxShadow: "0 2px 12px rgba(28,24,16,0.08)",
            marginTop: 0,
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(16px, 2.5vw, 20px)",
              fontWeight: 600,
              marginBottom: 4,
              textAlign: "center",
            }}
          >
            Wpisz pełną nazwę dania
          </div>
          <div style={{ fontSize: 12, color: "#9a8e78", marginBottom: 14, textAlign: "center" }}>
            Wygenerujemy dla Ciebie domowy przepis krok po kroku
          </div>

          <input
            type="text"
            value={dishName}
            onChange={(e) => {
              setDishName(e.target.value);
              if (dishError) setDishError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !dishLoading) generateFromName();
            }}
            placeholder="np. Krewetki w sosie kokosowo-limonkowym"
            autoComplete="off"
            disabled={dishLoading}
            style={{
              width: "100%",
              background: dishLoading ? "#ede8dc" : "#f5f0e6",
              border: "2px solid #d8d0bc",
              borderRadius: 50,
              padding: "13px 18px",
              fontFamily: "inherit",
              fontSize: 14,
              color: "#1c1810",
              outline: "none",
              WebkitAppearance: "none",
              boxSizing: "border-box",
              marginBottom: 10,
            }}
            onFocusCapture={(e) => {
              e.currentTarget.style.borderColor = "#8b4fd1";
              e.currentTarget.style.boxShadow = "0 0 0 4px rgba(139,79,209,0.15)";
              e.currentTarget.style.background = "#fffdf8";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#d8d0bc";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.background = dishLoading ? "#ede8dc" : "#f5f0e6";
            }}
          />

          <button
            onClick={generateFromName}
            disabled={dishLoading || !dishName.trim()}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1.5px solid #8b4fd1",
              borderRadius: 10,
              background: dishLoading || !dishName.trim() ? "rgba(139,79,209,0.12)" : "#8b4fd1",
              color: dishLoading || !dishName.trim() ? "#8b4fd1" : "#fff",
              fontFamily: "inherit",
              fontSize: 14,
              fontWeight: 600,
              cursor: dishLoading || !dishName.trim() ? "default" : "pointer",
              transition: "all 0.15s",
            }}
          >
            {dishLoading ? (
              <>
                <span className="pp-sparkle-pulse" style={{ display: "inline-block" }}>✨</span>
                {" "}Generuję przepis…
              </>
            ) : (
              "✨ Stwórz przepis"
            )}
          </button>

          {dishError && (
            <div
              style={{
                marginTop: 10,
                background: "rgba(180,60,60,0.08)",
                border: "1px solid rgba(180,60,60,0.3)",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 12,
                color: "#9a3030",
              }}
            >
              {dishError}
            </div>
          )}
        </div>
        )}

        {/* RECENT INGREDIENTS */}
        {mode === "ingredient" && recentProducts.length > 0 && !starProduct && (
          <div style={{ marginTop: 14, marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "#8b4fd1", marginBottom: 8 }}>
              Ostatnio używane
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {recentProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectProduct(p.id)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 16,
                    border: "1px solid #d8d0bc",
                    background: "#fffdf8",
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    color: "#1c1810",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>{CAT_ICONS[p.cat]}</span>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CATEGORY PROPOSALS */}
        {categoryView && !meal && !planerDish && (
          <div style={{ marginTop: 14 }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: 10,
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: "#8b4fd1",
                    marginBottom: 4,
                  }}
                >
                  Propozycje · {CAT_LABELS[categoryView]}
                </div>
                <div style={{ fontSize: 12, color: "#9a8e78" }}>
                  {kreatorProposals.length + planerProposals.length} pomysłów ·{" "}
                  {kreatorProposals.length} z Kreatora · {planerProposals.length} z Planera
                </div>
              </div>
              <button
                onClick={clearCategoryView}
                style={{
                  border: "1px solid #d8d0bc",
                  background: "#fffdf8",
                  color: "#5a5040",
                  borderRadius: 16,
                  padding: "5px 12px",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                ✕ Zamknij
              </button>
            </div>

            {kreatorProposals.length === 0 && planerProposals.length === 0 && (
              <div
                style={{
                  background: "#fffdf8",
                  border: "1.5px dashed #d8d0bc",
                  borderRadius: 12,
                  padding: "18px 16px",
                  textAlign: "center",
                  color: "#9a8e78",
                  fontSize: 13,
                }}
              >
                Brak propozycji dla tej kategorii.
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 10,
              }}
            >
              {kreatorProposals.map((prop) => (
                <button
                  key={`k-${prop.recipe.id}`}
                  onClick={() => selectKreatorProposal(prop)}
                  style={{
                    textAlign: "left",
                    background: "#fffdf8",
                    border: "1.5px solid #d8d0bc",
                    borderRadius: 12,
                    padding: "12px 14px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    color: "#1c1810",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#8b4fd1";
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(139,79,209,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#d8d0bc";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        color: "#8b4fd1",
                        background: "rgba(139,79,209,0.1)",
                        padding: "2px 7px",
                        borderRadius: 10,
                      }}
                    >
                      Kreator
                    </span>
                    <span style={{ fontSize: 11, color: "#9a8e78" }}>⏱ {prop.recipe.time} min</span>
                  </div>
                  <div
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: 14,
                      fontWeight: 600,
                      lineHeight: 1.25,
                    }}
                    dangerouslySetInnerHTML={{ __html: prop.recipe.name(prop.starProduct) }}
                  />
                  <div style={{ fontSize: 11, color: "#6e8b74" }}>{prop.recipe.type}</div>
                </button>
              ))}

              {planerProposals.map((dish) => (
                <button
                  key={`p-${dish.id}`}
                  onClick={() => selectPlanerProposal(dish)}
                  style={{
                    textAlign: "left",
                    background: "#fffdf8",
                    border: "1.5px solid #d8d0bc",
                    borderRadius: 12,
                    padding: "12px 14px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    color: "#1c1810",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#6e8b74";
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(110,139,116,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#d8d0bc";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        color: "#5a7460",
                        background: "rgba(110,139,116,0.12)",
                        padding: "2px 7px",
                        borderRadius: 10,
                      }}
                    >
                      Planer
                    </span>
                    <span style={{ fontSize: 11, color: "#9a8e78" }}>⏱ {dish.czas} min · {dish.kcal} kcal</span>
                  </div>
                  <div
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: 14,
                      fontWeight: 600,
                      lineHeight: 1.25,
                    }}
                  >
                    {dish.nazwa}
                  </div>
                  <div style={{ fontSize: 11, color: "#6e8b74" }}>{dish.opis}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SELECTED STAR */}
        {starProduct && (
          <div
            style={{
              background: "#fffdf8",
              border: "1.5px solid #8b4fd1",
              borderRadius: 14,
              padding: "14px 18px",
              boxShadow: "0 0 0 3px rgba(139,79,209,0.1)",
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginTop: 12,
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 26 }}>{CAT_ICONS[starProduct.cat]}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 600 }}>
                {starProduct.name}
              </div>
              <div style={{ fontSize: 12, color: "#8b4fd1", fontWeight: 500, marginTop: 2 }}>
                {CAT_LABELS[starProduct.cat]}
              </div>
            </div>
            <button
              onClick={clearSelected}
              title="Zmień składnik"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9a8e78",
                fontSize: 18,
                padding: 4,
                fontFamily: "inherit",
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* CREATE BTN — only when no proposals/planer view active */}
        {!categoryView && !planerDish && (
        <button
          onClick={createMeal}
          disabled={!starProduct || loading}
          style={{
            width: "100%",
            padding: "15px 24px",
            background: !starProduct || loading ? "#ede7d9" : "#8b4fd1",
            color: !starProduct || loading ? "#9a8e78" : "#fff",
            border: "none",
            borderRadius: 14,
            fontFamily: "inherit",
            fontSize: 15,
            fontWeight: 600,
            cursor: !starProduct || loading ? "not-allowed" : "pointer",
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow: !starProduct || loading ? "none" : "0 4px 16px rgba(139,79,209,0.25)",
            transition: "all 0.18s",
          }}
        >
          <span>{meal ? "Stwórz inny posiłek" : "Stwórz posiłek"}</span>
          <span style={{ fontSize: 16 }}>→</span>
        </button>
        )}

        {/* LOADING */}
        {loading && (
          <div style={{ textAlign: "center", padding: "32px 20px", color: "#9a8e78", fontSize: 14 }}>
            <div>
              {[0, 0.18, 0.36].map((d, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#8b4fd1",
                    margin: "0 3px",
                    animation: `kreator-bounce 0.9s infinite ease-in-out both`,
                    animationDelay: `${d}s`,
                  }}
                />
              ))}
            </div>
            <div style={{ marginTop: 10 }}>Komponuję posiłek…</div>
            <style>{`@keyframes kreator-bounce {
              0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
              40% { transform: scale(1); opacity: 1; }
            }`}</style>
          </div>
        )}

        {/* RESULT */}
        {meal && !loading && (
          <div
            ref={resultRef}
            style={{
              background: "#fffdf8",
              border: "1.5px solid #d8d0bc",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(28,24,16,0.13)",
              marginTop: 14,
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #f5ece0 0%, #ede7d9 100%)",
                padding: "22px 22px 18px",
                borderBottom: "1px solid #d8d0bc",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: 16,
                  top: 12,
                  fontSize: 44,
                  opacity: 0.12,
                  pointerEvents: "none",
                }}
              >
                🌿
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#6e8b74",
                  marginBottom: 6,
                }}
              >
                {meal.type}
              </div>
              <div
                style={{
                  fontFamily: "Georgia, 'Playfair Display', serif",
                  fontSize: "clamp(19px, 3vw, 26px)",
                  fontWeight: 700,
                  color: "#1c1810",
                  lineHeight: 1.2,
                }}
                dangerouslySetInnerHTML={{ __html: meal.title }}
              />
              <div style={{ fontSize: 13, color: "#9a8e78", marginTop: 6 }}>⏱ ok. {meal.time} minut</div>
            </div>

            <div style={{ padding: "20px 22px" }}>
              <SectionTitle>Składniki</SectionTitle>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: 8,
                  marginBottom: 22,
                }}
              >
                {meal.ingredients.map((ing, i) => (
                  <div
                    key={i}
                    style={{
                      background: ing.isStar ? "rgba(110,139,116,0.1)" : "#f5f0e6",
                      border: ing.isStar ? "1px solid #6e8b74" : "1px solid #d8d0bc",
                      borderRadius: 10,
                      padding: "10px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                    }}
                  >
                    <span style={{ fontSize: 17, flexShrink: 0 }}>{CAT_ICONS[ing.product.cat as Category] || "•"}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: ing.isStar ? "#5a7460" : "#1c1810",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {ing.product.name}
                        {ing.isStar ? " ★" : ""}
                      </div>
                      <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11, color: "#6e8b74", marginTop: 1 }}>
                        {ing.g}g
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <SectionTitle>Przygotowanie</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 22 }}>
                {meal.steps.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "#6e8b74",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div
                      style={{ fontSize: 14, color: "#1c1810", lineHeight: 1.6, paddingTop: 3 }}
                      dangerouslySetInnerHTML={{ __html: s }}
                    />
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "rgba(110,139,116,0.1)",
                  border: "1px solid rgba(110,139,116,0.3)",
                  borderRadius: 10,
                  padding: "12px 14px",
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    color: "#5a7460",
                    marginBottom: 4,
                  }}
                >
                  💡 Wskazówka
                </div>
                <div style={{ fontSize: 13, color: "#5a5040", lineHeight: 1.55 }}>{meal.tip}</div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 14, borderTop: "1px solid #d8d0bc" }}>
                <button
                  onClick={clearSelected}
                  style={{
                    padding: "10px 16px",
                    border: "1.5px solid #d8d0bc",
                    borderRadius: 9,
                    background: "#f5f0e6",
                    color: "#5a5040",
                    fontFamily: "inherit",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  ← Zmień składnik
                </button>
                <button
                  onClick={createMeal}
                  style={{
                    padding: "10px 16px",
                    border: "1.5px solid #8b4fd1",
                    borderRadius: 9,
                    background: "rgba(139,79,209,0.08)",
                    color: "#8b4fd1",
                    fontFamily: "inherit",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ↻ Inny wariant
                </button>
                {savedId ? (
                  <button
                    onClick={() => setLocation(`/przepis/${savedId}`)}
                    style={{
                      padding: "10px 16px",
                      border: "1.5px solid #6e8b74",
                      borderRadius: 9,
                      background: "#6e8b74",
                      color: "#fff",
                      fontFamily: "inherit",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    ✓ Zapisano · zobacz przepis →
                  </button>
                ) : (
                  <button
                    onClick={saveToMyRecipes}
                    style={{
                      padding: "10px 16px",
                      border: "1.5px solid #6e8b74",
                      borderRadius: 9,
                      background: "rgba(110,139,116,0.1)",
                      color: "#5a7460",
                      fontFamily: "inherit",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    💾 Zapisz w Moich przepisach
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PLANER DISH RESULT */}
        {planerDish && (
          <div
            style={{
              background: "#fffdf8",
              border: "1.5px solid #d8d0bc",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(28,24,16,0.13)",
              marginTop: 14,
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #ede7d9 0%, #e6dec8 100%)",
                padding: "22px 22px 18px",
                borderBottom: "1px solid #d8d0bc",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: 16,
                  top: 12,
                  fontSize: 44,
                  opacity: 0.12,
                  pointerEvents: "none",
                }}
              >
                🍽️
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#5a7460",
                  marginBottom: 6,
                }}
              >
                Z Planera · {planerDish.opis}
              </div>
              <div
                style={{
                  fontFamily: "Georgia, 'Playfair Display', serif",
                  fontSize: "clamp(19px, 3vw, 26px)",
                  fontWeight: 700,
                  color: "#1c1810",
                  lineHeight: 1.2,
                }}
              >
                {planerDish.nazwa}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                  fontSize: 12,
                  color: "#5a5040",
                  marginTop: 8,
                }}
              >
                <span>⏱ {planerDish.czas} min</span>
                <span>🔥 {planerDish.kcal} kcal</span>
                <span>B {planerDish.B} g</span>
                <span>T {planerDish.T} g</span>
                <span>W {planerDish.W} g</span>
              </div>
            </div>

            <div style={{ padding: "20px 22px" }}>
              <SectionTitle>Składniki</SectionTitle>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  gap: 6,
                  marginBottom: 22,
                }}
              >
                {planerDish.skladniki
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((s, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#f5f0e6",
                        border: "1px solid #d8d0bc",
                        borderRadius: 10,
                        padding: "9px 12px",
                        fontSize: 13,
                        color: "#1c1810",
                      }}
                    >
                      {s}
                    </div>
                  ))}
              </div>

              <SectionTitle>Przygotowanie</SectionTitle>
              <div
                style={{
                  fontSize: 14,
                  color: "#1c1810",
                  lineHeight: 1.6,
                  marginBottom: 22,
                  whiteSpace: "pre-wrap",
                }}
              >
                {planerDish.przygotowanie}
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 14, borderTop: "1px solid #d8d0bc" }}>
                <button
                  onClick={clearSelected}
                  style={{
                    padding: "10px 16px",
                    border: "1.5px solid #d8d0bc",
                    borderRadius: 9,
                    background: "#f5f0e6",
                    color: "#5a5040",
                    fontFamily: "inherit",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  ← Wróć
                </button>
                {planerSavedId ? (
                  <button
                    onClick={() => setLocation(`/przepis/${planerSavedId}`)}
                    style={{
                      padding: "10px 16px",
                      border: "1.5px solid #6e8b74",
                      borderRadius: 9,
                      background: "#6e8b74",
                      color: "#fff",
                      fontFamily: "inherit",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    ✓ Zapisano · zobacz przepis →
                  </button>
                ) : (
                  <button
                    onClick={savePlanerToMyRecipes}
                    style={{
                      padding: "10px 16px",
                      border: "1.5px solid #6e8b74",
                      borderRadius: 9,
                      background: "rgba(110,139,116,0.1)",
                      color: "#5a7460",
                      fontFamily: "inherit",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    💾 Zapisz w Moich przepisach
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DISH-NAME AI LOADING */}
        {dishLoading && !dishRecipe && (
          <div
            style={{
              background: "#fffdf8",
              border: "1.5px dashed #8b4fd1",
              borderRadius: 14,
              padding: "30px 22px",
              marginTop: 14,
              textAlign: "center",
              color: "#8b4fd1",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <span className="pp-sparkle-pulse" style={{ display: "inline-block" }}>✨</span>
            {" "}Generuję przepis na „{dishName}"…
            <div style={{ fontSize: 12, color: "#9a8e78", marginTop: 8 }}>
              To może chwilę potrwać.
            </div>
            <style>{`@keyframes pp-sparkle-pulse {
              0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
              25% { opacity: 0.35; transform: scale(0.85) rotate(-8deg); }
              50% { opacity: 1; transform: scale(1.15) rotate(8deg); }
              75% { opacity: 0.55; transform: scale(0.95) rotate(-4deg); }
            }
            .pp-sparkle-pulse { animation: pp-sparkle-pulse 1.1s ease-in-out infinite; }`}</style>
          </div>
        )}

        {/* DISH-NAME AI RESULT */}
        {dishRecipe && (
          <div
            ref={dishResultRef}
            style={{
              background: "#fffdf8",
              border: "1.5px solid #d8d0bc",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(28,24,16,0.13)",
              marginTop: 14,
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #ede4f7 0%, #e0d3f1 100%)",
                padding: "22px 22px 18px",
                borderBottom: "1px solid #d8c5ec",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: 16,
                  top: 12,
                  fontSize: 44,
                  opacity: 0.2,
                  pointerEvents: "none",
                }}
              >
                {dishRecipe.emoji}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#8b4fd1",
                  marginBottom: 6,
                }}
              >
                ✨ Wygenerowane przez AI · {dishRecipe.category}
              </div>
              <div
                style={{
                  fontFamily: "Georgia, 'Playfair Display', serif",
                  fontSize: "clamp(19px, 3vw, 26px)",
                  fontWeight: 700,
                  color: "#1c1810",
                  lineHeight: 1.2,
                }}
              >
                {dishRecipe.title}
              </div>
              {dishRecipe.description && (
                <div style={{ fontSize: 13, color: "#5a5040", marginTop: 8, lineHeight: 1.5 }}>
                  {dishRecipe.description}
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                  fontSize: 12,
                  color: "#5a5040",
                  marginTop: 10,
                }}
              >
                <span>⏱ {dishRecipe.prepTime}</span>
                <span>👥 {dishRecipe.servings} porcje</span>
                <span>📊 {dishRecipe.difficulty}</span>
              </div>
            </div>

            <div style={{ padding: "20px 22px" }}>
              {dishRecipe.ingredients.length > 0 && (
                <>
                  <SectionTitle>Składniki</SectionTitle>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                      gap: 6,
                      marginBottom: 22,
                    }}
                  >
                    {dishRecipe.ingredients.map((ing, i) => (
                      <div
                        key={i}
                        style={{
                          background: "#f5f0e6",
                          border: "1px solid #d8d0bc",
                          borderRadius: 10,
                          padding: "9px 12px",
                          fontSize: 13,
                          color: "#1c1810",
                        }}
                      >
                        {ing}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {dishRecipe.steps.length > 0 && (
                <>
                  <SectionTitle>Przygotowanie</SectionTitle>
                  <ol
                    style={{
                      margin: 0,
                      paddingLeft: 20,
                      marginBottom: 22,
                      fontSize: 14,
                      color: "#1c1810",
                      lineHeight: 1.6,
                    }}
                  >
                    {dishRecipe.steps.map((s, i) => (
                      <li key={i} style={{ marginBottom: 6 }}>
                        {s}
                      </li>
                    ))}
                  </ol>
                </>
              )}

              {dishRecipe.notes && (
                <>
                  <SectionTitle>Wskazówka</SectionTitle>
                  <div
                    style={{
                      background: "rgba(139,79,209,0.06)",
                      border: "1px solid rgba(139,79,209,0.2)",
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 13,
                      color: "#5a5040",
                      lineHeight: 1.5,
                      marginBottom: 22,
                    }}
                  >
                    {dishRecipe.notes}
                  </div>
                </>
              )}

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  paddingTop: 14,
                  borderTop: "1px solid #d8d0bc",
                }}
              >
                <button
                  onClick={clearDishResult}
                  style={{
                    padding: "10px 16px",
                    border: "1.5px solid #d8d0bc",
                    borderRadius: 9,
                    background: "#f5f0e6",
                    color: "#5a5040",
                    fontFamily: "inherit",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  ✕ Zamknij
                </button>
                <button
                  onClick={generateFromName}
                  disabled={dishLoading}
                  style={{
                    padding: "10px 16px",
                    border: "1.5px solid #8b4fd1",
                    borderRadius: 9,
                    background: "rgba(139,79,209,0.08)",
                    color: "#8b4fd1",
                    fontFamily: "inherit",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: dishLoading ? "default" : "pointer",
                  }}
                >
                  ↻ Wygeneruj ponownie
                </button>
                {dishSavedId ? (
                  <button
                    onClick={() => setLocation(`/przepis/${dishSavedId}`)}
                    style={{
                      padding: "10px 16px",
                      border: "1.5px solid #6e8b74",
                      borderRadius: 9,
                      background: "#6e8b74",
                      color: "#fff",
                      fontFamily: "inherit",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      flex: 1,
                      minWidth: 200,
                      textAlign: "center",
                    }}
                  >
                    ✓ Zapisano · zobacz przepis →
                  </button>
                ) : (
                  <button
                    onClick={saveDishToMyRecipes}
                    style={{
                      padding: "10px 16px",
                      border: "1.5px solid #6e8b74",
                      borderRadius: 9,
                      background: "rgba(110,139,116,0.1)",
                      color: "#5a7460",
                      fontFamily: "inherit",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      flex: 1,
                      minWidth: 200,
                      textAlign: "center",
                    }}
                  >
                    💾 Zapisz w Moich przepisach
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "1.2px",
        textTransform: "uppercase",
        color: "#6e8b74",
        marginBottom: 11,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {children}
      <div style={{ flex: 1, height: 1, background: "rgba(110,139,116,0.25)" }} />
    </div>
  );
}
