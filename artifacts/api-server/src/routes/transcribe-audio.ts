import { Router, Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import OpenAI, { toFile } from "openai";

const router = Router();

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const upload = multer({
  dest: UPLOADS_DIR,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("audio/")) cb(null, true);
    else cb(new Error("Tylko pliki audio są obsługiwane"));
  },
});

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function cleanup(filePath?: string) {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch {
      /* ignore */
    }
  }
}

router.post("/", upload.single("audio"), async (req: Request, res: Response) => {
  const filePath = req.file?.path;

  try {
    if (!req.file || !filePath) {
      res.status(400).json({ error: "Brak nagrania." });
      return;
    }

    const client = getClient();
    const audioFile = await toFile(
      fs.createReadStream(filePath),
      req.file.originalname || "recording.m4a",
      { type: req.file.mimetype || "audio/mp4" },
    );
    const response = await client.audio.transcriptions.create({
      file: audioFile,
      model: "gpt-4o-transcribe",
      language: "pl",
      prompt:
        "To jest polskie dyktowanie przepisu kulinarnego w aplikacji Przepiśnik LowStyleLife. Zapisz tekst naturalną polszczyzną, popraw typowe przesłyszenia, nie używaj języka czeskiego ani słowackiego.",
    });

    cleanup(filePath);
    res.json({ text: response.text?.trim() ?? "" });
  } catch (err: any) {
    cleanup(filePath);
    console.error("[transcribe-audio]", err);

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

    res.status(500).json({ error: "Nie udało się przepisać nagrania na tekst. Spróbuj ponownie." });
  }
});

export default router;
