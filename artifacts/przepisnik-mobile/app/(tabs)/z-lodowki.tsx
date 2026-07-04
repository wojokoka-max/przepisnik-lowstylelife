// 1:1 port webowego Kreator.tsx (artifacts/przepisnik/src/pages/Kreator.tsx) na React Native.
// Te same dane (data/kreator.ts), te same dwa flow: składnik z lodówki + nazwa dania (AI),
// quick categories, ostatnio używane, wynik z zapisem do Moich przepisów.

import { Carrot, Search, Sparkles, Utensils } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SiteHeader from "../../components/SiteHeader";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useRecipes } from "../../context/RecipesContext";
import {
  CAT_ICONS,
  CAT_LABELS,
  DB,
  QUICK_CATS,
  findKreatorProposalsForCategory,
  findRecipe,
  resolveIngredients,
  stripHtml,
  type Category,
  type KreatorProposal,
  type KreatorRecipe,
  type Product,
  type ResolvedIngredient,
} from "../../data/kreator";
import {
  CUISINES,
  CUISINE_EMOJI,
  CUISINE_LABELS,
  findPlanerDishesForCategory,
  getCuisineFromText,
  type Cuisine,
  type PlanerDish,
} from "../../data/planner";
import { generateSlug, type Recipe } from "../../data/recipes";
import { useAiLimit } from "../../hooks/useAiLimit";
import { generateRecipeFromIngredients, generateRecipeFromName } from "../../lib/api";

const RECENT_KEY = "przepisnik-kreator-recent";
const MAX_RECENT = 5;

interface RenderedMeal {
  recipe: KreatorRecipe;
  ingredients: ResolvedIngredient[];
  steps: string[];
  title: string;
  type: string;
  time: number;
  tip: string;
  starProduct: Product;
}

function buildMealFromRecipe(recipe: KreatorRecipe, p: Product): RenderedMeal {
  return {
    recipe,
    ingredients: resolveIngredients(recipe, p),
    steps: recipe.steps(p),
    title: recipe.name(p),
    type: recipe.type,
    time: recipe.time,
    tip: recipe.tip || "Smacznego!",
    starProduct: p,
  };
}

