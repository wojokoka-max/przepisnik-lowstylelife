// Port z webowego artifacts/przepisnik/src/context/RecipesContext.tsx
// — localStorage zastąpiony przez AsyncStorage.

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { generateSlug, recipes as staticRecipes, type Recipe } from "../data/recipes";

const CUSTOM_KEY = "przepisnik-custom-recipes";
const PATCHES_KEY = "przepisnik-patches";
const DELETED_KEY = "przepisnik-deleted";
const FAVORITES_KEY = "przepisnik-favorites";
const VERSION_KEY = "przepisnik-version";
const CURRENT_VERSION = "v2";

function migrateCategory(recipe: Recipe): Recipe {
  if (recipe.category === "Do opracowania" || recipe.category === "Screeny") {
    return { ...recipe, category: "Pobrane" };
  }
  return recipe;
}

function withSlug(recipe: Recipe): Recipe {
  if (recipe.slug) return recipe;
  return { ...recipe, slug: generateSlug(recipe.title) };
}

function stripImages<T extends Partial<Recipe>>(recipe: T): T {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { images: _images, ...rest } = recipe as Recipe;
  return rest as T;
}

async function safeSetItem(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

interface RecipesContextValue {
  ready: boolean;
  allRecipes: Recipe[];
  favorites: Set<string>;
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

const RecipesContext = createContext<RecipesContextValue | null>(null);

export function RecipesProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [custom, setCustom] = useState<Recipe[]>([]);
  const [patches, setPatches] = useState<Record<string, Partial<Recipe>>>({});
  const [deleted, setDeleted] = useState<Set<string>>(new Set());
  const [favoritesMap, setFavoritesMap] = useState<Record<string, boolean>>({});

  const favoritesMapRef = useRef(favoritesMap);
  favoritesMapRef.current = favoritesMap;

  // ── Initial async load ────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // migracja schematu
        const ver = await AsyncStorage.getItem(VERSION_KEY);
        if (ver !== CURRENT_VERSION) {
          await AsyncStorage.multiRemove([CUSTOM_KEY, PATCHES_KEY, DELETED_KEY, FAVORITES_KEY]);
          await AsyncStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        }

        const [c, p, d, f] = await AsyncStorage.multiGet([
          CUSTOM_KEY,
          PATCHES_KEY,
          DELETED_KEY,
          FAVORITES_KEY,
        ]);

        if (cancelled) return;

        try {
          const list = c[1] ? (JSON.parse(c[1]) as Recipe[]) : [];
          setCustom(list.map((r) => migrateCategory(stripImages(r))));
        } catch {
          /* ignore */
        }

        try {
          const map = p[1] ? (JSON.parse(p[1]) as Record<string, Partial<Recipe>>) : {};
          setPatches(
            Object.fromEntries(
              Object.entries(map).map(([k, v]) => [k, migrateCategory(stripImages(v as Recipe))]),
            ),
          );
        } catch {
          /* ignore */
        }

        try {
          setDeleted(new Set(d[1] ? (JSON.parse(d[1]) as string[]) : []));
        } catch {
          /* ignore */
        }

        try {
          setFavoritesMap(f[1] ? (JSON.parse(f[1]) as Record<string, boolean>) : {});
        } catch {
          /* ignore */
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Persisters ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    safeSetItem(CUSTOM_KEY, JSON.stringify(custom.map(stripImages)));
  }, [custom, ready]);

  useEffect(() => {
    if (!ready) return;
    const lightweight = Object.fromEntries(
      Object.entries(patches).map(([k, v]) => [k, stripImages(v as Recipe)]),
    );
    safeSetItem(PATCHES_KEY, JSON.stringify(lightweight));
  }, [patches, ready]);

  useEffect(() => {
    if (!ready) return;
    safeSetItem(DELETED_KEY, JSON.stringify([...deleted]));
  }, [deleted, ready]);

  useEffect(() => {
    if (!ready) return;
    safeSetItem(FAVORITES_KEY, JSON.stringify(favoritesMap));
  }, [favoritesMap, ready]);

  // ── Derived ───────────────────────────────────────────────────────────────
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

  const favorites = new Set<string>(
    Object.entries(favoritesMap)
      .filter(([, v]) => v === true)
      .map(([k]) => k),
  );

  // ── Actions ───────────────────────────────────────────────────────────────
  function addRecipe(recipe: Recipe) {
    setCustom((prev) => [recipe, ...prev]);
  }

  function updateRecipe(updated: Recipe) {
    setPatches((prev) => ({ ...prev, [updated.id]: stripImages(updated) }));
  }

  function deleteRecipe(id: string) {
    setDeleted((prev) => new Set([...prev, id]));
    setCustom((prev) => prev.filter((r) => r.id !== id));
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
      safeSetItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <RecipesContext.Provider
      value={{ ready, allRecipes, favorites, addRecipe, updateRecipe, deleteRecipe, toggleFavorite }}
    >
      {children}
    </RecipesContext.Provider>
  );
}

export function useRecipes() {
  const ctx = useContext(RecipesContext);
  if (!ctx) throw new Error("useRecipes musi być użyty wewnątrz RecipesProvider");
  return ctx;
}
