import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useRecipes } from "@/context/RecipesContext";
import AddRecipeModal from "@/components/AddRecipeModal";
import { ArrowLeft, Clock, Users, ChefHat, StickyNote, Pencil, Trash2, FolderOpen, Star, Share2, Copy, Check, Link, ExternalLink } from "lucide-react";
import type { Recipe } from "@/data/recipes";

const difficultyColor: Record<string, string> = {
  "łatwy": "bg-green-100 text-green-700",
  "średni": "bg-amber-100 text-amber-700",
  "trudny": "bg-rose-100 text-rose-700",
};

const RECIPE_CATEGORIES = ["Dania główne", "Zupy", "Desery", "Śniadania", "Pieczywo", "Przetwory", "Świąteczne"];

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

function BottomSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            key="sheet-panel"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-background shadow-xl px-5 pb-10 pt-4 max-w-2xl mx-auto"
          >
            <div className="flex justify-center mb-5">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function PobraneDetailView({ recipe }: { recipe: Recipe }) {
  const [, navigate] = useLocation();
  const { updateRecipe, deleteRecipe, favorites, toggleFavorite } = useRecipes();
  const [editTitleOpen, setEditTitleOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [titleInput, setTitleInput] = useState(recipe.title);
  const isFav = favorites.has(recipe.id);

  function handleSaveTitle() {
    const trimmed = titleInput.trim();
    if (!trimmed) return;
    updateRecipe({ ...recipe, title: trimmed });
    setEditTitleOpen(false);
  }

  function handleMove(category: string) {
    updateRecipe({
      ...recipe,
      category,
      emoji: CATEGORY_EMOJI[category] ?? recipe.emoji,
      isDraft: false,
    });
    navigate("/");
  }

  function handleDelete() {
    deleteRecipe(recipe.id);
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-background" style={{ paddingTop: 100, overflowX: "hidden", width: "100%" }}>
      <div className="max-w-2xl mx-auto px-4 pt-5 pb-10">

        {/* Back */}
        <motion.button
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate("/")}
          aria-label="Powrót"
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-card-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-all mb-10"
        >
          <ArrowLeft size={17} />
        </motion.button>

        {/* Open source URL button */}
        {recipe.sourceUrl && (
          <motion.a
            href={recipe.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 w-full bg-primary/5 border border-primary/20 hover:bg-primary/10 rounded-2xl px-5 py-4 mb-6 transition-colors group"
            style={{ textDecoration: "none" }}
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Link size={15} className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary">Otwórz stronę źródłową</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {(() => { try { return new URL(recipe.sourceUrl).hostname.replace("www.", ""); } catch { return recipe.sourceUrl; } })()}
              </p>
            </div>
            <ExternalLink size={14} className="text-primary ml-auto flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </motion.a>
        )}

        {/* Title card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-card-border rounded-2xl px-6 py-6 mb-6 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold tracking-widest text-sky-500 uppercase mb-3">
                Pobrane
              </p>
              <h1 className="text-xl font-semibold text-foreground leading-snug">
                {recipe.title}
              </h1>
            </div>
            <button
              onClick={() => toggleFavorite(recipe.id)}
              aria-label={isFav ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
              className={`flex-shrink-0 mt-1 w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 ${
                isFav
                  ? "text-amber-400 bg-amber-50"
                  : "text-muted-foreground/40 hover:text-amber-300 hover:bg-amber-50"
              }`}
            >
              <Star size={18} fill={isFav ? "currentColor" : "none"} strokeWidth={isFav ? 0 : 1.5} />
            </button>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={() => { setTitleInput(recipe.title); setEditTitleOpen(true); }}
            className="w-full flex items-center gap-3 bg-card border border-card-border rounded-2xl px-5 py-4 hover:bg-accent/60 transition-colors group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Pencil size={15} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                Edytuj tytuł
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Zmień nazwę zapisanego przepisu</p>
            </div>
          </button>

          <button
            onClick={() => setMoveOpen(true)}
            className="w-full flex items-center gap-3 bg-card border border-card-border rounded-2xl px-5 py-4 hover:bg-accent/60 transition-colors group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
              <FolderOpen size={15} className="text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                Przenieś do kategorii
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Dodaj do swoich przepisów i opracuj</p>
            </div>
          </button>

          <button
            onClick={() => setConfirmDelete(true)}
            className="w-full flex items-center gap-3 bg-card border border-destructive/15 rounded-2xl px-5 py-4 hover:bg-destructive/5 transition-colors group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <Trash2 size={15} className="text-destructive" />
            </div>
            <div>
              <p className="text-sm font-semibold text-destructive">Usuń</p>
              <p className="text-xs text-muted-foreground mt-0.5">Usuń ten wpis z Pobrane</p>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Edit title sheet */}
      <BottomSheet open={editTitleOpen} onClose={() => setEditTitleOpen(false)}>
        <h2 className="text-base font-semibold text-foreground mb-5">Edytuj tytuł</h2>
        <input
          type="text"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
          placeholder="Tytuł przepisu"
          className="w-full rounded-xl border border-input bg-muted px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition mb-4"
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={handleSaveTitle}
            disabled={!titleInput.trim()}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:brightness-90 active:brightness-85 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            Zapisz
          </button>
          <button
            onClick={() => setEditTitleOpen(false)}
            className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
          >
            Anuluj
          </button>
        </div>
      </BottomSheet>

      {/* Move to category sheet */}
      <BottomSheet open={moveOpen} onClose={() => setMoveOpen(false)}>
        <h2 className="text-base font-semibold text-foreground mb-1">Przenieś do kategorii</h2>
        <p className="text-xs text-muted-foreground mb-5">
          Wybierz kategorię — przepis trafi do Twoich przepisów i będziesz mógł go uzupełnić.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {RECIPE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleMove(cat)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-card-border bg-card hover:bg-accent/60 hover:border-primary/30 transition-all group text-left"
            >
              <span className="text-base leading-none">{CATEGORY_EMOJI[cat]}</span>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {cat}
              </span>
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Delete confirmation sheet */}
      <BottomSheet open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <div className="flex flex-col items-center text-center gap-3 mb-7">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <Trash2 size={22} className="text-destructive" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Usuń wpis</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Czy na pewno chcesz usunąć ten wpis z Pobrane?<br />
            Tej operacji nie można cofnąć.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleDelete}
            className="w-full py-3 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Tak, usuń
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="w-full py-3 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
          >
            Anuluj
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}

function useShareRecipe() {
  const [copied, setCopied] = useState(false);

  async function share(recipe: Recipe) {
    const emoji = CATEGORY_EMOJI[recipe.category] ?? "🍽️";
    const ingredientsList = recipe.ingredients.map(i => `• ${i}`).join("\n");
    const stepsList = recipe.steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
    const notes = recipe.notes ? `\n\n📝 Notatki:\n${recipe.notes}` : "";
    const text = `${emoji} ${recipe.title}\n\n🧂 Składniki:\n${ingredientsList}\n\n👩‍🍳 Przygotowanie:\n${stepsList}${notes}\n\n— Przepiśnik LowStyleLife`;

    if (navigator.share) {
      try {
        await navigator.share({ title: recipe.title, text });
        return;
      } catch { /* user cancelled or error — fall through to clipboard */ }
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* ignore */ }
  }

  return { share, copied };
}

export default function RecipeDetail() {
  const params = useParams<{ id: string }>();
  const [location, navigate] = useLocation();
  const { allRecipes, updateRecipe, deleteRecipe, favorites, toggleFavorite } = useRecipes();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { share, copied } = useShareRecipe();

  // Extract the routing key from the URL.
  // useParams is preferred; useLocation is a reliable fallback for fresh Router mounts.
  const slugFromLocation = location.replace(/^\/przepis\//, "").split("?")[0].split("#")[0];
  const routeSlug = (params.id ?? slugFromLocation).trim();

  // Primary lookup by slug (the canonical URL field).
  // Fallback lookup by id handles old localStorage entries whose id equals the URL segment.
  const recipe =
    allRecipes.find(r => r.slug === routeSlug) ??
    allRecipes.find(r => r.id   === routeSlug);

  // If the recipe doesn't exist, redirect to the home list automatically.
  useEffect(() => {
    if (!recipe) navigate("/");
  }, [recipe, navigate]);

  if (!recipe) return null;

  if (recipe.category === "Pobrane") {
    return <PobraneDetailView recipe={recipe} />;
  }

  function handleSaveEdit(updated: Recipe) {
    updateRecipe(updated);
    setEditOpen(false);
  }

  function handleConfirmDelete() {
    if (!recipe) return;
    deleteRecipe(recipe.id);
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-background" style={{ paddingTop: 100, overflowX: "hidden", width: "100%" }}>
      <div className="max-w-2xl mx-auto px-4 pt-5 pb-10">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate("/")}
            aria-label="Powrót"
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-card-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
          >
            <ArrowLeft size={17} />
          </motion.button>

          <div className="flex items-center gap-2">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              onClick={() => toggleFavorite(recipe.id)}
              aria-label={favorites.has(recipe.id) ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
              className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200 ${
                favorites.has(recipe.id)
                  ? "text-amber-400 border-amber-200 bg-amber-50"
                  : "text-muted-foreground/50 border-card-border bg-card hover:text-amber-300 hover:border-amber-200 hover:bg-amber-50"
              }`}
            >
              <Star
                size={15}
                fill={favorites.has(recipe.id) ? "currentColor" : "none"}
                strokeWidth={favorites.has(recipe.id) ? 0 : 1.5}
              />
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.08 }}
              onClick={() => share(recipe)}
              aria-label="Udostępnij przepis"
              className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-xl transition-all"
            >
              {copied ? <Check size={13} /> : <Share2 size={13} />}
              {copied ? "Skopiowano!" : "Udostępnij"}
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={() => setEditOpen(true)}
              aria-label="Edytuj przepis"
              className="w-9 h-9 flex items-center justify-center text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 rounded-xl transition-all"
            >
              <Pencil size={15} />
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              onClick={() => setConfirmDelete(true)}
              aria-label="Usuń przepis"
              className="w-9 h-9 flex items-center justify-center text-destructive border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 rounded-xl transition-all"
            >
              <Trash2 size={15} />
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Title + emoji */}
          <div className="flex items-center gap-4 mb-5">
            <div className="text-5xl w-16 h-16 flex items-center justify-center bg-accent rounded-2xl flex-shrink-0">
              {CATEGORY_EMOJI[recipe.category] ?? "🍽️"}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground leading-tight">
                {recipe.title}
              </h1>
              {recipe.description && (
                <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                  {recipe.description}
                </p>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColor[recipe.difficulty]}`}>
              {recipe.difficulty}
            </span>
            {recipe.prepTime !== "—" && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                <Clock size={11} />
                {recipe.prepTime}
              </span>
            )}
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
              <Users size={11} />
              {recipe.servings} porcji
            </span>
          </div>

          <div className="h-px bg-border mb-7" />

          {/* Ingredients */}
          {recipe.ingredients.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                  <ChefHat size={13} className="text-primary-foreground" />
                </div>
                <h2 className="font-semibold text-foreground text-base">Składniki</h2>
              </div>
              <ul className="space-y-2.5">
                {recipe.ingredients.map((ingredient, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.12 + i * 0.04 }}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span className="text-foreground leading-relaxed">{ingredient}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* Steps */}
          {recipe.steps.length > 0 && (
            <>
              {recipe.ingredients.length > 0 && <div className="h-px bg-border mb-7" />}
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <h2 className="font-semibold text-foreground text-base mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center text-xs font-bold text-accent-foreground">
                    ✦
                  </div>
                  Sposób przygotowania
                </h2>
                <ol className="space-y-5">
                  {recipe.steps.map((step, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.22 + i * 0.06 }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                        {i + 1}
                      </div>
                      <p className="text-sm text-foreground leading-relaxed pt-0.5">{step}</p>
                    </motion.li>
                  ))}
                </ol>
              </motion.section>
            </>
          )}

          {/* Notes */}
          {recipe.notes && (
            <>
              <div className="h-px bg-border mb-7 mt-8" />
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-secondary rounded-md flex items-center justify-center">
                    <StickyNote size={13} className="text-secondary-foreground" />
                  </div>
                  <h2 className="font-semibold text-foreground text-base">Notatki</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic bg-secondary/60 rounded-xl px-4 py-3 border border-secondary whitespace-pre-wrap">
                  {recipe.notes}
                </p>
              </motion.section>
            </>
          )}

          <div className="mt-10 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center italic">
              Smacznego! 🍽️
            </p>
          </div>
        </motion.div>
      </div>

      {/* Delete confirmation sheet */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div
              key="del-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setConfirmDelete(false)}
            />
            <motion.div
              key="del-sheet"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-background shadow-xl px-5 pb-10 pt-4 max-w-2xl mx-auto"
            >
              <div className="flex justify-center mb-5">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>
              <div className="flex flex-col items-center text-center gap-3 mb-7">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Trash2 size={22} className="text-destructive" />
                </div>
                <h2 className="text-base font-semibold text-foreground">Usuń przepis</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Czy na pewno chcesz usunąć ten przepis?<br />
                  Tej operacji nie można cofnąć.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleConfirmDelete}
                  className="w-full py-3 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  Tak, usuń przepis
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="w-full py-3 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
                >
                  Anuluj
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AddRecipeModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveEdit}
        initialRecipe={recipe}
        mode="edit"
      />
    </div>
  );
}