export default function ZLodowkiTab() {
  const insets = useSafeAreaInsets();
  const { content } = useBreakpoint();
  const router = useRouter();
  const { addRecipe } = useRecipes();
  const aiLimit = useAiLimit();

  // Tryb wprowadzania
  const [mode, setMode] = useState<"ingredient" | "name">("ingredient");

  // Składnik
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownItems, setDropdownItems] = useState<Product[]>([]);
  const [starProduct, setStarProduct] = useState<Product | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [meal, setMeal] = useState<RenderedMeal | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [categoryView, setCategoryView] = useState<Category | null>(null);
  const [planerDish, setPlanerDish] = useState<PlanerDish | null>(null);
  const [planerSavedSlug, setPlanerSavedSlug] = useState<string | null>(null);
  const [cuisine, setCuisine] = useState<Cuisine | null>(null);
  const seenRecipesRef = useRef<Set<string>>(new Set());

  // AI z nazwy
  const [dishName, setDishName] = useState("");
  const [dishLoading, setDishLoading] = useState(false);
  const [dishError, setDishError] = useState("");
  const [dishRecipe, setDishRecipe] = useState<Recipe | null>(null);
  const [dishSavedSlug, setDishSavedSlug] = useState<string | null>(null);

  // Kilka składników (lista) → AI
  const [fridgeItems, setFridgeItems] = useState<string[]>([]);
  const [fridgeLoading, setFridgeLoading] = useState(false);
  const [fridgeError, setFridgeError] = useState("");

  useEffect(() => {
    AsyncStorage.getItem(RECENT_KEY)
      .then((raw) => {
        if (raw) setRecent(JSON.parse(raw) as string[]);
      })
      .catch(() => {});
  }, []);

  const recentProducts = useMemo(
    () => recent.map((id) => DB.find((p) => p.id === id)).filter(Boolean) as Product[],
    [recent],
  );

  const kreatorProposals = useMemo<KreatorProposal[]>(
    () => {
      if (!categoryView) return [];
      const all = findKreatorProposalsForCategory(categoryView);
      if (!cuisine) return all;
      return all.filter((prop) => {
        const r = prop.recipe;
        const text = `${stripHtml(r.name(prop.starProduct))} ${r.type} ${prop.starProduct.name}`;
        return getCuisineFromText(text) === cuisine;
      });
    },
    [categoryView, cuisine],
  );
  const planerProposals = useMemo<PlanerDish[]>(
    () => {
      if (!categoryView) return [];
      const all = findPlanerDishesForCategory(categoryView);
      if (!cuisine) return all;
      return all.filter((d) => getCuisineFromText(`${d.nazwa} ${d.opis} ${d.skladniki}`) === cuisine);
    },
    [categoryView, cuisine],
  );

  function pushRecent(id: string) {
    setRecent((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX_RECENT);
      AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }

  function onSearchChange(value: string) {
    setQuery(value);
    const q = value.trim().toLowerCase();
    if (!q) {
      setDropdownOpen(false);
      return;
    }
    const items = DB.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 10);
    setDropdownItems(items);
    setDropdownOpen(items.length > 0);
  }

  function showCategoryProposals(cat: Category) {
    setQuery("");
    setDropdownOpen(false);
    setStarProduct(null);
    setMeal(null);
    setPlanerDish(null);
    setSavedSlug(null);
    setPlanerSavedSlug(null);
    seenRecipesRef.current = new Set();
    setCategoryView(cat);
  }

  function selectKreatorProposal(prop: KreatorProposal) {
    setStarProduct(prop.starProduct);
    setQuery("");
    setDropdownOpen(false);
    setSavedSlug(null);
    setPlanerSavedSlug(null);
    setPlanerDish(null);
    setCategoryView(null);
    pushRecent(prop.starProduct.id);
    setLoading(true);
    setMeal(null);
    setTimeout(() => {
      const m = buildMealFromRecipe(prop.recipe, prop.starProduct);
      seenRecipesRef.current = new Set([m.recipe.id]);
      setMeal(m);
      setLoading(false);
    }, 350);
  }

  function selectPlanerProposal(dish: PlanerDish) {
    setStarProduct(null);
    setMeal(null);
    setSavedSlug(null);
    setPlanerSavedSlug(null);
    setQuery("");
    setDropdownOpen(false);
    setCategoryView(null);
    seenRecipesRef.current = new Set();
    setPlanerDish(dish);
  }

  function clearSelected() {
    setStarProduct(null);
    setMeal(null);
    setPlanerDish(null);
    setSavedSlug(null);
    setPlanerSavedSlug(null);
    seenRecipesRef.current = new Set();
    setQuery("");
  }

  function createMeal() {
    if (!starProduct) return;
    setLoading(true);
    setMeal(null);
    setSavedSlug(null);
    setTimeout(() => {
      const recipe = findRecipe(starProduct, seenRecipesRef.current);
      const m = buildMealFromRecipe(recipe, starProduct);
      seenRecipesRef.current.add(m.recipe.id);
      setMeal(m);
      setLoading(false);
    }, 600);
  }

  async function generateFromName() {
    const name = dishName.trim();
    if (!name) {
      setDishError("Podaj pełną nazwę dania.");
      return;
    }
    if (!aiLimit.canUse) {
      Alert.alert(
        "Limit dzienny",
        "Wykorzystałaś już dzisiejsze 3 generacje AI. Wróć jutro lub odblokuj wersję premium.",
      );
      return;
    }
    setDishError("");
    setDishLoading(true);
    setDishRecipe(null);
    setDishSavedSlug(null);
    try {
      const data = await generateRecipeFromName(name);
      const ts = Date.now();
      const id = `kreator-ai-${ts}`;
      const slug = `${generateSlug(data.title || name)}-${ts.toString(36).slice(-5)}`;
      const recipe: Recipe = {
        id,
        slug,
        title: data.title || name,
        description: data.description || "",
        category: data.category || "Dania główne",
        prepTime: data.prepTime || "30 min",
        servings: data.servings || 2,
        difficulty: data.difficulty || "średni",
        ingredients: data.ingredients || [],
        steps: data.steps || [],
        emoji: data.emoji || "🍽️",
        notes: data.notes || "Przepis wygenerowany przez AI z nazwy. Możesz go edytować.",
      };
      setDishRecipe(recipe);
      await aiLimit.consume();
    } catch (e) {
      setDishError(e instanceof Error ? e.message : "Błąd połączenia. Spróbuj ponownie.");
    } finally {
      setDishLoading(false);
    }
  }

  function addIngredient(raw: string) {
    const name = raw.trim();
    if (!name) return;
    setFridgeError("");
    setFridgeItems((prev) => {
      if (prev.some((x) => x.toLowerCase() === name.toLowerCase())) return prev;
      return [...prev, name];
    });
    const match = DB.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (match) pushRecent(match.id);
    setQuery("");
    setDropdownOpen(false);
  }

  function removeIngredient(name: string) {
    setFridgeItems((prev) => prev.filter((x) => x !== name));
  }

  async function generateFromFridge() {
    if (fridgeItems.length === 0) {
      setFridgeError("Dodaj przynajmniej jeden składnik.");
      return;
    }
    if (!aiLimit.canUse) {
      Alert.alert(
        "Limit dzienny",
        "Wykorzystałaś już dzisiejsze 3 generacje AI. Wróć jutro lub odblokuj wersję premium.",
      );
      return;
    }
    setFridgeError("");
    setFridgeLoading(true);
    setDishRecipe(null);
    setDishSavedSlug(null);
    try {
      const data = await generateRecipeFromIngredients(fridgeItems);
      const ts = Date.now();
      const id = `kreator-ai-${ts}`;
      const slug = `${generateSlug(data.title || "danie-z-lodowki")}-${ts.toString(36).slice(-5)}`;
      const recipe: Recipe = {
        id,
        slug,
        title: data.title || "Danie z lodówki",
        description: data.description || "",
        category: data.category || "Dania główne",
        prepTime: data.prepTime || "30 min",
        servings: data.servings || 2,
        difficulty: data.difficulty || "średni",
        ingredients: data.ingredients || [],
        steps: data.steps || [],
        emoji: data.emoji || "🍽️",
        notes: data.notes || "Przepis wygenerowany przez AI z Twoich składników. Możesz go edytować.",
      };
      setDishRecipe(recipe);
      await aiLimit.consume();
    } catch (e) {
      setFridgeError(e instanceof Error ? e.message : "Błąd połączenia. Spróbuj ponownie.");
    } finally {
      setFridgeLoading(false);
    }
  }

  function saveMealToBook() {
    if (!meal) return;
    const title = stripHtml(meal.title);
    const ts = Date.now();
    const id = `kreator-${ts}`;
    const slug = `${generateSlug(title)}-${ts.toString(36).slice(-5)}`;
    const ingredients = meal.ingredients.map((ing) => {
      const n = stripHtml(ing.product.name);
      return `${n} – ${ing.g} g${ing.isStar ? " ★" : ""}`;
    });
    const steps = meal.steps.map((s) => stripHtml(s));
    addRecipe({
      id,
      slug,
      title,
      description: meal.type,
      category: "Kreator",
      prepTime: `${meal.time} min`,
      servings: 1,
      difficulty: "łatwy",
      ingredients,
      steps,
      emoji: CAT_ICONS[meal.starProduct.cat],
      notes: meal.tip,
    });
    setSavedSlug(slug);
  }

  function savePlanerToBook() {
    if (!planerDish) return;
    const ts = Date.now();
    const slug = `${generateSlug(planerDish.nazwa)}-${ts.toString(36).slice(-5)}`;
    addRecipe({
      id: `planer-${planerDish.id}-${ts}`,
      slug,
      title: planerDish.nazwa,
      description: planerDish.opis,
      category: "Planer",
      prepTime: `${planerDish.czas} min`,
      servings: 1,
      difficulty: "łatwy",
      ingredients: planerDish.skladniki.split(",").map((s) => s.trim()).filter(Boolean),
      steps: planerDish.przygotowanie
        .split(/(?<=\.)\s+/)
        .map((s) => s.trim())
        .filter(Boolean),
      emoji: "🍽️",
      notes: `Wartości: ${planerDish.kcal} kcal · B ${planerDish.B} g · T ${planerDish.T} g · W ${planerDish.W} g`,
    });
    setPlanerSavedSlug(slug);
  }

  function saveDishAiToBook() {
    if (!dishRecipe) return;
    addRecipe(dishRecipe);
    setDishSavedSlug(dishRecipe.slug || dishRecipe.id);
  }

  return (
    <View style={styles.root}>
      <SiteHeader showAdd={false} onAdd={() => {}} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + 44 + 14,
            paddingHorizontal: 16,
            maxWidth: content.maxWidth,
            alignSelf: content.alignSelf,
            width: content.width,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* AI USAGE */}
          <View style={styles.aiBadge}>
            <Sparkles size={11} color="#8b4fd1" strokeWidth={2} />
            <Text style={styles.aiBadgeText}>
              {aiLimit.unlimited
                ? "AI: nielimitowane (admin)"
                : `AI dzisiaj: ${aiLimit.remaining}/${aiLimit.limit}`}
            </Text>
          </View>

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerKicker}>K R E A T O R   P O S I Ł K Ó W</Text>
            <Text style={styles.headerTitle}>
              Co dziś masz <Text style={styles.headerTitleEm}>w lodówce?</Text>
            </Text>
            <Text style={styles.headerSub}>
              {mode === "ingredient"
                ? "Wybierz jeden składnik — zaproponujemy z niego cały posiłek"
                : "Wpisz nazwę dania — AI ułoży dla Ciebie przepis krok po kroku"}
            </Text>
          </View>

          {/* MODE SWITCH */}
          <View style={styles.segmented}>
            <Pressable
              onPress={() => setMode("ingredient")}
              style={[styles.segment, mode === "ingredient" && styles.segmentActive]}
            >
              <Carrot
                size={14}
                color={mode === "ingredient" ? "#fff" : "#8b4fd1"}
                strokeWidth={2}
              />
              <Text
                style={[styles.segmentText, mode === "ingredient" && styles.segmentTextActive]}
              >
                Mam składnik
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setMode("name")}
              style={[styles.segment, mode === "name" && styles.segmentActive]}
            >
              <Utensils
                size={14}
                color={mode === "name" ? "#fff" : "#8b4fd1"}
                strokeWidth={2}
              />
              <Text style={[styles.segmentText, mode === "name" && styles.segmentTextActive]}>
                Mam nazwę dania
              </Text>
            </Pressable>
          </View>

          {/* HERO SEARCH CARD */}
          {mode === "ingredient" ? (
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Co masz w lodówce?</Text>
            <Text style={styles.heroSub}>Dodaj składniki, które masz — ułożymy z nich przepis</Text>

            <View style={{ position: "relative" }}>
              <Search size={16} color="#9a8e78" strokeWidth={2} style={styles.searchIcon} />
              <TextInput
                value={query}
                onChangeText={onSearchChange}
                onSubmitEditing={() => addIngredient(query)}
                returnKeyType="done"
                placeholder="np. jajka, musztarda, natka pietruszki…"
                placeholderTextColor="#9a8e78"
                style={styles.searchInput}
                autoCorrect={false}
              />
            </View>

            {dropdownOpen ? (
              <View style={styles.dropdown}>
                {dropdownItems.map((p, i) => (
                  <Pressable
                    key={p.id}
                    onPress={() => addIngredient(p.name)}
                    style={[
                      styles.ddItem,
                      i < dropdownItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: "#ede8dc" },
                    ]}
                  >
                    <Text style={{ fontSize: 16 }}>{CAT_ICONS[p.cat]}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.ddName}>{p.name}</Text>
                      <Text style={styles.ddCat}>{CAT_LABELS[p.cat]}</Text>
                    </View>
                    <Text style={styles.ddAdd}>+ Dodaj</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}

            {query.trim().length > 0 ? (
              <Pressable onPress={() => addIngredient(query)} style={styles.addQueryBtn}>
                <Text style={styles.addQueryText}>+ Dodaj „{query.trim()}"</Text>
              </Pressable>
            ) : null}

            {/* BASKET — wybrane składniki */}
            {fridgeItems.length > 0 ? (
              <View style={{ marginTop: 14 }}>
                <Text style={styles.basketLabel}>Twoje składniki ({fridgeItems.length})</Text>
                <View style={styles.basketRow}>
                  {fridgeItems.map((name) => (
                    <Pressable
                      key={name}
                      onPress={() => removeIngredient(name)}
                      style={styles.basketChip}
                      hitSlop={4}
                    >
                      <Text style={styles.basketChipText}>{name}</Text>
                      <Text style={styles.basketChipX}>✕</Text>
                    </Pressable>
                  ))}
                </View>

                <Pressable
                  onPress={generateFromFridge}
                  disabled={fridgeLoading}
                  style={[
                    styles.aiBtn,
                    { marginTop: 12, backgroundColor: fridgeLoading ? "rgba(139,79,209,0.12)" : "#8b4fd1" },
                  ]}
                >
                  {fridgeLoading ? <ActivityIndicator size="small" color="#fff" /> : null}
                  <Text style={[styles.aiBtnText, { color: fridgeLoading ? "#8b4fd1" : "#fff" }]}>
                    {fridgeLoading
                      ? "✨ Układam przepis…"
                      : `✨ Stwórz przepis z ${fridgeItems.length} składnik${fridgeItems.length === 1 ? "a" : "ów"}`}
                  </Text>
                </Pressable>

                {fridgeError ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{fridgeError}</Text>
                  </View>
                ) : null}
              </View>
            ) : null}

            {/* Quick categories */}
            <View style={styles.quickCats}>
              {QUICK_CATS.map((c) => (
                <Pressable key={c} onPress={() => showCategoryProposals(c)} style={styles.quickCatBtn}>
                  <Text style={styles.quickCatText}>{CAT_LABELS[c]}</Text>
                </Pressable>
              ))}
            </View>

            {/* Kuchnia świata */}
            <Text style={styles.cuisineKicker}>Kuchnia świata</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cuisineRow}
            >
              <Pressable
                onPress={() => setCuisine(null)}
                style={[styles.cuisineChip, cuisine === null && styles.cuisineChipActive]}
              >
                <Text style={[styles.cuisineChipText, cuisine === null && styles.cuisineChipTextActive]}>
                  🌍 Wszystkie
                </Text>
              </Pressable>
              {CUISINES.map((c) => {
                const active = cuisine === c;
                return (
                  <Pressable
                    key={c}
                    onPress={() => setCuisine(active ? null : c)}
                    style={[styles.cuisineChip, active && styles.cuisineChipActive]}
                  >
                    <Text style={[styles.cuisineChipText, active && styles.cuisineChipTextActive]}>
                      {CUISINE_EMOJI[c]} {CUISINE_LABELS[c]}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
          ) : null}

          {/* DISH NAME AI */}
          {mode === "name" ? (
          <View style={styles.aiCard}>
            <Text style={[styles.heroTitle, { textAlign: "center" }]}>Wpisz pełną nazwę dania</Text>
            <Text style={[styles.heroSub, { textAlign: "center" }]}>
              Wygenerujemy dla Ciebie domowy przepis krok po kroku
            </Text>

            <TextInput
              value={dishName}
              onChangeText={(t) => {
                setDishName(t);
                if (dishError) setDishError("");
              }}
              placeholder="np. Krewetki w sosie kokosowo-limonkowym"
              placeholderTextColor="#9a8e78"
              editable={!dishLoading}
              style={[styles.searchInput, { paddingLeft: 18, marginBottom: 10 }]}
              onSubmitEditing={generateFromName}
              returnKeyType="go"
            />

            <Pressable
              onPress={generateFromName}
              disabled={dishLoading || !dishName.trim()}
              style={[
                styles.aiBtn,
                {
                  backgroundColor: dishLoading || !dishName.trim() ? "rgba(139,79,209,0.12)" : "#8b4fd1",
                },
              ]}
            >
              {dishLoading ? <ActivityIndicator size="small" color="#fff" /> : null}
              <Text
                style={[
                  styles.aiBtnText,
                  { color: dishLoading || !dishName.trim() ? "#8b4fd1" : "#fff" },
                ]}
              >
                {dishLoading ? "✨ Generuję przepis…" : "✨ Stwórz przepis"}
              </Text>
            </Pressable>

            {dishError ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{dishError}</Text>
              </View>
            ) : null}
          </View>
          ) : null}

          {/* RECENT */}
          {mode === "ingredient" && recentProducts.length > 0 && !starProduct ? (
            <View style={{ marginTop: 14 }}>
              <Text style={styles.sectionLabel}>Ostatnio używane</Text>
              <View style={styles.recentRow}>
                {recentProducts.map((p) => (
                  <Pressable key={p.id} onPress={() => addIngredient(p.name)} style={styles.recentChip}>
                    <Text style={{ fontSize: 13, marginRight: 4 }}>{CAT_ICONS[p.cat]}</Text>
                    <Text style={styles.recentText}>{p.name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {/* CATEGORY PROPOSALS */}
          {categoryView && !meal && !planerDish ? (
            <View style={{ marginTop: 14 }}>
              <View style={styles.proposalHead}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.proposalKicker}>Propozycje · {CAT_LABELS[categoryView]}</Text>
                  <Text style={styles.proposalCount}>
                    {kreatorProposals.length + planerProposals.length} pomysłów ·{" "}
                    {kreatorProposals.length} z Kreatora · {planerProposals.length} z Planera
                  </Text>
                </View>
                <Pressable onPress={() => setCategoryView(null)} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>✕ Zamknij</Text>
                </Pressable>
              </View>

              {kreatorProposals.length === 0 && planerProposals.length === 0 ? (
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>Brak propozycji dla tej kategorii.</Text>
                </View>
              ) : null}

              {kreatorProposals.map((prop) => (
                <Pressable
                  key={`k-${prop.recipe.id}`}
                  onPress={() => selectKreatorProposal(prop)}
                  style={styles.proposalCard}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <Text style={[styles.tag, { color: "#8b4fd1", backgroundColor: "rgba(139,79,209,0.1)" }]}>
                      Kreator
                    </Text>
                    <Text style={styles.tagMeta}>⏱ {prop.recipe.time} min</Text>
                  </View>
                  <Text style={styles.proposalTitle}>{stripHtml(prop.recipe.name(prop.starProduct))}</Text>
                  <Text style={styles.proposalType}>{prop.recipe.type}</Text>
                </Pressable>
              ))}

              {planerProposals.map((dish) => (
                <Pressable
                  key={`p-${dish.id}`}
                  onPress={() => selectPlanerProposal(dish)}
                  style={styles.proposalCard}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <Text style={[styles.tag, { color: "#5a7460", backgroundColor: "rgba(110,139,116,0.12)" }]}>
                      Planer
                    </Text>
                    <Text style={styles.tagMeta}>
                      ⏱ {dish.czas} min · {dish.kcal} kcal
                    </Text>
                  </View>
                  <Text style={styles.proposalTitle}>{dish.nazwa}</Text>
                  <Text style={styles.proposalType}>{dish.opis}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          {/* SELECTED STAR */}
          {starProduct ? (
            <View style={styles.starCard}>
              <Text style={{ fontSize: 26 }}>{CAT_ICONS[starProduct.cat]}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.starName}>{starProduct.name}</Text>
                <Text style={styles.starCat}>{CAT_LABELS[starProduct.cat]}</Text>
              </View>
              <Pressable onPress={clearSelected} hitSlop={8}>
                <Text style={{ color: "#9a8e78", fontSize: 18 }}>✕</Text>
              </Pressable>
            </View>
          ) : null}

          {/* CREATE BTN */}
          {mode === "ingredient" && starProduct && !categoryView && !planerDish ? (
            <Pressable
              onPress={createMeal}
              disabled={!starProduct || loading}
              style={[
                styles.createBtn,
                {
                  backgroundColor: !starProduct || loading ? "#d9d0bc" : "#6a2fb8",
                },
              ]}
            >
              <Text
                style={[
                  styles.createBtnText,
                  { color: !starProduct || loading ? "#5a4f3a" : "#fff" },
                ]}
              >
                {meal ? "Stwórz inny posiłek →" : "Stwórz posiłek →"}
              </Text>
            </Pressable>
          ) : null}

          {/* LOADING */}
          {loading ? (
            <View style={{ alignItems: "center", paddingVertical: 32 }}>
              <ActivityIndicator size="small" color="#8b4fd1" />
              <Text style={{ marginTop: 10, color: "#3d3526", fontSize: 14, fontFamily: "Inter_500Medium" }}>Komponuję posiłek…</Text>
            </View>
          ) : null}

          {/* MEAL RESULT */}
          {meal && !loading ? (
            <View style={styles.resultCard}>
              <View style={styles.resultHead}>
                <Text style={styles.resultType}>{meal.type}</Text>
                <Text style={styles.resultTitle}>{stripHtml(meal.title)}</Text>
                <Text style={styles.resultMeta}>⏱ ok. {meal.time} minut</Text>
              </View>
              <View style={{ padding: 18 }}>
                <Text style={styles.section}>Składniki</Text>
                <View style={{ marginBottom: 18 }}>
                  {meal.ingredients.map((ing, i) => (
                    <View
                      key={i}
                      style={[
                        styles.ingRow,
                        ing.isStar && { backgroundColor: "rgba(110,139,116,0.1)", borderColor: "#6e8b74" },
                      ]}
                    >
                      <Text style={{ fontSize: 16 }}>{CAT_ICONS[ing.product.cat] || "•"}</Text>
                      <Text style={[styles.ingName, ing.isStar && { color: "#5a7460" }]}>
                        {ing.product.name}
                        {ing.isStar ? " ★" : ""}
                      </Text>
                      <Text style={styles.ingG}>{ing.g}g</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.section}>Przygotowanie</Text>
                <View style={{ marginBottom: 18 }}>
                  {meal.steps.map((s, i) => (
                    <View key={i} style={styles.stepRow}>
                      <View style={styles.stepNum}>
                        <Text style={styles.stepNumText}>{i + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{stripHtml(s)}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.tipBox}>
                  <Text style={styles.tipLabel}>💡 Wskazówka</Text>
                  <Text style={styles.tipText}>{meal.tip}</Text>
                </View>

                <View style={styles.resultActions}>
                  <Pressable onPress={clearSelected} style={styles.outlineBtn}>
                    <Text style={styles.outlineBtnText}>← Zmień składnik</Text>
                  </Pressable>
                  <Pressable onPress={createMeal} style={styles.outlinePurple}>
                    <Text style={styles.outlinePurpleText}>↻ Inny wariant</Text>
                  </Pressable>
                  {savedSlug ? (
                    <Pressable onPress={() => router.push(`/przepis/${savedSlug}`)} style={styles.savedBtn}>
                      <Text style={styles.savedBtnText}>✓ Zapisano · zobacz przepis →</Text>
                    </Pressable>
                  ) : (
                    <Pressable onPress={saveMealToBook} style={styles.saveBtn}>
                      <Text style={styles.saveBtnText}>💾 Zapisz w Moich przepisach</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          ) : null}

          {/* PLANER DISH RESULT */}
          {planerDish ? (
            <View style={styles.resultCard}>
              <View style={[styles.resultHead, { backgroundColor: "#ede7d9" }]}>
                <Text style={[styles.resultType, { color: "#5a7460" }]}>Z Planera · {planerDish.opis}</Text>
                <Text style={styles.resultTitle}>{planerDish.nazwa}</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
                  <Text style={styles.resultMeta}>⏱ {planerDish.czas} min</Text>
                  <Text style={styles.resultMeta}>🔥 {planerDish.kcal} kcal</Text>
                  <Text style={styles.resultMeta}>B {planerDish.B} g</Text>
                  <Text style={styles.resultMeta}>T {planerDish.T} g</Text>
                  <Text style={styles.resultMeta}>W {planerDish.W} g</Text>
                </View>
              </View>
              <View style={{ padding: 18 }}>
                <Text style={styles.section}>Składniki</Text>
                {planerDish.skladniki
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((s, i) => (
                    <View key={i} style={[styles.ingRow, { paddingVertical: 10 }]}>
                      <Text style={[styles.ingName, { flex: 1 }]}>{s}</Text>
                    </View>
                  ))}
                <Text style={[styles.section, { marginTop: 18 }]}>Przygotowanie</Text>
                <Text style={{ fontSize: 14, color: "#1c1810", lineHeight: 22, marginBottom: 18 }}>
                  {planerDish.przygotowanie}
                </Text>
                <View style={styles.resultActions}>
                  <Pressable onPress={clearSelected} style={styles.outlineBtn}>
                    <Text style={styles.outlineBtnText}>← Wróć</Text>
                  </Pressable>
                  {planerSavedSlug ? (
                    <Pressable onPress={() => router.push(`/przepis/${planerSavedSlug}`)} style={styles.savedBtn}>
                      <Text style={styles.savedBtnText}>✓ Zapisano · zobacz →</Text>
                    </Pressable>
                  ) : (
                    <Pressable onPress={savePlanerToBook} style={styles.saveBtn}>
                      <Text style={styles.saveBtnText}>💾 Zapisz w Moich przepisach</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          ) : null}

          {/* AI DISH RESULT */}
          {dishRecipe ? (
            <View style={styles.resultCard}>
              <View style={styles.resultHead}>
                <Text style={styles.resultType}>AI · {dishRecipe.category}</Text>
                <Text style={styles.resultTitle}>{dishRecipe.title}</Text>
                <Text style={styles.resultMeta}>⏱ {dishRecipe.prepTime}</Text>
              </View>
              <View style={{ padding: 18 }}>
                <Text style={styles.section}>Składniki</Text>
                <View style={{ marginBottom: 18 }}>
                  {dishRecipe.ingredients.map((ing, i) => (
                    <View key={i} style={styles.ingRow}>
                      <Text style={[styles.ingName, { flex: 1 }]}>• {ing}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.section}>Przygotowanie</Text>
                {dishRecipe.steps.map((s, i) => (
                  <View key={i} style={styles.stepRow}>
                    <View style={styles.stepNum}>
                      <Text style={styles.stepNumText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{s}</Text>
                  </View>
                ))}
                {dishRecipe.notes ? (
                  <View style={styles.tipBox}>
                    <Text style={styles.tipLabel}>💡 Wskazówka</Text>
                    <Text style={styles.tipText}>{dishRecipe.notes}</Text>
                  </View>
                ) : null}
                <View style={styles.resultActions}>
                  <Pressable
                    onPress={() => {
                      setDishRecipe(null);
                      setDishSavedSlug(null);
                    }}
                    style={styles.outlineBtn}
                  >
                    <Text style={styles.outlineBtnText}>← Wróć</Text>
                  </Pressable>
                  {dishSavedSlug ? (
                    <Pressable onPress={() => router.push(`/przepis/${dishSavedSlug}`)} style={styles.savedBtn}>
                      <Text style={styles.savedBtnText}>✓ Zapisano · zobacz →</Text>
                    </Pressable>
                  ) : (
                    <Pressable onPress={saveDishAiToBook} style={styles.saveBtn}>
                      <Text style={styles.saveBtnText}>💾 Zapisz w Moich przepisach</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5f1ea" },

  aiBadge: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(139,79,209,0.08)",
    borderColor: "rgba(139,79,209,0.18)",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 12,
  },
  aiBadgeText: { fontSize: 11, color: "#8b4fd1", fontFamily: "Inter_600SemiBold", letterSpacing: 0.4 },

  header: { marginBottom: 22, paddingBottom: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(28,24,16,0.12)" },
  headerKicker: {
    fontSize: 9.5,
    letterSpacing: 2,
    color: "#b8923a",
    fontFamily: "Inter_500Medium",
    marginBottom: 12,
  },
  headerTitle: { fontFamily: "CormorantGaramond_500Medium", fontSize: 28, lineHeight: 32, color: "#1c1810", letterSpacing: 0.2 },
  headerTitleEm: { fontFamily: "CormorantGaramond_400Regular_Italic", color: "#8b4fd1" },
  headerSub: { fontSize: 12.5, lineHeight: 18, color: "#7a6e58", marginTop: 6, fontFamily: "Inter_400Regular", maxWidth: 320 },

  segmented: {
    flexDirection: "row",
    backgroundColor: "rgba(139,79,209,0.08)",
    borderWidth: 1,
    borderColor: "rgba(139,79,209,0.2)",
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
    gap: 4,
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 9,
    backgroundColor: "transparent",
  },
  segmentActive: {
    backgroundColor: "#8b4fd1",
    shadowColor: "#8b4fd1",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  segmentText: { fontSize: 12, color: "#8b4fd1", fontFamily: "Inter_600SemiBold" },
  segmentTextActive: { color: "#fff", fontFamily: "Inter_700Bold" },

  heroCard: {
    backgroundColor: "#fffdf8",
    borderColor: "#d8d0bc",
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 18,
  },
  heroTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: "#1c1810" },
  heroSub: { fontSize: 12, color: "#9a8e78", marginTop: 2, marginBottom: 12, fontFamily: "Inter_400Regular" },

  searchIcon: { position: "absolute", left: 14, top: 14, zIndex: 1 },
  searchInput: {
    backgroundColor: "#f5f0e6",
    borderWidth: 2,
    borderColor: "#d8d0bc",
    borderRadius: 50,
    paddingVertical: 12,
    paddingLeft: 38,
    paddingRight: 16,
    fontSize: 14,
    color: "#1c1810",
    fontFamily: "Inter_400Regular",
  },

  dropdown: {
    marginTop: 6,
    backgroundColor: "#fffdf8",
    borderColor: "#d8d0bc",
    borderWidth: 1.5,
    borderRadius: 12,
    overflow: "hidden",
  },
  ddItem: { flexDirection: "row", alignItems: "center", gap: 10, padding: 11 },
  ddName: { fontSize: 13, color: "#1c1810", fontFamily: "Inter_500Medium" },
  ddCat: { fontSize: 11, color: "#9a8e78", fontFamily: "Inter_400Regular" },
  ddAdd: { fontSize: 11.5, color: "#8b4fd1", fontFamily: "Inter_700Bold" },

  addQueryBtn: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#8b4fd1",
    backgroundColor: "rgba(139,79,209,0.08)",
  },
  addQueryText: { fontSize: 12.5, color: "#8b4fd1", fontFamily: "Inter_700Bold" },

  basketLabel: {
    fontSize: 11,
    letterSpacing: 1.6,
    color: "#5a2a8e",
    textTransform: "uppercase",
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },
  basketRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  basketChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 13,
    paddingRight: 11,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#6a2fb8",
  },
  basketChipText: { fontSize: 12.5, color: "#fff", fontFamily: "Inter_600SemiBold" },
  basketChipX: { fontSize: 12, color: "rgba(255,255,255,0.75)", fontFamily: "Inter_700Bold" },

  quickCats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#d8d0bc",
  },
  quickCatBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#d8d0bc",
    backgroundColor: "#f5f0e6",
    minWidth: "47%",
    alignItems: "center",
  },
  quickCatText: { fontSize: 12, color: "#5a5040", fontFamily: "Inter_500Medium" },

  cuisineKicker: {
    marginTop: 14,
    marginBottom: 8,
    fontFamily: "Inter_700Bold",
    fontSize: 9.5,
    letterSpacing: 2,
    color: "#8a6a1f",
    textTransform: "uppercase",
  },
  cuisineRow: { gap: 8, paddingBottom: 4, paddingRight: 4 },
  cuisineChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#f7f2ea",
    borderWidth: 1,
    borderColor: "#ede5d4",
  },
  cuisineChipActive: {
    backgroundColor: "#1e1030",
    borderColor: "#1e1030",
  },
  cuisineChipText: {
    fontSize: 12,
    color: "#5a5040",
    fontFamily: "Inter_600SemiBold",
  },
  cuisineChipTextActive: {
    color: "#fbf6ec",
  },


  aiCard: {
    backgroundColor: "#fffdf8",
    borderColor: "#d8d0bc",
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 18,
    marginTop: 12,
  },
  aiDivider: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  aiDividerLine: { flex: 1, height: 1, backgroundColor: "rgba(139,79,209,0.25)" },
  aiDividerText: {
    fontSize: 10,
    letterSpacing: 1.6,
    color: "#8b4fd1",
    textTransform: "uppercase",
    fontFamily: "Inter_700Bold",
  },
  aiBtn: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#6a2fb8",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(106,47,184,0.06)",
  },
  aiBtnText: { fontSize: 14.5, fontFamily: "Inter_700Bold", letterSpacing: 0.3 },
  errorBox: {
    marginTop: 10,
    backgroundColor: "rgba(180,60,60,0.08)",
    borderColor: "rgba(180,60,60,0.3)",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  errorText: { fontSize: 12, color: "#9a3030", fontFamily: "Inter_500Medium" },

  sectionLabel: {
    fontSize: 11.5,
    letterSpacing: 1.6,
    color: "#5a2a8e",
    textTransform: "uppercase",
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },
  recentRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  recentChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d8d0bc",
    backgroundColor: "#fffdf8",
  },
  recentText: { fontSize: 12.5, color: "#1c1810", fontFamily: "Inter_600SemiBold" },

  proposalHead: { flexDirection: "row", marginBottom: 10, gap: 10 },
  proposalKicker: { fontSize: 11, color: "#5a2a8e", fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 1.2 },
  proposalCount: { fontSize: 12.5, color: "#3d3526", fontFamily: "Inter_500Medium", marginTop: 2 },
  closeBtn: {
    borderWidth: 1,
    borderColor: "#d8d0bc",
    backgroundColor: "#fffdf8",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  closeBtnText: { fontSize: 12.5, color: "#1c1810", fontFamily: "Inter_700Bold" },
  empty: {
    backgroundColor: "#fffdf8",
    borderColor: "#d8d0bc",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  emptyText: { color: "#4a4030", fontSize: 13.5, fontFamily: "Inter_500Medium" },
  proposalCard: {
    backgroundColor: "#fffdf8",
    borderColor: "#d8d0bc",
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  tag: {
    fontSize: 9,
    letterSpacing: 1,
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tagMeta: { fontSize: 11.5, color: "#4a4030", fontFamily: "Inter_500Medium" },
  proposalTitle: { fontSize: 15, color: "#1c1810", fontFamily: "CormorantGaramond_600SemiBold", marginTop: 4, lineHeight: 18 },
  proposalType: { fontSize: 11.5, color: "#3a5240", marginTop: 2, fontFamily: "Inter_500Medium" },

  starCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#fffdf8",
    borderWidth: 1.5,
    borderColor: "#8b4fd1",
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
  },
  starName: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#1c1810" },
  starCat: { fontSize: 12, color: "#5a2a8e", fontFamily: "Inter_700Bold", marginTop: 2, letterSpacing: 0.4, textTransform: "uppercase" },

  createBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5a2a8e",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  createBtnText: { fontSize: 15.5, fontFamily: "Inter_700Bold", letterSpacing: 0.4 },

  resultCard: {
    backgroundColor: "#fffdf8",
    borderColor: "#d8d0bc",
    borderWidth: 1.5,
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 14,
  },
  resultHead: {
    backgroundColor: "#f5ece0",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#d8d0bc",
  },
  resultType: {
    fontSize: 10,
    letterSpacing: 1.6,
    color: "#6e8b74",
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  resultTitle: { fontFamily: "Inter_700Bold", fontSize: 22, lineHeight: 26, color: "#1c1810" },
  resultMeta: { fontSize: 12, color: "#5a5040", marginTop: 6, fontFamily: "Inter_400Regular" },

  section: {
    fontSize: 11,
    letterSpacing: 1.6,
    color: "#8b4fd1",
    textTransform: "uppercase",
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },
  ingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: "#f5f0e6",
    borderWidth: 1,
    borderColor: "#d8d0bc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 6,
  },
  ingName: { fontSize: 13, color: "#1c1810", fontFamily: "Inter_600SemiBold", flex: 1 },
  ingG: { fontSize: 11, color: "#6e8b74", fontFamily: "Inter_500Medium" },
  stepRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#6e8b74",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  stepNumText: { color: "#fff", fontSize: 12, fontFamily: "Inter_700Bold" },
  stepText: { flex: 1, fontSize: 14, color: "#1c1810", lineHeight: 22, fontFamily: "Inter_400Regular" },

  tipBox: {
    backgroundColor: "rgba(110,139,116,0.1)",
    borderColor: "rgba(110,139,116,0.3)",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  tipLabel: {
    fontSize: 11,
    letterSpacing: 0.6,
    color: "#5a7460",
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  tipText: { fontSize: 13, color: "#5a5040", lineHeight: 19, fontFamily: "Inter_400Regular" },

  resultActions: { gap: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#d8d0bc" },
  outlineBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#d8d0bc",
    backgroundColor: "#f5f0e6",
    alignItems: "center",
  },
  outlineBtnText: { fontSize: 13, color: "#5a5040", fontFamily: "Inter_500Medium" },
  outlinePurple: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#8b4fd1",
    backgroundColor: "rgba(139,79,209,0.08)",
    alignItems: "center",
  },
  outlinePurpleText: { fontSize: 13, color: "#8b4fd1", fontFamily: "Inter_600SemiBold" },
  saveBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#6e8b74",
    backgroundColor: "rgba(110,139,116,0.1)",
    alignItems: "center",
  },
  saveBtnText: { fontSize: 13, color: "#5a7460", fontFamily: "Inter_600SemiBold" },
  savedBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#6e8b74",
    backgroundColor: "#6e8b74",
    alignItems: "center",
  },
  savedBtnText: { fontSize: 13, color: "#fff", fontFamily: "Inter_600SemiBold" },
});
