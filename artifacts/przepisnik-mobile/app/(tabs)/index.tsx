// Port webowego Home.tsx (Moje przepisy) na React Native.

import { Link as LinkIcon, Search, Sparkles, Star, X } from "lucide-react-native";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AddRecipeModal from "../../components/AddRecipeModal";
import SiteHeader from "../../components/SiteHeader";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useRecipes } from "../../context/RecipesContext";
import type { Recipe } from "../../data/recipes";
import { CategoryTile } from "../../lib/categoryIcons";

const DIFFICULTY_COLOR: Record<Recipe["difficulty"], string> = {
  łatwy: "#15995d",
  średni: "#b45309",
  trudny: "#dc2626",
};

const CATEGORIES = [
  "Wszystkie",
  "Dania główne",
  "Zupy",
  "Desery",
  "Śniadania",
  "Pieczywo",
  "Przetwory",
  "Świąteczne",
  "Z lodówki",
  "Pobrane",
  "Ulubione",
];

export default function HomeTab() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { allRecipes, favorites, toggleFavorite, addRecipe } = useRecipes();
  const { content } = useBreakpoint();

  const [selectedCategory, setSelectedCategory] = useState("Wszystkie");
  const [searchQuery, setSearchQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const q = searchQuery.trim().toLowerCase();

  const { listed, isPobrane, isUlubione, isKreator } = useMemo(() => {
    const showPobrane = selectedCategory === "Pobrane";
    const showUlubione = selectedCategory === "Ulubione";
    const showKreator = selectedCategory === "Z lodówki";

    let list: Recipe[];
    if (showUlubione) {
      list = allRecipes.filter((r) => favorites.has(r.id));
    } else if (showPobrane) {
      list = allRecipes.filter((r) => r.category === "Pobrane");
    } else if (showKreator) {
      list = allRecipes.filter((r) => r.category === "Kreator");
    } else if (selectedCategory === "Wszystkie") {
      list = allRecipes.filter((r) => r.category !== "Pobrane");
    } else {
      list = allRecipes.filter(
        (r) => r.category === selectedCategory && r.category !== "Pobrane",
      );
    }
    if (q) list = list.filter((r) => r.title.toLowerCase().includes(q));
    return {
      listed: list,
      isPobrane: showPobrane,
      isUlubione: showUlubione,
      isKreator: showKreator,
    };
  }, [allRecipes, favorites, selectedCategory, q]);

  const pobraneCount = allRecipes.filter((r) => r.category === "Pobrane").length;
  const ulubioneCount = allRecipes.filter((r) => favorites.has(r.id)).length;
  const kreatorCount = allRecipes.filter((r) => r.category === "Kreator").length;

  const onAddRecipe = () => setAddOpen(true);

  const handleSaveRecipe = (recipe: Recipe) => {
    addRecipe(recipe);
    router.push(`/przepis/${recipe.slug ?? recipe.id}`);
  };

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <SiteHeader showAdd onAdd={onAddRecipe} />

      <AddRecipeModal open={addOpen} onClose={() => setAddOpen(false)} onSave={handleSaveRecipe} />

      <FlatList
        data={listed}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{
          paddingTop: insets.top + 56,
          paddingHorizontal: content.paddingHorizontal,
          maxWidth: content.maxWidth,
          alignSelf: content.alignSelf,
          width: content.width,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Page intro */}
            <View style={styles.intro}>
              <Text style={styles.introKicker}>T W O J A   K U C H N I A</Text>
              <Text style={styles.introTitle}>
                Moje <Text style={styles.introTitleEm}>przepisy</Text>
              </Text>
              <Text style={styles.introSub}>
                Kolekcja smaków i chwil, zebrana w jednym miejscu.
              </Text>
            </View>

            {/* Search */}
            <View style={styles.searchWrap}>
              <Search size={16} color="#8b4fd1" strokeWidth={2} style={styles.searchIcon} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Szukaj przepisu..."
                placeholderTextColor="#a387bf"
                style={styles.search}
                autoCorrect={false}
                returnKeyType="search"
              />
              {searchQuery ? (
                <Pressable onPress={() => setSearchQuery("")} style={styles.searchClear} hitSlop={8}>
                  <X size={16} color="#8b8198" strokeWidth={2} />
                </Pressable>
              ) : null}
            </View>

            {/* Category chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chips}
            >
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                const isFav = cat === "Ulubione";
                const isKreatorChip = cat === "Z lodówki";
                const count = isFav
                  ? ulubioneCount
                  : cat === "Pobrane"
                    ? pobraneCount
                    : isKreatorChip
                      ? kreatorCount
                      : null;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    style={[
                      styles.chip,
                      active && (isFav ? styles.chipActiveGold : styles.chipActive),
                    ]}
                  >
                    {isFav ? (
                      <Star
                        size={11}
                        color={active ? "#fff" : "#837694"}
                        fill={active ? "#fff" : "transparent"}
                        strokeWidth={2}
                        style={{ marginRight: 4 }}
                      />
                    ) : null}
                    {isKreatorChip ? (
                      <Sparkles
                        size={11}
                        color={active ? "#fff" : "#8b4fd1"}
                        strokeWidth={2}
                        style={{ marginRight: 4 }}
                      />
                    ) : null}
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
                    {count !== null && count > 0 ? (
                      <View style={[styles.chipBadge, active && styles.chipBadgeActive]}>
                        <Text style={[styles.chipBadgeText, active && styles.chipBadgeTextActive]}>
                          {count}
                        </Text>
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </>
        }
        renderItem={({ item }) =>
          isPobrane ? (
            <PobraneRow recipe={item} onPress={() => router.push(`/przepis/${item.slug ?? item.id}`)} />
          ) : (
            <RecipeCard
              recipe={item}
              isFav={favorites.has(item.id)}
              onPress={() => router.push(`/przepis/${item.slug ?? item.id}`)}
              onToggleFav={() => toggleFavorite(item.id)}
            />
          )
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>
              {q
                ? "🔍"
                : isUlubione
                  ? "⭐"
                  : isPobrane
                    ? "🔗"
                    : isKreator
                      ? "✨"
                      : allRecipes.length === 0
                        ? "📖"
                        : "🍽️"}
            </Text>
            <Text style={styles.emptyText}>
              {q
                ? "Brak wyników."
                : isUlubione
                  ? "Brak ulubionych. Kliknij gwiazdkę przy przepisie."
                  : isPobrane
                    ? "Brak zapisanych linków."
                    : isKreator
                      ? "Brak przepisów z lodówki. Zapisz danie z zakładki „Z lodówki”."
                      : allRecipes.length === 0
                        ? "Brak przepisów. Dodaj swój pierwszy przepis."
                        : "Brak przepisów w tej kategorii."}
            </Text>
          </View>
        }
      />
    </View>
  );
}

function RecipeCard({
  recipe,
  isFav,
  onPress,
  onToggleFav,
}: {
  recipe: Recipe;
  isFav: boolean;
  onPress: () => void;
  onToggleFav: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.95, transform: [{ scale: 0.995 }] }]}
    >
      <CategoryTile category={recipe.category} size={44} />
      <View style={{ flex: 1, minWidth: 0, paddingRight: 6 }}>
        <Text style={styles.cardCategory}>{recipe.category}</Text>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {recipe.title}
        </Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {recipe.difficulty ? (
            <Text style={[styles.cardMeta, { color: DIFFICULTY_COLOR[recipe.difficulty], fontFamily: "Inter_600SemiBold" }]}>
              {recipe.difficulty}
            </Text>
          ) : null}
          {recipe.servings ? (
            <Text style={[styles.cardMeta, { color: "#8b8198" }]}>{recipe.servings} porcji</Text>
          ) : null}
        </View>
      </View>
      <Pressable
        onPress={(e) => {
          e.stopPropagation?.();
          onToggleFav();
        }}
        hitSlop={6}
        style={[
          styles.starBtn,
          {
            backgroundColor: isFav ? "#fef3c7" : "#f4ebfa",
            borderColor: isFav ? "#fde68a" : "#e6d8f0",
          },
        ]}
      >
        <Star
          size={19}
          color={isFav ? "#f59e0b" : "#8b4fd1"}
          fill={isFav ? "#f59e0b" : "transparent"}
          strokeWidth={2}
        />
      </Pressable>
    </Pressable>
  );
}

function PobraneRow({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.pobraneRow}>
      <LinkIcon size={12} color="#8b4fd1" strokeWidth={2} style={{ marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.pobraneTitle} numberOfLines={1}>
          {recipe.title}
        </Text>
        {recipe.sourceUrl ? (
          <Text style={styles.pobraneHost} numberOfLines={1}>
            {(() => {
              try {
                return new URL(recipe.sourceUrl!).hostname.replace("www.", "");
              } catch {
                return recipe.sourceUrl;
              }
            })()}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fbf6ec" },

  intro: { paddingTop: 12, paddingBottom: 12 },
  introKicker: {
    fontFamily: "Inter_700Bold",
    fontSize: 9.5,
    letterSpacing: 2,
    color: "#8a6a1f",
    marginBottom: 7,
  },
  introTitle: {
    fontFamily: "CormorantGaramond_500Medium",
    fontSize: 29,
    lineHeight: 33,
    color: "#1c1810",
    letterSpacing: 0.2,
  },
  introTitleEm: {
    fontFamily: "CormorantGaramond_400Regular_Italic",
    color: "#8b4fd1",
  },
  introSub: {
    marginTop: 6,
    fontFamily: "Inter_500Medium",
    fontSize: 12.5,
    lineHeight: 18,
    color: "#3d3526",
    maxWidth: 320,
  },

  searchWrap: { position: "relative", marginBottom: 14 },
  searchIcon: { position: "absolute", left: 16, top: 14, zIndex: 1 },
  search: {
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(28,24,16,0.08)",
    backgroundColor: "#fffdf8",
    paddingLeft: 42,
    paddingRight: 42,
    fontFamily: "Inter_400Regular",
    fontSize: 14.5,
    color: "#3a3326",
    shadowColor: "#1c1810",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  searchClear: { position: "absolute", right: 14, top: 16 },

  chips: { gap: 7, paddingBottom: 14, paddingRight: 4 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(28,24,16,0.08)",
    backgroundColor: "#fffdf8",
  },
  chipActive: { backgroundColor: "#8b4fd1", borderColor: "#8b4fd1" },
  chipActiveGold: { backgroundColor: "#b8923a", borderColor: "#b8923a" },
  chipText: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: "#2a2010", letterSpacing: 0.2 },
  chipTextActive: { color: "#fff", fontFamily: "Inter_600SemiBold" },
  chipBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 999,
    backgroundColor: "rgba(139,79,209,0.12)",
  },
  chipBadgeActive: { backgroundColor: "rgba(255,255,255,0.22)" },
  chipBadgeText: { fontFamily: "Inter_700Bold", fontSize: 10, color: "#8b4fd1" },
  chipBadgeTextActive: { color: "#fff" },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fffdf8",
    borderColor: "rgba(28,24,16,0.06)",
    borderWidth: 1,
    borderRadius: 18,
    padding: 11,
    shadowColor: "#1c1810",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  cardCategory: {
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    letterSpacing: 1.8,
    color: "#8a6a1f",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  cardTitle: {
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 16.5,
    lineHeight: 20,
    color: "#1c1810",
    marginBottom: 3,
  },
  cardMeta: { fontFamily: "Inter_500Medium", fontSize: 11, letterSpacing: 0.2 },
  starBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  pobraneRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fffdf8",
    borderColor: "rgba(28,24,16,0.06)",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    shadowColor: "#1c1810",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  pobraneTitle: { fontFamily: "Inter_500Medium", fontSize: 14, color: "#1c1810" },
  pobraneHost: { fontFamily: "Inter_400Regular", fontSize: 11, color: "#a89a7e", marginTop: 3 },

  empty: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
    backgroundColor: "rgba(255,253,248,0.6)",
    borderColor: "rgba(28,24,16,0.08)",
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 22,
  },
  emptyEmoji: { fontSize: 32, opacity: 0.5, marginBottom: 12 },
  emptyText: {
    fontFamily: "CormorantGaramond_400Regular_Italic",
    fontSize: 16,
    lineHeight: 22,
    color: "#7a6e58",
    textAlign: "center",
  },
});
