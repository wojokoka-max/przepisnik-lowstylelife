// 1:1 port z webowego artifacts/przepisnik/src/data/recipes.ts

const POLISH_MAP: Record<string, string> = {
  ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z",
  Ą: "a", Ć: "c", Ę: "e", Ł: "l", Ń: "n", Ó: "o", Ś: "s", Ź: "z", Ż: "z",
};

export function generateSlug(title: string): string {
  const base = title
    .split("")
    .map((ch) => POLISH_MAP[ch] ?? ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `przepis-${Date.now()}`;
}

export interface Recipe {
  id: string;
  slug?: string;
  title: string;
  description: string;
  category: string;
  prepTime: string;
  servings: number;
  difficulty: "łatwy" | "średni" | "trudny";
  ingredients: string[];
  steps: string[];
  emoji: string;
  notes?: string;
  handwrittenNote?: string;
  images?: string[];
  ocrText?: string;
  sourceUrl?: string;
  isDraft?: boolean;
  isFavorite?: boolean;
}

// Brak preinstalowanych przepisów — wszystko od użytkownika.
export const recipes: Recipe[] = [];
