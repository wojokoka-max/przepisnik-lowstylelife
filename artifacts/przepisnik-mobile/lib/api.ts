// Proste helpery do wołania api-server.

import Constants from "expo-constants";
import { Platform } from "react-native";

const baseDomain = process.env.EXPO_PUBLIC_DOMAIN ?? "";
const explicitApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";

function inferLocalApiBaseUrl(): string {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    "";
  const host = hostUri.split(":")[0];
  return host ? `http://${host}:3001/api` : "";
}

function apiBaseUrl(): string {
  const cleanExplicit = explicitApiBaseUrl.trim().replace(/\/$/, "");
  if (cleanExplicit) return cleanExplicit.endsWith("/api") ? cleanExplicit : `${cleanExplicit}/api`;
  if (baseDomain) return `https://${baseDomain}/api`;
  if (Platform.OS !== "web") return inferLocalApiBaseUrl();
  return "/api";
}

export function apiUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const base = apiBaseUrl();
  return base ? `${base}${clean}` : `/api${clean}`;
}

export type GeneratedRecipe = {
  title: string;
  description: string;
  category: string;
  prepTime: string;
  servings: number;
  difficulty: "łatwy" | "średni" | "trudny";
  ingredients: string[];
  steps: string[];
  emoji: string;
  notes: string;
};

function localRecipe(title: string, hint: string): GeneratedRecipe {
  const cleanTitle = title.trim() || "Domowe danie";
  return {
    title: cleanTitle,
    description: `Prosty przepis LowStyleLife przygotowany lokalnie: ${hint}.`,
    category: "Kreator",
    prepTime: "30 min",
    servings: 2,
    difficulty: "łatwy",
    emoji: "🍲",
    notes:
      "To wersja lokalna bez połączenia z backendem AI. Po podłączeniu API aplikacja wygeneruje pełniejszy przepis.",
    ingredients: [
      "1 porcja głównego składnika",
      "1 łyżka oliwy lub masła",
      "1 ząbek czosnku",
      "sól i pieprz do smaku",
      "ulubione zioła",
    ],
    steps: [
      "Przygotuj i pokrój składniki na równe kawałki.",
      "Rozgrzej oliwę lub masło na patelni, dodaj czosnek i chwilę podsmaż.",
      "Dodaj główny składnik, dopraw solą, pieprzem i ziołami.",
      "Duś lub smaż na średnim ogniu, aż składniki będą miękkie i aromatyczne.",
      "Podawaj od razu, najlepiej z prostą sałatką albo ulubionym dodatkiem.",
    ],
  };
}

async function readJsonResponse<T>(res: Response, fallbackMessage: string): Promise<T> {
  const text = await res.text();
  const trimmed = text.trimStart();

  if (!trimmed) {
    throw new Error(fallbackMessage);
  }

  if (trimmed.startsWith("<")) {
    throw new Error(fallbackMessage);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(fallbackMessage);
  }
}

export async function generateRecipeFromName(name: string): Promise<GeneratedRecipe> {
  if (!apiBaseUrl() || apiBaseUrl() === "/api") {
    return localRecipe(name, "na podstawie wpisanej nazwy dania");
  }

  const res = await fetch(apiUrl("/recipe-from-name"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    let msg = "Błąd generowania przepisu.";
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) msg = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return readJsonResponse<GeneratedRecipe>(res, "Błąd generowania przepisu.");
}

export async function generateRecipeFromIngredients(
  ingredients: string[],
): Promise<GeneratedRecipe> {
  if (!apiBaseUrl() || apiBaseUrl() === "/api") {
    return localRecipe(
      ingredients.filter(Boolean).join(", ") || "Danie z lodówki",
      "na podstawie składników z lodówki",
    );
  }

  const res = await fetch(apiUrl("/recipe-from-ingredients"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients }),
  });
  if (!res.ok) {
    let msg = "Błąd generowania przepisu.";
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) msg = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return readJsonResponse<GeneratedRecipe>(res, "Błąd generowania przepisu.");
}

export type PhotoRecipe = {
  title: string;
  ingredients: string[];
  preparation: string[];
};

// Wysyła zdjęcie do api-server (OCR + AI) i zwraca odczytany przepis.
// Web: pobiera blob z uri; natywnie: przekazuje obiekt { uri, name, type }.
export async function recipeFromImage(
  uri: string,
  mimeType?: string,
  target?: "ingredients" | "preparation",
): Promise<PhotoRecipe> {
  const base = apiBaseUrl();
  if (!base || base === "/api") {
    throw new Error(
      "Import ze zdjęcia wymaga adresu backendu AI. Uruchom API lokalnie albo ustaw EXPO_PUBLIC_API_BASE_URL.",
    );
  }

  const formData = new FormData();

  if (Platform.OS === "web") {
    const blob = await (await fetch(uri)).blob();
    formData.append("image", blob, "photo.jpg");
  } else {
    formData.append("image", {
      uri,
      name: "photo.jpg",
      type: mimeType ?? "image/jpeg",
    } as unknown as Blob);
  }
  if (target) formData.append("target", target);

  const res = await fetch(apiUrl("/recipe-from-image"), {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let msg = "Nie udało się odczytać przepisu ze zdjęcia.";
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) msg = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }

  const data = await readJsonResponse<Partial<PhotoRecipe>>(
    res,
    "Nie udało się odczytać przepisu ze zdjęcia.",
  );
  return {
    title: data.title ?? "",
    ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
    preparation: Array.isArray(data.preparation) ? data.preparation : [],
  };
}

export async function transcribeAudio(uri: string, mimeType?: string): Promise<string> {
  const base = apiBaseUrl();
  if (!base || base === "/api") {
    throw new Error(
      "Dyktowanie wymaga adresu backendu AI. Uruchom API lokalnie albo ustaw EXPO_PUBLIC_API_BASE_URL.",
    );
  }

  const formData = new FormData();

  if (Platform.OS === "web") {
    const blob = await (await fetch(uri)).blob();
    formData.append("audio", blob, "recording.webm");
  } else {
    formData.append("audio", {
      uri,
      name: "recording.m4a",
      type: mimeType ?? "audio/mp4",
    } as unknown as Blob);
  }

  const res = await fetch(apiUrl("/transcribe-audio"), {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let msg = "Nie udało się przepisać nagrania.";
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) msg = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }

  const data = await readJsonResponse<{ text?: string }>(res, "Nie udało się przepisać nagrania.");
  return data.text?.trim() ?? "";
}
