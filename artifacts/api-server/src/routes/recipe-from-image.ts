import { Router, Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const router = Router();

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const upload = multer({
  dest: UPLOADS_DIR,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Tylko pliki graficzne są obsługiwane"));
  },
});

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function cleanup(filePath?: string) {
  if (filePath && fs.existsSync(filePath)) {
    try { fs.unlinkSync(filePath); } catch { /* ignore */ }
  }
}

router.post(
  "/",
  upload.single("image"),
  async (req: Request, res: Response) => {
    const filePath = req.file?.path;

    try {
      if (!req.file || !filePath) {
        res.status(400).json({ error: "Brak pliku." });
        return;
      }

      const imageBuffer = fs.readFileSync(filePath);
      const base64Image = imageBuffer.toString("base64");
      const mimeType    = req.file.mimetype;

      const client = getClient();

      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Jesteś ekspertem OCR specjalizującym się w odczytywaniu odręcznych notatek kulinarnych po polsku.
Twoim zadaniem jest odczytać przepis ze zdjęcia — może to być notatka odręczna, wydruk, zrzut ekranu lub strona z książki kucharskiej.
Starannie odczytaj każde słowo, nawet jeśli pismo jest niewyraźne — zgaduj na podstawie kontekstu kulinarnego.

Zwróć WYŁĄCZNIE poprawny JSON bez żadnego formatowania markdown ani dodatkowego tekstu. Żadnych komentarzy przed ani po JSON.

ZASADY (bardzo ważne):
- "ingredients" zawiera WYŁĄCZNIE składniki (co i ile), każdy jako osobny krótki string, np. "200g mąki", "3 jajka"
- "preparation" zawiera WYŁĄCZNIE kolejne kroki przygotowania, każdy krok jako osobny string
- NIE wrzucaj całego tekstu jako jeden element — każda pozycja to JEDNA linijka / JEDEN krok
- NIE duplikuj treści między polami — to co jest w ingredients nie może być w preparation i odwrotnie
- Jeśli czegoś nie widać, zostaw pustą listę []

Format: {"title":"","ingredients":[],"preparation":[]}`,
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                  detail: "high",
                },
              },
              {
                type: "text",
                text: "Odczytaj ten przepis i zwróć strukturę JSON zgodnie z instrukcją. Podziel składniki i kroki na osobne elementy listy.",
              },
            ],
          },
        ],
        max_tokens: 2000,
      });

      cleanup(filePath);

      const rawText = response.choices[0]?.message?.content ?? "{}";

      const cleaned = rawText
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/gi, "")
        .trim();

      let parsed: { title?: string; ingredients?: string[]; preparation?: string[] };
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        console.error("Niepoprawny JSON od modelu:", rawText);
        res.status(500).json({ error: "Model nie zwrócił poprawnego formatu. Spróbuj ponownie." });
        return;
      }

      res.json({
        title:       parsed.title       ?? "",
        ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : [],
        preparation: Array.isArray(parsed.preparation) ? parsed.preparation : [],
      });
    } catch (err: any) {
      cleanup(filePath);
      console.error("[recipe-from-image]", err);

      if (err?.status === 429) {
        res.status(402).json({
          error: "Brak kredytów OpenAI. Doładuj konto na platform.openai.com/settings/billing i spróbuj ponownie.",
        });
        return;
      }

      if (err?.status === 401) {
        res.status(401).json({
          error: "Nieprawidłowy klucz OpenAI. Sprawdź ustawienia.",
        });
        return;
      }

      res.status(500).json({ error: "Błąd przetwarzania zdjęcia. Spróbuj ponownie." });
    }
  }
);

export default router;
