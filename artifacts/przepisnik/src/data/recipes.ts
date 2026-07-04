// ---------------------------------------------------------------------------
// Polish slug generator
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Recipe type
// ---------------------------------------------------------------------------

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
  images?: string[];
  ocrText?: string;
  sourceUrl?: string;
  isDraft?: boolean;
  isFavorite?: boolean;
}

// ---------------------------------------------------------------------------
// Built-in recipes — intentionally empty; all recipes come from the user
// ---------------------------------------------------------------------------

export const recipes: Recipe[] = [];
