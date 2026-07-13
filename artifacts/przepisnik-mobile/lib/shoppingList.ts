import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "pp-lista-zakupow";

type CatKey =
  | "warzywa"
  | "owoce"
  | "nabial"
  | "mieso"
  | "piekarnia"
  | "napoje"
  | "suche"
  | "inne";

interface ShopItem {
  id: number;
  name: string;
  qty: string;
  cat: CatKey;
  done: boolean;
}

const CATS: Record<CatKey, true> = {
  warzywa: true,
  owoce: true,
  nabial: true,
  mieso: true,
  piekarnia: true,
  napoje: true,
  suche: true,
  inne: true,
};

function sanitize(parsed: unknown): ShopItem[] {
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter(
      (item): item is ShopItem =>
        !!item &&
        Number.isFinite(item.id) &&
        typeof item.name === "string" &&
        typeof item.cat === "string" &&
        item.cat in CATS,
    )
    .map((item) => ({
      id: item.id,
      name: item.name,
      qty: typeof item.qty === "string" ? item.qty : "",
      cat: item.cat,
      done: item.done === true,
    }));
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function inferShoppingCategory(item: string): CatKey {
  const text = normalize(item);
  const hasAny = (words: string[]) => words.some((word) => text.includes(word));

  if (
    hasAny([
      "mleko",
      "jogurt",
      "kefir",
      "smietana",
      "twarog",
      "ser",
      "feta",
      "mozzarella",
      "maslo",
      "jaj",
    ])
  ) {
    return "nabial";
  }

  if (
    hasAny([
      "kurczak",
      "indyk",
      "wolow",
      "wieprz",
      "mieso",
      "boczek",
      "szynka",
      "losos",
      "ryba",
      "tunczyk",
      "dorsz",
    ])
  ) {
    return "mieso";
  }

  if (hasAny(["chleb", "bulka", "bulki", "bagiet", "tortilla", "lawasz", "croissant"])) {
    return "piekarnia";
  }

  if (hasAny(["woda", "sok", "napoj", "kawa", "herbata"])) {
    return "napoje";
  }

  if (
    hasAny([
      "maka",
      "ryz",
      "makaron",
      "kasza",
      "platki",
      "cukier",
      "sol",
      "pieprz",
      "olej",
      "oliwa",
      "puszka",
      "konserwa",
      "soczewica",
      "ciecierzyca",
      "fasola",
      "orzech",
      "kakao",
      "przypraw",
      "curry",
    ])
  ) {
    return "suche";
  }

  if (
    hasAny([
      "jabl",
      "banan",
      "cytryn",
      "limonk",
      "pomarancz",
      "truskawk",
      "malin",
      "jagod",
      "borow",
      "gruszk",
      "sliwk",
      "owoc",
    ])
  ) {
    return "owoce";
  }

  if (
    hasAny([
      "pomidor",
      "ogorek",
      "cebula",
      "czosnek",
      "papryk",
      "marchew",
      "ziemni",
      "cukinia",
      "brokul",
      "salata",
      "szpinak",
      "seler",
      "warzyw",
      "kolendr",
      "imbir",
    ])
  ) {
    return "warzywa";
  }

  return "inne";
}

export async function addIngredientsToShoppingList(ingredients: string[]) {
  const clean = ingredients.map((item) => item.trim()).filter(Boolean);
  if (!clean.length) return 0;

  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const current = raw ? sanitize(JSON.parse(raw)) : [];
  const nextId = Math.max(0, ...current.map((item) => item.id)) + 1;

  const added = clean.map((name, index) => ({
    id: nextId + index,
    name,
    qty: "",
    cat: inferShoppingCategory(name),
    done: false,
  }));

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...current, ...added]));
  return added.length;
}
