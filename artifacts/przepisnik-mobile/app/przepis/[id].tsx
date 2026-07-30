// Recipe detail — placeholder. Pełny port z webu (artifacts/przepisnik/src/pages/RecipeDetail.tsx
// ~640 linii) w kolejnej iteracji.

import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Print from "expo-print";
import { ChevronLeft, PencilLine, Printer, ShoppingCart, Star } from "lucide-react-native";
import React from "react";
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import EditRecipeModal from "../../components/EditRecipeModal";
import { useRecipes } from "../../context/RecipesContext";
import type { Recipe } from "../../data/recipes";
import { addIngredientsToShoppingList } from "../../lib/shoppingList";

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildRecipeHtml(recipe: Recipe): string {
  const meta = [recipe.prepTime, recipe.servings ? `${recipe.servings} porcji` : "", recipe.difficulty]
    .filter(Boolean)
    .map((m) => `<span class="pill">${escapeHtml(String(m))}</span>`)
    .join("");
  const ingredients = recipe.ingredients
    .map((ing) => `<li>${escapeHtml(ing)}</li>`)
    .join("");
  const steps = recipe.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join("");
  const desc = recipe.description ? `<p class="desc">${escapeHtml(recipe.description)}</p>` : "";
  const notes = recipe.notes
    ? `<h2>Wskazówka</h2><p class="notes">${escapeHtml(recipe.notes)}</p>`
    : "";
  return `<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, system-ui, "Segoe UI", Roboto, sans-serif; color: #1C1810; padding: 32px 28px; max-width: 720px; margin: 0 auto; }
    .emoji { font-size: 44px; text-align: center; margin: 0 0 4px; }
    .cat { text-align: center; letter-spacing: 2px; text-transform: uppercase; font-size: 11px; color: #8A7C5F; font-weight: 700; }
    h1 { text-align: center; font-size: 26px; color: #1C1810; margin: 6px 0 4px; }
    .desc { text-align: center; color: #6A5D44; font-size: 14px; margin: 4px 0 14px; }
    .meta { text-align: center; margin-bottom: 18px; }
    .pill { display: inline-block; border: 1px solid #E8DDC8; background: #F1E8FA; color: #003153; border-radius: 999px; padding: 4px 12px; font-size: 12px; margin: 3px; }
    h2 { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #C6A35B; border-bottom: 1px solid #E8DDC8; padding-bottom: 6px; margin: 24px 0 10px; }
    ul, ol { padding-left: 22px; margin: 0; }
    li { font-size: 14px; line-height: 1.7; color: #1C1810; margin-bottom: 4px; }
    ol li { margin-bottom: 8px; }
    .notes { font-style: italic; color: #6A5D44; font-size: 14px; line-height: 1.6; }
    .footer { margin-top: 36px; text-align: center; font-size: 11px; color: #b0a7bd; }
  </style></head><body>
    <div class="emoji">${escapeHtml(recipe.emoji || "🍽️")}</div>
    <div class="cat">${escapeHtml(recipe.category || "")}</div>
    <h1>${escapeHtml(recipe.title)}</h1>
    ${desc}
    <div class="meta">${meta}</div>
    <h2>Składniki</h2>
    <ul>${ingredients}</ul>
    <h2>Przygotowanie</h2>
    <ol>${steps}</ol>
    ${notes}
    <div class="footer">Przepiśnik · LowStyleLife</div>
  </body></html>`;
}

// expo-print's web implementation ignores the `html` option and prints the
// current page, so on web we render the recipe into a hidden iframe and print
// that instead. Native (iOS/Android) uses Print.printAsync({ html }) directly.
function printHtmlOnWeb(html: string): void {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
  const cleanup = () => {
    window.setTimeout(() => iframe.parentNode?.removeChild(iframe), 1000);
  };
  iframe.onload = () => {
    const win = iframe.contentWindow;
    if (!win) {
      cleanup();
      return;
    }
    win.onafterprint = cleanup;
    win.focus();
    win.print();
    cleanup();
  };
  iframe.srcdoc = html;
  document.body.appendChild(iframe);
}

