import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import { recipes as staticRecipes, type Recipe, generateSlug } from "@/data/recipes";

const CUSTOM_KEY    = "przepisnik-custom-recipes";
const PATCHES_KEY   = "przepisnik-patches";
const DELETED_KEY   = "przepisnik-deleted";
const FAVORITES_KEY = "przepisnik-favorites";
const VERSION_KEY   = "przepisnik-version";
const CURRENT_VERSION = "v2";

// One-time migration: clear all recipe data when the storage schema version
// changes so old, potentially incompatible entries do not interfere.
(function resetStorageIfNeeded() {
  try {
    if (localStorage.getItem(VERSION_KEY) !== CURRENT_VERSION) {
      localStorage.removeItem(CUSTOM_KEY);
      localStorage.removeItem(PATCHES_KEY);
      localStorage.removeItem(DELETED_KEY);
      localStorage.removeItem(FAVORITES_KEY);
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    }
  } catch { /* ignore — private-browsing or quota issues */ }
})();

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function migrateCategory(recipe: Recipe): Recipe {
  if (recipe.category === "Do opracowania" || recipe.category === "Screeny") {
    return { ...recipe, category: "Pobrane" };
  }
  return recipe;
}

// Ensure every recipe has a slug — generated from its title if missing.
function withSlug(recipe: Recipe): Recipe {
  if (recipe.slug) return recipe;
  return { ...recipe, slug: generateSlug(recipe.title) };
}

function stripImages<T extends Partial<Recipe>>(recipe: T): T {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { images: _images, ...rest } = recipe as Recipe;
  return rest as T;
}

function safeSetItem(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* quota exceeded — silent */ }
}

// ---------------------------------------------------------------------------
// loaders — called once on mount
// ---------------------------------------------------------------------------

function loadCustom(): Recipe[] {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    const list = raw ? (JSON.parse(raw) as Recipe[]) : [];
    return list.map((r) => migrateCategory(stripImages(r)));
  } catch { return []; }
}

function loadPatches(): Record<string, Partial<Recipe>> {
  try {
    const raw = localStorage.getItem(PATCHES_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, Partial<Recipe>>) : {};
    return Object.fromEntries(
      Object.entries(map).map(([k, v]) => [k, migrateCategory(stripImages(v as Recipe))])
    );
  } catch { return {}; }
}

function loadDeleted(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch { return new Set(); }
}

function loadFavoritesMap(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch { return {}; }
}

// ---------------------------------------------------------------------------
// context type
// ---------------------------------------------------------------------------

interface RecipesContextValue {
  allRecipes: Recipe[];
  favorites: Set<string>;
  addRecipe:      (recipe: Recipe) => void;
  updateRecipe:   (recipe: Recipe) => void;
  deleteRecipe:   (id: string) => void;
  toggleFavorite: (id: string) => void;
}

const RecipesContext = createContext<RecipesContextValue | null>(null);

// ---------------------------------------------------------------------------
// provider
// ---------------------------------------------------------------------------

export function RecipesProvider({ children }: { children: ReactNode }) {
  const [custom,       setCustom]       = useState<Recipe[]>(loadCustom);
  const [patches,      setPatches]      = useState<Record<string, Partial<Recipe>>>(loadPatches);
  const [deleted,      setDeleted]      = useState<Set<string>>(loadDeleted);
  const [favoritesMap, setFavoritesMap] = useState<Record<string, boolean>>(loadFavoritesMap);

  // refs so the effects below always see the latest value without being deps
  const favoritesMapRef = useRef(favoritesMap);
  favoritesMapRef.current = favoritesMap;

  // --- persist custom recipes ---
  useEffect(() => {
    safeSetItem(CUSTOM_KEY, JSON.stringify(custom.map(stripImages)));
  }, [custom]);

  // --- persist patches (recipe edits, NOT favorites) ---
  useEffect(() => {
    const lightweight = Object.fromEntries(
      Object.entries(patches).map(([k, v]) => [k, stripImages(v as Recipe)])
    );
    safeSetItem(PATCHES_KEY, JSON.stringify(lightweight));
  }, [patches]);

  // --- persist deleted list ---
  useEffect(() => {
    safeSetItem(DELETED_KEY, JSON.stringify([...deleted]));
  }, [deleted]);

  // --- persist favorites map ---
  useEffect(() => {
    safeSetItem(FAVORITES_KEY, JSON.stringify(favoritesMap));
  }, [favoritesMap]);

  // ---------------------------------------------------------------------------
  // derived state — computed every render from the four sources of truth
  // ---------------------------------------------------------------------------

  const allRecipes: Recipe[] = [
    ...staticRecipes
      .filter((r) => !deleted.has(r.id))
      .map((r) => {
        const base = patches[r.id] ? { ...r, ...patches[r.id] } : r;
        return withSlug({ ...base, isFavorite: favoritesMap[r.id] === true });
      }),
    ...custom
      .filter((r) => !deleted.has(r.id))
      .map((r) => {
        const base = patches[r.id] ? { ...r, ...patches[r.id] } : r;
        return withSlug({ ...base, isFavorite: favoritesMap[r.id] === true });
      }),
  ];

  // favorites Set — derived purely from favoritesMap (instant, no filtering allRecipes)
  const favorites = new Set<string>(
    Object.entries(favoritesMap)
      .filter(([, v]) => v === true)
      .map(([k]) => k)
  );

  // ---------------------------------------------------------------------------
  // actions
  // ---------------------------------------------------------------------------

  function addRecipe(recipe: Recipe) {
    setCustom((prev) => [recipe, ...prev]);
  }

  function updateRecipe(updated: Recipe) {
    // store only the delta against the base recipe to avoid clobbering isFavorite
    setPatches((prev) => ({ ...prev, [updated.id]: stripImages(updated) }));
  }

  function deleteRecipe(id: string) {
    setDeleted((prev) => new Set([...prev, id]));
    setCustom((prev) => prev.filter((r) => r.id !== id));
    // clean up favorite entry for deleted recipe
    setFavoritesMap((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function toggleFavorite(id: string) {
    setFavoritesMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      // write synchronously so a fast refresh won't lose the update
      safeSetItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <RecipesContext.Provider
      value={{ allRecipes, favorites, addRecipe, updateRecipe, deleteRecipe, toggleFavorite }}
    >
      {children}
    </RecipesContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// hook
// ---------------------------------------------------------------------------

export function useRecipes() {
  const ctx = useContext(RecipesContext);
  if (!ctx) throw new Error("useRecipes musi być użyty wewnątrz RecipesProvider");
  return ctx;
}
