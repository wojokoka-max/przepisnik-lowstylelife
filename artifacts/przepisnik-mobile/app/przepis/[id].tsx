// Recipe detail — placeholder. Pełny port z webu (artifacts/przepisnik/src/pages/RecipeDetail.tsx
// ~640 linii) w kolejnej iteracji.

import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Print from "expo-print";
import { ChevronLeft, Printer, Star } from "lucide-react-native";
import React from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useRecipes } from "../../context/RecipesContext";
import type { Recipe } from "../../data/recipes";

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
    body { font-family: -apple-system, system-ui, "Segoe UI", Roboto, sans-serif; color: #2b2238; padding: 32px 28px; max-width: 720px; margin: 0 auto; }
    .emoji { font-size: 44px; text-align: center; margin: 0 0 4px; }
    .cat { text-align: center; letter-spacing: 2px; text-transform: uppercase; font-size: 11px; color: #a387bf; font-weight: 700; }
    h1 { text-align: center; font-size: 26px; color: #34284b; margin: 6px 0 4px; }
    .desc { text-align: center; color: #6f6580; font-size: 14px; margin: 4px 0 14px; }
    .meta { text-align: center; margin-bottom: 18px; }
    .pill { display: inline-block; border: 1px solid #dccfea; background: #f1e8fa; color: #4b3a66; border-radius: 999px; padding: 4px 12px; font-size: 12px; margin: 3px; }
    h2 { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #b88a2c; border-bottom: 1px solid #ece4f3; padding-bottom: 6px; margin: 24px 0 10px; }
    ul, ol { padding-left: 22px; margin: 0; }
    li { font-size: 14px; line-height: 1.7; color: #34284b; margin-bottom: 4px; }
    ol li { margin-bottom: 8px; }
    .notes { font-style: italic; color: #6f6580; font-size: 14px; line-height: 1.6; }
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
  const { allRecipes, favorites, toggleFavorite } = useRecipes();

  const recipe = allRecipes.find((r) => r.slug === id || r.id === id);
  const [printing, setPrinting] = React.useState(false);

  if (!recipe) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Pressable onPress={() => router.back()} style={styles.back} hitSlop={8}>
          <ChevronLeft size={20} color="#8b4fd1" strokeWidth={2} />
          <Text style={styles.backText}>Wstecz</Text>
        </Pressable>
        <Text style={styles.empty}>Nie znaleziono przepisu.</Text>
      </View>
    );
  }

  const isFav = favorites.has(recipe.id);

  async function handlePrint() {
    if (!recipe || printing) return;
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

      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.back} hitSlop={8}>
          <ChevronLeft size={20} color="#8b4fd1" strokeWidth={2} />
          <Text style={styles.backText}>Wstecz</Text>
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable onPress={handlePrint} hitSlop={8} disabled={printing} style={printing && styles.actionDisabled}>
            <Printer size={22} color="#8b4fd1" strokeWidth={2} />
          </Pressable>
          <Pressable onPress={() => toggleFavorite(recipe.id)} hitSlop={8}>
            <Star
              size={22}
              color={isFav ? "#f59e0b" : "#8b4fd1"}
              fill={isFav ? "#f59e0b" : "transparent"}
              strokeWidth={2}
            />
          </Pressable>
        </View>
      </View>

      <Text style={styles.emoji}>{recipe.emoji}</Text>
      <Text style={styles.cat}>{recipe.category}</Text>
      <Text style={styles.title}>{recipe.title}</Text>
      {recipe.description ? <Text style={styles.desc}>{recipe.description}</Text> : null}

      <View style={styles.meta}>
        {recipe.prepTime ? <Pill text={recipe.prepTime} /> : null}
        {recipe.servings ? <Pill text={`${recipe.servings} porcji`} /> : null}
        {recipe.difficulty ? <Pill text={recipe.difficulty} /> : null}
      </View>

      <Text style={styles.section}>Składniki</Text>
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

      {recipe.notes ? (
        <>
          <Text style={styles.section}>Wskazówka</Text>
          <View style={styles.list}>
            <Text style={[styles.li, { fontStyle: "italic" }]}>{recipe.notes}</Text>
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
  root: { flex: 1, backgroundColor: "#f5f1ea" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 18 },
  actionDisabled: { opacity: 0.4 },
  back: { flexDirection: "row", alignItems: "center", gap: 4 },
  backText: { fontFamily: "Inter_500Medium", fontSize: 15, color: "#8b4fd1" },
  emoji: { fontSize: 56, textAlign: "center", marginTop: 8, marginBottom: 6 },
  cat: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: "#a387bf",
    textAlign: "center",
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    color: "#34284b",
    textAlign: "center",
    lineHeight: 30,
    marginTop: 4,
  },
  desc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#8b8198",
    lineHeight: 20,
    textAlign: "center",
    marginTop: 6,
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
    borderColor: "#dccfea",
    backgroundColor: "#ebdcf5",
  },
  pillText: { fontFamily: "Inter_500Medium", fontSize: 11, color: "#4b3a66", letterSpacing: 0.5 },
  section: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#b88a2c",
    marginTop: 22,
    marginBottom: 8,
  },
  list: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ebe3ef",
    backgroundColor: "#fffdfb",
    padding: 14,
    gap: 4,
  },
  li: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 22, color: "#34284b" },
  stepNum: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#8b4fd1",
    width: 24,
    lineHeight: 20,
  },
  stepText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#34284b",
    flex: 1,
  },
  empty: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#8b8198",
    textAlign: "center",
    marginTop: 32,
  },
});