export default function RecipeDetail() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { allRecipes, favorites, toggleFavorite, updateRecipe } = useRecipes();

  const recipe = allRecipes.find((r) => r.slug === id || r.id === id);
  const [printing, setPrinting] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  if (!recipe) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Pressable onPress={() => router.back()} style={styles.back} hitSlop={8}>
          <ChevronLeft size={20} color="#7B4AB8" strokeWidth={2} />
          <Text style={styles.backText}>Wstecz</Text>
        </Pressable>
        <Text style={styles.empty}>Nie znaleziono przepisu.</Text>
      </View>
    );
  }

  const isFav = favorites.has(recipe.id);
  const hasFullRecipe = recipe.ingredients.length > 0 || recipe.steps.length > 0;
  const sourceUrl = recipe.sourceUrl;
  const isSavedLink = Boolean(sourceUrl) && !hasFullRecipe;

  async function handlePrint() {
    if (!recipe || printing) return;
    if (isSavedLink) {
      Alert.alert("Zapisany link", "Ten wpis jest linkiem do przepisu, nie pełnym przepisem do wydruku.");
      return;
    }
    setPrinting(true);
    try {
      const html = buildRecipeHtml(recipe);
      if (Platform.OS === "web") {
        printHtmlOnWeb(html);
      } else {
        await Print.printAsync({ html });
      }
    } catch (e) {
      Alert.alert("Drukowanie", e instanceof Error ? e.message : "Nie udało się otworzyć drukowania.");
    } finally {
      setPrinting(false);
    }
  }

  async function handleOpenSourceUrl() {
    if (!sourceUrl) return;
    try {
      await Linking.openURL(sourceUrl);
    } catch {
      Alert.alert("Link", "Nie udało się otworzyć linku.");
    }
  }

  async function handleAddIngredientsToShoppingList() {
    if (!recipe || !recipe.ingredients.length) {
      Alert.alert("Lista zakupów", "Ten przepis nie ma jeszcze składników do dodania.");
      return;
    }

    try {
      const count = await addIngredientsToShoppingList(recipe.ingredients);
      Alert.alert(
        "Dodano do listy zakupów",
        `Dodano ${count} składnik${count === 1 ? "" : count < 5 ? "i" : "ów"} z przepisu.`,
      );
    } catch {
      Alert.alert("Lista zakupów", "Nie udało się dodać składników do listy.");
    }
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 18,
        paddingBottom: insets.bottom + 32,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <EditRecipeModal
        open={editOpen}
        recipe={recipe}
        onClose={() => setEditOpen(false)}
        onSave={updateRecipe}
      />

      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.back} hitSlop={8}>
          <ChevronLeft size={20} color="#7B4AB8" strokeWidth={2} />
          <Text style={styles.backText}>Wstecz</Text>
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable onPress={() => setEditOpen(true)} hitSlop={8}>
            <PencilLine size={22} color="#7B4AB8" strokeWidth={2} />
          </Pressable>
          <Pressable onPress={handlePrint} hitSlop={8} disabled={printing} style={printing && styles.actionDisabled}>
            <Printer size={22} color="#7B4AB8" strokeWidth={2} />
          </Pressable>
          <Pressable onPress={() => toggleFavorite(recipe.id)} hitSlop={8}>
            <Star
              size={22}
              color={isFav ? "#C6A35B" : "#7B4AB8"}
              fill={isFav ? "#C6A35B" : "transparent"}
              strokeWidth={2}
            />
          </Pressable>
        </View>
      </View>

      <Text style={styles.emoji}>{recipe.emoji}</Text>
      <Text style={styles.cat}>{recipe.category}</Text>
      <Text style={styles.title}>{recipe.title}</Text>
      {recipe.description ? <Text style={styles.desc}>{recipe.description}</Text> : null}

      {isSavedLink ? (
        <View style={styles.sourceCard}>
          <Text style={styles.sourceKicker}>Zapisany link</Text>
          <Text style={styles.sourceTitle}>Ten przepis czeka pod zapisanym adresem.</Text>
          <Text style={styles.sourceText} numberOfLines={3}>
            {recipe.sourceUrl}
          </Text>
          <Pressable onPress={handleOpenSourceUrl} style={styles.sourceButton}>
            <Text style={styles.sourceButtonText}>Otwórz link</Text>
          </Pressable>
        </View>
      ) : null}

      {hasFullRecipe ? (
        <>
      <View style={styles.meta}>
        {recipe.prepTime ? <Pill text={recipe.prepTime} /> : null}
        {recipe.servings ? <Pill text={`${recipe.servings} porcji`} /> : null}
        {recipe.difficulty ? <Pill text={recipe.difficulty} /> : null}
      </View>

      <Text style={styles.section}>Składniki</Text>
      {recipe.ingredients.length ? (
        <Pressable
          onPress={handleAddIngredientsToShoppingList}
          style={({ pressed }) => [styles.shoppingBtn, pressed && { opacity: 0.86 }]}
        >
          <ShoppingCart size={17} color="#fff" strokeWidth={2} />
          <Text style={styles.shoppingBtnText}>Dodaj składniki do listy zakupów</Text>
        </Pressable>
      ) : null}
      <View style={styles.list}>
        {recipe.ingredients.map((ing, i) => (
          <Text key={i} style={styles.li}>
            • {ing}
          </Text>
        ))}
      </View>

      <Text style={styles.section}>Przygotowanie</Text>
      <View style={styles.list}>
        {recipe.steps.map((s, i) => (
          <View key={i} style={{ flexDirection: "row", marginBottom: 8 }}>
            <Text style={styles.stepNum}>{i + 1}.</Text>
            <Text style={styles.stepText}>{s}</Text>
          </View>
        ))}
      </View>
        </>
      ) : !isSavedLink ? (
        <View style={styles.sourceCard}>
          <Text style={styles.sourceKicker}>Przepis roboczy</Text>
          <Text style={styles.sourceTitle}>Ten wpis nie ma jeszcze składników ani kroków.</Text>
          <Text style={styles.sourceText}>
            Wróć do listy i dodaj pełną wersję przepisu, kiedy będziesz gotowa.
          </Text>
        </View>
      ) : null}

      {recipe.notes ? (
        <>
          <Text style={styles.section}>Wskazówka</Text>
          <View style={styles.list}>
            <Text style={[styles.li, { fontStyle: "italic" }]}>{recipe.notes}</Text>
          </View>
        </>
      ) : null}

      {recipe.handwrittenNote ? (
        <>
          <Text style={styles.section}>Notatka odręczna</Text>
          <View style={[styles.list, styles.handNoteBox]}>
            <Text style={[styles.li, styles.handNoteText]}>{recipe.handwrittenNote}</Text>
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}

function Pill({ text }: { text: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F1EA" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 18 },
  actionDisabled: { opacity: 0.4 },
  back: { flexDirection: "row", alignItems: "center", gap: 4 },
  backText: { fontFamily: "Inter_500Medium", fontSize: 15, color: "#7B4AB8" },
  emoji: { fontSize: 56, textAlign: "center", marginTop: 8, marginBottom: 6 },
  cat: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: "#8A7C5F",
    textAlign: "center",
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    color: "#1C1810",
    textAlign: "center",
    lineHeight: 30,
    marginTop: 4,
  },
  desc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#8A7C5F",
    lineHeight: 20,
    textAlign: "center",
    marginTop: 6,
  },
  sourceCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8DDC8",
    backgroundColor: "#fffdfb",
    padding: 16,
    marginTop: 18,
    gap: 8,
  },
  sourceKicker: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#C6A35B",
  },
  sourceTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#1C1810",
    lineHeight: 21,
  },
  sourceText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#6A5D44",
    lineHeight: 19,
  },
  sourceButton: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "#7B4AB8",
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginTop: 4,
  },
  sourceButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: "#fff",
  },
  shoppingBtn: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    backgroundColor: "#7B4AB8",
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 8,
    marginBottom: 10,
  },
  shoppingBtnText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E8DDC8",
    backgroundColor: "#E9DDF4",
  },
  pillText: { fontFamily: "Inter_500Medium", fontSize: 11, color: "#003153", letterSpacing: 0.5 },
  section: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#C6A35B",
    marginTop: 22,
    marginBottom: 8,
  },
  list: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8DDC8",
    backgroundColor: "#fffdfb",
    padding: 14,
    gap: 4,
  },
  handNoteBox: {
    borderStyle: "dashed",
    backgroundColor: "#FFF9EC",
  },
  li: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 22, color: "#1C1810" },
  handNoteText: {
    fontFamily: "CormorantGaramond_400Regular_Italic",
    fontSize: 17,
    lineHeight: 24,
    color: "#4f3f24",
  },
  stepNum: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#7B4AB8",
    width: 24,
    lineHeight: 20,
  },
  stepText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#1C1810",
    flex: 1,
  },
  empty: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#8A7C5F",
    textAlign: "center",
    marginTop: 32,
  },
});
