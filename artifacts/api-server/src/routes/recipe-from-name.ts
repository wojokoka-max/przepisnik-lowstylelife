import { Router, Request, Response } from "express";
import OpenAI from "openai";

const router = Router();

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const MAX_NAME_LEN = 300;
const ALLOWED_CATEGORIES = [
  "Dania główne",
  "Zupy",
  "Desery",
  "Śniadania",
  "Pieczywo",
  "Przetwory",
  "Świąteczne",
];
const ALLOWED_DIFFICULTIES = ["łatwy", "średni", "trudny"] as const;

const SYSTEM_PROMPT = `Jesteś polskim doświadczonym kucharzem i autorem przepisów.
Użytkownik podaje pełną nazwę dania (np. "Krewetki w sosie kokosowo-limonkowym").
Twoim zadaniem jest stworzyć kompletny, realistyczny domowy przepis na to danie.

Cały tekst po polsku. Zwróć WYŁĄCZNIE poprawny JSON.

Kategorie do wyboru (wybierz jedną najlepiej pasującą):
"Dania główne", "Zupy", "Desery", "Śniadania", "Pieczywo", "Przetwory", "Świąteczne".

Format JSON:
{
  "title": "string — pełna nazwa dania",
  "description": "string — krótki opis (1-2 zdania, max 160 znaków)",
  "category": "jedna z dozwolonych kategorii",
  "prepTime": "string — np. '30 min'",
  "servings": liczba — porcje (zwykle 2-4),
  "difficulty": "łatwy" | "średni" | "trudny",
  "ingredients": ["string", ...] — każdy składnik z ilością, np. "200 g krewetek",
  "steps": ["string", ...] — kolejne kroki przygotowania, każdy jako pełne zdanie/akapit,
  "emoji": "string — pojedynczy emoji pasujący do dania",
  "notes": "string — krótka rada lub wskazówka (opcjonalnie pusty)"
}`;

router.post("/", async (req: Request, res: Response) => {
  try {
    const body = (req.body && typeof req.body === "object" ? req.body : {}) as Record<string, unknown>;
    const rawName = typeof body.name === "string" ? body.name : "";
    const name = rawName.trim().slice(0, MAX_NAME_LEN);

    if (!name) {
      res.status(400).json({ error: "Brak nazwy dania." });
      return;
    }

    const client = getClient();

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Nazwa dania: ${name}` },
      ],
      max_tokens: 1500,
    });

    const rawText = response.choices[0]?.message?.content ?? "{}";

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      console.error("Niepoprawny JSON od modelu:", rawText);
      res.status(500).json({ error: "Model nie zwrócił poprawnego formatu. Spróbuj ponownie." });
      return;
    }

    const safeStr = (v: unknown, fb = ""): string => (typeof v === "string" ? v : fb);
    const safeNum = (v: unknown, fb = 2): number =>
      typeof v === "number" && Number.isFinite(v) && v > 0 ? Math.round(v) : fb;
    const safeArr = (v: unknown): string[] =>
      Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim().length > 0) : [];

    const cat = safeStr(parsed.category);
    const diff = safeStr(parsed.difficulty);

    res.json({
      title:       safeStr(parsed.title, name),
      description: safeStr(parsed.description, ""),
      category:    ALLOWED_CATEGORIES.includes(cat) ? cat : "Dania główne",
      prepTime:    safeStr(parsed.prepTime, "30 min"),
      servings:    safeNum(parsed.servings, 2),
      difficulty:  (ALLOWED_DIFFICULTIES as readonly string[]).includes(diff) ? diff : "średni",
      ingredients: safeArr(parsed.ingredients),
      steps:       safeArr(parsed.steps),
      emoji:       safeStr(parsed.emoji, "🍽️"),
      notes:       safeStr(parsed.notes, ""),
    });
  } catch (err: unknown) {
    console.error("[recipe-from-name]", err);
    const status = (err as { status?: number })?.status;

    if (status === 429) {
      res.status(402).json({
        error: "Brak kredytów OpenAI. Doładuj konto na platform.openai.com/settings/billing i spróbuj ponownie.",
      });
      return;
    }

    if (status === 401) {
      res.status(401).json({ error: "Nieprawidłowy klucz OpenAI. Sprawdź ustawienia." });
      return;
    }

    res.status(500).json({ error: "Błąd generowania przepisu. Spróbuj ponownie." });
  }
});

export default router;
