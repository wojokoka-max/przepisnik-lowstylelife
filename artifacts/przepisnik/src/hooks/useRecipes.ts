import { useState, useEffect } from "react";
import { recipes as staticRecipes, type Recipe } from "@/data/recipes";

const CUSTOM_KEY = "przepisnik-custom-recipes";
const PATCHES_KEY = "przepisnik-patches";
const DELETED_KEY = "przepisnik-deleted";

function loadCustom(): Recipe[] {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    return raw ? (JSON.parse(raw) as Recipe[]) : [];
  } catch {
    return [];
  }
}

function loadPatches(): Record<string, Recipe> {
  try {
    const raw = localStorage.getItem(PATCHES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Recipe>) : {};
  } catch {
    return {};
  }
}

function loadDeleted(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function useRecipes() {
  const [custom, setCustom] = useState<Recipe[]>(loadCustom);
  const [patches, setPatches] = useState<Record<string, Recipe>>(loadPatches);
  const [deleted, setDeleted] = useState<Set<string>>(loadDeleted);

  useEffect(() => {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
  }, [custom]);

  useEffect(() => {
    localStorage.setItem(PATCHES_KEY, JSON.stringify(patches));
  }, [patches]);

  useEffect(() => {
    localStorage.setItem(DELETED_KEY, JSON.stringify([...deleted]));
  }, [deleted]);

  const allRecipes: Recipe[] = [
    ...staticRecipes
      .filter((r) => !deleted.has(r.id))
      .map((r) => patches[r.id] ?? r),
    ...custom
      .filter((r) => !deleted.has(r.id))
      .map((r) => patches[r.id] ?? r),
  ];

  function addRecipe(recipe: Recipe) {
    setCustom((prev) => [recipe, ...prev]);
  }

  function updateRecipe(updated: Recipe) {
    setPatches((prev) => ({ ...prev, [updated.id]: updated }));
  }

  function deleteRecipe(id: string) {
    setDeleted((prev) => new Set([...prev, id]));
    setCustom((prev) => prev.filter((r) => r.id !== id));
  }

  return { allRecipes, addRecipe, updateRecipe, deleteRecipe };
}
