import type { Recipe } from "@/data/recipes";

interface RecipeJsonLd {
  "@type"?: string | string[];
  name?: string;
  description?: string;
  recipeIngredient?: string[];
  recipeInstructions?: unknown;
  totalTime?: string;
  prepTime?: string;
  cookTime?: string;
  recipeYield?: string | number;
  image?: string | { url?: string } | Array<string | { url?: string }>;
}

function extractJsonLd(doc: Document): RecipeJsonLd | null {
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
  for (const script of scripts) {
    try {
      const raw = JSON.parse(script.textContent ?? "");
      const candidates: RecipeJsonLd[] = Array.isArray(raw)
        ? raw
        : raw["@graph"]
        ? raw["@graph"]
        : [raw];
      for (const item of candidates) {
        const type = item["@type"];
        const types = Array.isArray(type) ? type : [type ?? ""];
        if (types.some((t) => t.toLowerCase().includes("recipe"))) {
          return item;
        }
      }
    } catch {
      // ignore malformed JSON
    }
  }
  return null;
}

function parseIso8601Duration(iso: string): string {
  const match = iso.match(/PT?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
  if (!match) return "—";
  const h = parseInt(match[1] ?? "0");
  const m = parseInt(match[2] ?? "0");
  if (h && m) return `${h} h ${m} min`;
  if (h) return `${h} h`;
  if (m) return `${m} min`;
  return "—";
}

function normaliseInstructions(raw: unknown): string[] {
  if (!raw) return [];
  if (typeof raw === "string") {
    return raw
      .split(/\n|\.(?=\s)/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (Array.isArray(raw)) {
    return raw.flatMap((item) => {
      if (typeof item === "string") return [item.trim()];
      if (typeof item === "object" && item !== null) {
        const obj = item as Record<string, unknown>;
        const text = (obj.text ?? obj.name ?? "") as string;
        return [text.trim()];
      }
      return [];
    }).filter(Boolean);
  }
  return [];
}

function extractBodyText(doc: Document): string {
  const remove = doc.querySelectorAll(
    "script, style, nav, header, footer, aside, [role='navigation'], [role='banner']"
  );
  remove.forEach((el) => el.remove());

  const main =
    doc.querySelector("main, article, [role='main'], .recipe, #recipe, .entry-content") ??
    doc.body;

  return (main?.textContent ?? "")
    .replace(/\s{3,}/g, "\n\n")
    .trim()
    .slice(0, 5000);
}

export function parseRecipeFromHtml(
  html: string,
  sourceUrl: string
): Partial<Recipe> & { rawText: string } {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const rawText = extractBodyText(doc);

  const ld = extractJsonLd(doc);

  if (ld) {
    const title = ld.name?.trim() || doc.title.trim() || "Nowy przepis z linku";
    const description = ld.description?.trim() ?? "";
    const ingredients = (ld.recipeIngredient ?? []).map((s) => s.trim());
    const steps = normaliseInstructions(ld.recipeInstructions);
    const prepTime =
      parseIso8601Duration(ld.totalTime ?? ld.prepTime ?? ld.cookTime ?? "") ?? "—";
    const servingsRaw =
      typeof ld.recipeYield === "number"
        ? ld.recipeYield
        : parseInt(String(ld.recipeYield ?? "1")) || 1;

    return {
      title,
      description,
      ingredients,
      steps,
      prepTime,
      servings: servingsRaw,
      rawText,
    };
  }

  return {
    title: doc.title.trim() || "Nowy przepis z linku",
    description: "",
    ingredients: [],
    steps: [],
    prepTime: "—",
    servings: 1,
    rawText,
  };
}
