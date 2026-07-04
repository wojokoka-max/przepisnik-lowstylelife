import { Router } from "express";

const router = Router();

// ---------------------------------------------------------------------------
// HTML utilities
// ---------------------------------------------------------------------------

function decodeEntities(text: string): string {
  return text
    .replace(/&#xa0;/gi, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(parseInt(n, 10)));
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function extractMeta(html: string, property: string): string {
  const match = html.match(new RegExp(`${property}" content="([^"]+)"`));
  return match ? decodeEntities(match[1]).trim() : "";
}

/**
 * Extract all div text contents from a section of HTML.
 * Skips divs that contain nested div tags (container divs).
 */
function extractDivTexts(sectionHtml: string): string[] {
  const items: string[] = [];
  const divRegex = /<div[^>]*>([\s\S]*?)<\/div>/gi;
  let match;
  while ((match = divRegex.exec(sectionHtml)) !== null) {
    const inner = match[1];
    if (/<div/i.test(inner)) continue;
    const text = stripTags(inner);
    if (text.length > 1 && !/^[\s\u00a0]+$/.test(text)) {
      items.push(text);
    }
  }
  return items;
}

/**
 * Extract list item texts from <ul>/<ol> in a section.
 */
function extractListTexts(sectionHtml: string): string[] {
  const items: string[] = [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match;
  while ((match = liRegex.exec(sectionHtml)) !== null) {
    const text = stripTags(match[1]);
    if (text.length > 1) items.push(text);
  }
  return items;
}

/**
 * Returns the HTML between a heading matching `headingPattern`
 * and the next heading tag.
 */
function getSectionAfterHeading(html: string, headingPattern: RegExp): string {
  const headingMatch = html.match(headingPattern);
  if (!headingMatch || headingMatch.index === undefined) return "";

  const afterHeading = html.slice(headingMatch.index + headingMatch[0].length);
  const nextHeadingIdx = afterHeading.search(/<h[1-6][^>]*>/i);
  return nextHeadingIdx !== -1 ? afterHeading.slice(0, nextHeadingIdx) : afterHeading;
}

interface ParsedRecipe {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
}

function parseRecipe(html: string): ParsedRecipe {
  const ogTitle = extractMeta(html, "og:title")
    .replace(/\s*\|\s*LowStyleLife.*$/i, "")
    .trim();
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const title =
    ogTitle ||
    (h1Match ? stripTags(h1Match[1]) : "") ||
    "Nowy przepis";

  const description = extractMeta(html, "og:description");

  // --- Ingredients ---
  // Match the specific "Składniki:" heading (with colon) to skip the broader
  // section title like "Składniki na <dish name>" that appears before it.
  const ingredientsSection = getSectionAfterHeading(
    html,
    /<h[1-6][^>]*>[^<]*Sk.adniki\s*:[^<]*<\/h[1-6]>/i,
  );

  let ingredients: string[] = [];
  if (ingredientsSection) {
    const listItems = extractListTexts(ingredientsSection);
    if (listItems.length > 0) {
      ingredients = listItems;
    } else {
      ingredients = extractDivTexts(ingredientsSection);
    }
  }

  // --- Steps ---
  // Look for headings containing "Przygotowanie" or "Sposób"
  const stepsSection = getSectionAfterHeading(
    html,
    /<h[1-6][^>]*>[^<]*(Przygotowanie|Sposób przygotowania)[^<]*<\/h[1-6]>/i,
  );

  let steps: string[] = [];
  if (stepsSection) {
    const listItems = extractListTexts(stepsSection);
    if (listItems.length > 0) {
      steps = listItems;
    } else {
      steps = extractDivTexts(stepsSection);
    }
  }

  return { title, description, ingredients, steps };
}

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

router.get("/fetch-url", async (req, res) => {
  const url = req.query.url as string;

  if (!url) {
    res.status(400).json({ ok: false, error: "Brak parametru URL" });
    return;
  }

  try {
    new URL(url);
  } catch {
    res.status(400).json({ ok: false, error: "Nieprawidłowy URL" });
    return;
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; PrzepisnikBot/1.0; +https://lowstylelife.art)",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "pl,en;q=0.9",
      },
      signal: AbortSignal.timeout(15000),
      redirect: "follow",
    });

    if (!response.ok) {
      res
        .status(502)
        .json({ ok: false, error: `Serwer odpowiedział: ${response.status}` });
      return;
    }

    const html = await response.text();
    const parsed = parseRecipe(html);

    res.json({ ok: true, ...parsed, finalUrl: response.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Nieznany błąd";
    res
      .status(502)
      .json({ ok: false, error: `Nie można pobrać strony: ${msg}` });
  }
});

export default router;
