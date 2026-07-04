// 1:1 port webowego Planner.tsx (artifacts/przepisnik/src/pages/Planner.tsx) na React Native.
// Te same dane (data/planner.ts), te same diety, sloty, skalowanie kcal i zapis do Moich przepisów.

import { Bookmark, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SiteHeader from "../../components/SiteHeader";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useRecipes } from "../../context/RecipesContext";
import { generateSlug } from "../../data/recipes";
import {
  CUISINES,
  CUISINE_EMOJI,
  CUISINE_LABELS,
  DIETS,
  DIET_EMOJI,
  DIET_LABELS,
  DIET_PLANS,
  SLOTS,
  SLOT_EMOJI,
  SLOT_LABELS,
  filterPoolByCuisine,
  getDish,
  pickDiverseTriple,
  type Cuisine,
  type DietName,
  type MealSlot,
  type PlanerDish,
} from "../../data/planner";
import { formatScaledIngredients } from "../../data/portions";

const SLOT_CATEGORY: Record<MealSlot, string> = {
  sniadanie: "Śniadania",
  drugie_sniadanie: "Śniadania",
  obiad: "Dania główne",
  podwieczorek: "Desery",
  kolacja: "Dania główne",
};

const KCAL_TARGETS = [1600, 1800, 2000, 2200, 2500, 2800, 3000] as const;
type KcalTarget = (typeof KCAL_TARGETS)[number];
const KCAL_KEY = "pp-planer-kcal-target";
const DEFAULT_TARGET: KcalTarget = 2000;

const ZERO_INDEXES: Record<MealSlot, number> = {
  sniadanie: 0,
  drugie_sniadanie: 0,
  obiad: 0,
  podwieczorek: 0,
  kolacja: 0,
};

function daySeed() {
  return Math.floor(Date.now() / 86_400_000);
}

function getDailyThree(
  d: DietName,
  c: Cuisine | null,
): Record<MealSlot, number[]> {
  const seed = daySeed();
  // Dedup między posiłkami: te same dania nie powinny wracać w kilku posiłkach
  // jednego dnia (pule obiadu i kolacji mocno się pokrywają).
  const used = new Set<number>();
  return Object.fromEntries(
    SLOTS.map((slot, si) => {
      const pool = filterPoolByCuisine(DIET_PLANS[d][slot], c);
      if (pool.length === 0) return [slot, []];
      const triple = pickDiverseTriple(pool, seed + si * 17, used);
      // Usuń ewentualne powtórki (pula miała <3 różne dania) — pokazujemy tylko
      // realnie różne alternatywy, nigdy tego samego dania dwa razy.
      const alternatives = [...new Set(triple)].filter((id) => id > 0);
      alternatives.forEach((id) => used.add(id));
      return [slot, alternatives];
    }),
  ) as Record<MealSlot, number[]>;
}

function scaleDish(d: PlanerDish, factor: number): PlanerDish {
  const r = (n: number) => Math.round(n);
  return { ...d, kcal: r(d.kcal * factor), B: r(d.B * factor), T: r(d.T * factor), W: r(d.W * factor) };
}

export default function PlanerTab() {
  const insets = useSafeAreaInsets();
  const { content } = useBreakpoint();
  const { width: winW } = useWindowDimensions();
  const macroGrid2 = winW < 360;
  const { addRecipe, allRecipes } = useRecipes();

  const [diet, setDiet] = useState<DietName>("low_carb");
  const [cuisine, setCuisine] = useState<Cuisine | null>(null);
  const [selection, setSelection] = useState(() => getDailyThree("low_carb", null));
  const [indexes, setIndexes] = useState<Record<MealSlot, number>>(ZERO_INDEXES);
  const [kcalTarget, setKcalTarget] = useState<KcalTarget>(DEFAULT_TARGET);
  const [toast, setToast] = useState<string | null>(null);
  const toastAnim = useState(new Animated.Value(0))[0];

  // load persisted kcal target
  useEffect(() => {
    AsyncStorage.getItem(KCAL_KEY)
      .then((raw) => {
        const n = raw ? Number(raw) : NaN;
        if ((KCAL_TARGETS as readonly number[]).includes(n)) setKcalTarget(n as KcalTarget);
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    AsyncStorage.setItem(KCAL_KEY, String(kcalTarget)).catch(() => {});
  }, [kcalTarget]);

  // toast animation
  useEffect(() => {
    if (!toast) return;
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 220, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
      Animated.delay(2400),
      Animated.timing(toastAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => setToast(null));
  }, [toast, toastAnim]);

  const baseKcalSum = useMemo(
    () =>
      SLOTS.reduce((s, slot) => {
        const id = selection[slot][indexes[slot]];
        return id ? s + getDish(id).kcal : s;
      }, 0),
    [selection, indexes],
  );
  const scaleFactor = baseKcalSum > 0 ? kcalTarget / baseKcalSum : 1;

  const dayMacros = SLOTS.reduce(
    (acc, slot) => {
      const id = selection[slot][indexes[slot]];
      if (!id) return acc;
      const d = scaleDish(getDish(id), scaleFactor);
      return { kcal: acc.kcal + d.kcal, B: acc.B + d.B, T: acc.T + d.T, W: acc.W + d.W };
    },
    { kcal: 0, B: 0, T: 0, W: 0 },
  );

  function isSaved(dish: PlanerDish) {
    return allRecipes.some((r) => r.title === dish.nazwa);
  }

  function saveToBook(baseDish: PlanerDish, slot: MealSlot) {
    const dish = scaleDish(baseDish, scaleFactor);
    if (isSaved(dish)) return;
    addRecipe({
      id: `planer-${dish.id}-${Date.now()}`,
      slug: generateSlug(dish.nazwa),
      title: dish.nazwa,
      description: dish.opis,
      category: SLOT_CATEGORY[slot],
      prepTime: `${dish.czas} min`,
      servings: 2,
      difficulty: "łatwy",
      emoji: SLOT_EMOJI[slot],
      ingredients: formatScaledIngredients(dish.skladniki, dish.kcal),
      steps: dish.przygotowanie.split(".").map((s) => s.trim()).filter(Boolean),
      notes: `kcal: ${dish.kcal} | B: ${dish.B}g | T: ${dish.T}g | W: ${dish.W}g`,
    });
    setToast(`„${dish.nazwa}" zapisano w przepisach`);
  }

  function swap(slot: MealSlot, dir: 1 | -1) {
    const count = selection[slot].length || 1;
    setIndexes((prev) => ({ ...prev, [slot]: (prev[slot] + dir + count) % count }));
  }

  const today = new Date().toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <SiteHeader showAdd={false} onAdd={() => {}} />

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 52,
          maxWidth: content.maxWidth,
          alignSelf: content.alignSelf,
          width: content.width,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.heroDate}>{today.toUpperCase()}</Text>
          <Text style={styles.heroTitle}>
            Twój dzień <Text style={{ fontFamily: "CormorantGaramond_400Regular_Italic", color: "#d8b15c" }}>na talerzu</Text>
          </Text>
          <View style={[styles.macroRow, macroGrid2 && styles.macroRowGrid]}>
            {[
              { label: `cel ${kcalTarget}`, val: dayMacros.kcal, unit: "", gold: true },
              { label: "białko", val: dayMacros.B, unit: "g" },
              { label: "tłuszcz", val: dayMacros.T, unit: "g" },
              { label: "węgl.", val: dayMacros.W, unit: "g" },
            ].map((m, i) => {
              const borderColor = "rgba(255,255,255,0.08)";
              const cellBorder = macroGrid2
                ? {
                    width: "50%" as const,
                    borderRightWidth: i % 2 === 0 ? 1 : 0,
                    borderBottomWidth: i < 2 ? 1 : 0,
                    borderColor,
                  }
                : {
                    flex: 1,
                    borderRightWidth: i < 3 ? 1 : 0,
                    borderRightColor: borderColor,
                  };
              return (
                <View key={i} style={[styles.macroCell, cellBorder]}>
                  <Text
                    style={[styles.macroVal, { color: m.gold ? "#d8b15c" : "#f5f1ea" }]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {m.val}
                    <Text style={styles.macroUnit}>{m.unit}</Text>
                  </Text>
                  <Text style={styles.macroLabel} numberOfLines={1}>
                    {m.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* KCAL TARGET */}
        <View style={{ paddingHorizontal: 16, paddingTop: 18 }}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>Cel kaloryczny / dobę</Text>
            <Text style={styles.sectionRight}>{kcalTarget} kcal</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            {KCAL_TARGETS.map((t) => {
              const active = kcalTarget === t;
              return (
                <Pressable
                  key={t}
                  onPress={() => setKcalTarget(t)}
                  style={[styles.kcalChip, active && styles.kcalChipActive]}
                >
                  <Text style={[styles.kcalChipText, active && styles.kcalChipTextActive]}>{t} kcal</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* DIET */}
        <View style={{ paddingHorizontal: 16, paddingTop: 18 }}>
          <Text style={[styles.sectionLabel, { marginBottom: 8 }]}>Dieta</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            {DIETS.map((d) => {
              const active = diet === d;
              return (
                <Pressable
                  key={d}
                  onPress={() => {
                    setDiet(d);
                    setSelection(getDailyThree(d, cuisine));
                    setIndexes(ZERO_INDEXES);
                  }}
                  style={[styles.dietChip, active && styles.dietChipActive]}
                >
                  <Text style={{ marginRight: 6 }}>{DIET_EMOJI[d]}</Text>
                  <Text style={[styles.dietChipText, active && styles.dietChipTextActive]}>
                    {DIET_LABELS[d]}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* CUISINE */}
        <View style={{ paddingHorizontal: 16, paddingTop: 18 }}>
          <Text style={[styles.sectionLabel, { marginBottom: 8 }]}>Kuchnia świata</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            <Pressable
              onPress={() => {
                setCuisine(null);
                setSelection(getDailyThree(diet, null));
                setIndexes(ZERO_INDEXES);
              }}
              style={[styles.dietChip, cuisine === null && styles.cuisineChipActive]}
            >
              <Text style={{ marginRight: 6 }}>🌍</Text>
              <Text style={[styles.dietChipText, cuisine === null && styles.dietChipTextActive]}>
                Wszystkie
              </Text>
            </Pressable>
            {CUISINES.map((c) => {
              const active = cuisine === c;
              return (
                <Pressable
                  key={c}
                  onPress={() => {
                    setCuisine(c);
                    setSelection(getDailyThree(diet, c));
                    setIndexes(ZERO_INDEXES);
                  }}
                  style={[styles.dietChip, active && styles.cuisineChipActive]}
                >
                  <Text style={{ marginRight: 6 }}>{CUISINE_EMOJI[c]}</Text>
                  <Text style={[styles.dietChipText, active && styles.dietChipTextActive]}>
                    {CUISINE_LABELS[c]}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* MEAL CARDS */}
        <View style={{ paddingHorizontal: 16, paddingTop: 18 }}>
          {SLOTS.map((slot) => {
            const alternatives = selection[slot];
            if (alternatives.length === 0) {
              return <EmptySlotCard key={slot} slot={slot} cuisine={cuisine} />;
            }
            const idx = Math.min(indexes[slot], alternatives.length - 1);
            const id = alternatives[idx];
            const dish = scaleDish(getDish(id), scaleFactor);
            const saved = isSaved(dish);
            return (
              <MealCard
                key={slot}
                slot={slot}
                idx={idx}
                total={alternatives.length}
                dish={dish}
                saved={saved}
                onSwap={(dir) => swap(slot, dir)}
                onPickDot={(i) => setIndexes((p) => ({ ...p, [slot]: i }))}
                onSave={() => saveToBook(dish, slot)}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* TOAST */}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            {
              bottom: insets.bottom + 80,
              opacity: toastAnim,
              transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
            },
          ]}
        >
          <Bookmark size={14} color="#a78bfa" fill="#a78bfa" strokeWidth={2} />
          <Text style={styles.toastText}>{toast}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

function EmptySlotCard({ slot, cuisine }: { slot: MealSlot; cuisine: Cuisine | null }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
          <View style={styles.slotEmojiBox}>
            <Text style={{ fontSize: 18 }}>{SLOT_EMOJI[slot]}</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.slotLabel}>{SLOT_LABELS[slot]}</Text>
            <Text style={styles.dishName} numberOfLines={2}>
              Brak propozycji
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.ingredients}>
          Dla wybranej diety i kuchni{cuisine ? ` „${CUISINE_LABELS[cuisine]}"` : ""} nie znaleźliśmy dania na ten posiłek. Wybierz inną kuchnię lub „Wszystkie".
        </Text>
      </View>
    </View>
  );
}

function MealCard({
  slot,
  idx,
  total,
  dish,
  saved,
  onSwap,
  onPickDot,
  onSave,
}: {
  slot: MealSlot;
  idx: number;
  total: number;
  dish: PlanerDish;
  saved: boolean;
  onSwap: (dir: 1 | -1) => void;
  onPickDot: (i: number) => void;
  onSave: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.card}>
      {/* header */}
      <View style={styles.cardHead}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
          <View style={styles.slotEmojiBox}>
            <Text style={{ fontSize: 18 }}>{SLOT_EMOJI[slot]}</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.slotLabel}>{SLOT_LABELS[slot]}</Text>
            <Text style={styles.dishName} numberOfLines={2}>
              {dish.nazwa}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.kcalVal}>{dish.kcal}</Text>
          <Text style={styles.kcalLabel}>KCAL</Text>
        </View>
      </View>

      {/* body */}
      <View style={styles.cardBody}>
        <View style={styles.ingredientsBox}>
          <Text style={styles.ingredientsLabel}>Składniki (1 porcja)</Text>
          {formatScaledIngredients(dish.skladniki, dish.kcal).map((line, i) => (
            <View key={i} style={styles.ingredientRow}>
              <View style={styles.ingredientBullet} />
              <Text style={styles.ingredientLine}>{line}</Text>
            </View>
          ))}
          <Text style={styles.ingredientsHint}>ilości orientacyjne — dostosuj do siebie</Text>
        </View>

        <View style={styles.macros}>
          {[
            { l: "Białko", v: dish.B, u: "g", c: "#8b4fd1" },
            { l: "Tłuszcz", v: dish.T, u: "g", c: "#6b6070" },
            { l: "Węgle.", v: dish.W, u: "g", c: "#2e7d32" },
          ].map((m) => (
            <View key={m.l} style={styles.macroBox}>
              <Text style={[styles.macroBoxVal, { color: m.c }]}>
                {m.v}
                <Text style={styles.macroBoxUnit}>{m.u}</Text>
              </Text>
              <Text style={styles.macroBoxLabel}>{m.l}</Text>
            </View>
          ))}
        </View>

        {/* swap row */}
        <View style={styles.swapRow}>
          <Pressable onPress={() => onSwap(-1)} style={styles.swapBtn} hitSlop={4}>
            <ChevronLeft size={16} color="#8b4fd1" strokeWidth={2} />
          </Pressable>
          <View style={styles.dotsRow}>
            {Array.from({ length: total }, (_, i) => (
              <Pressable
                key={i}
                onPress={() => onPickDot(i)}
                hitSlop={6}
                style={[
                  styles.dot,
                  { width: i === idx ? 20 : 8, backgroundColor: i === idx ? "#8b4fd1" : "#ddd8e8" },
                ]}
              />
            ))}
          </View>
          <Pressable onPress={() => onSwap(1)} style={styles.swapBtn} hitSlop={4}>
            <ChevronRight size={16} color="#8b4fd1" strokeWidth={2} />
          </Pressable>
          <Text style={styles.idxText}>{idx + 1} / {total}</Text>
        </View>

        {/* prep collapse */}
        <Pressable onPress={() => setOpen((o) => !o)} style={styles.prepHead} hitSlop={4}>
          {open ? (
            <ChevronDown size={11} color="#a09090" strokeWidth={2} />
          ) : (
            <ChevronRight size={11} color="#a09090" strokeWidth={2} />
          )}
          <Text style={styles.prepHeadText}>Sposób przygotowania</Text>
        </Pressable>
        {open ? <Text style={styles.prepText}>{dish.przygotowanie}</Text> : null}

        {/* save button */}
        <Pressable
          onPress={onSave}
          disabled={saved}
          style={[styles.saveBtn, saved ? styles.saveBtnSaved : styles.saveBtnUnsaved]}
        >
          <Bookmark
            size={15}
            color={saved ? "#8b4fd1" : "#fff"}
            fill={saved ? "#8b4fd1" : "transparent"}
            strokeWidth={2}
          />
          <Text style={[styles.saveBtnText, { color: saved ? "#8b4fd1" : "#fff" }]}>
            {saved ? "Zapisano w przepisach" : "Zapisz w przepisach"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fbf6ec" },

  hero: {
    backgroundColor: "#0e1a2c",
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 24,
    alignItems: "center",
    borderRadius: 26,
    shadowColor: "#0e1a2c",
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  heroDate: {
    color: "#d8b15c",
    fontSize: 9,
    letterSpacing: 3,
    marginBottom: 9,
    fontFamily: "Inter_500Medium",
  },
  heroTitle: {
    color: "#f5efe0",
    fontSize: 26,
    lineHeight: 30,
    fontFamily: "CormorantGaramond_500Medium",
    letterSpacing: 0.3,
    marginBottom: 14,
  },
  macroRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
    maxWidth: 360,
    borderWidth: 1,
    borderColor: "rgba(216,177,92,0.12)",
  },
  macroRowGrid: { flexWrap: "wrap" },
  macroCell: { paddingVertical: 12, paddingHorizontal: 4, alignItems: "center" },
  macroVal: { fontFamily: "CormorantGaramond_500Medium", fontSize: 22, lineHeight: 24 },
  macroUnit: { fontSize: 10, opacity: 0.55, fontFamily: "Inter_400Regular" },
  macroLabel: {
    fontSize: 8.5,
    letterSpacing: 1,
    color: "rgba(245,239,224,0.55)",
    marginTop: 5,
    textTransform: "uppercase",
    fontFamily: "Inter_500Medium",
  },

  sectionRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  sectionLabel: {
    fontSize: 11.5,
    letterSpacing: 1.8,
    color: "#1c1810",
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
  },
  sectionRight: { fontSize: 12, color: "#5a2a8e", fontFamily: "Inter_700Bold", letterSpacing: 0.3 },
  chipsRow: { gap: 7, paddingBottom: 4, paddingRight: 4 },

  kcalChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ddd3e7",
    backgroundColor: "#fff",
  },
  kcalChipActive: { backgroundColor: "#d8b15c", borderColor: "#d8b15c" },
  kcalChipText: { fontSize: 13, color: "#2a1f3a", fontFamily: "Inter_600SemiBold" },
  kcalChipTextActive: { color: "#1a0d24", fontFamily: "Inter_700Bold" },

  dietChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ddd3e7",
    backgroundColor: "#fff",
  },
  dietChipActive: { backgroundColor: "#8b4fd1", borderColor: "#8b4fd1" },
  cuisineChipActive: { backgroundColor: "#1e1030", borderColor: "#1e1030" },
  dietChipText: { fontSize: 13, color: "#7a6d8a", fontFamily: "Inter_500Medium" },
  dietChipTextActive: { color: "#fff", fontFamily: "Inter_600SemiBold" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(7,17,31,0.07)",
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0ece4",
    backgroundColor: "#faf8f4",
  },
  slotEmojiBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f5f1ea",
    borderWidth: 1,
    borderColor: "#e8e2d8",
    alignItems: "center",
    justifyContent: "center",
  },
  slotLabel: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: "#a09090",
    fontFamily: "Inter_500Medium",
  },
  dishName: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#1a1a2e", marginTop: 1 },
  kcalVal: { fontFamily: "Inter_700Bold", fontSize: 18, color: "#8b4fd1" },
  kcalLabel: {
    fontSize: 9,
    color: "#a09090",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontFamily: "Inter_500Medium",
  },

  cardBody: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 14 },
  ingredients: { fontSize: 12, color: "#6b6070", lineHeight: 18, marginBottom: 10, fontFamily: "Inter_400Regular" },
  ingredientsBox: {
    backgroundColor: "#faf6f0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#efe9df",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  ingredientsLabel: {
    fontFamily: "Inter_700Bold",
    color: "#8a6a1f",
    fontSize: 9.5,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  ingredientRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: 2 },
  ingredientBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#8b4fd1",
    marginTop: 7,
  },
  ingredientLine: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 12.5,
    lineHeight: 18,
    color: "#3a302a",
  },
  ingredientsHint: {
    marginTop: 6,
    fontFamily: "CormorantGaramond_400Regular_Italic",
    fontSize: 11.5,
    color: "#9a8e78",
  },
  macros: { flexDirection: "row", gap: 6, marginBottom: 12 },
  macroBox: {
    flex: 1,
    backgroundColor: "#f7f4f0",
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#ede8e0",
    alignItems: "center",
  },
  macroBoxVal: { fontFamily: "Inter_700Bold", fontSize: 18, lineHeight: 20 },
  macroBoxUnit: { fontSize: 10, color: "#b0a8b0", fontFamily: "Inter_400Regular" },
  macroBoxLabel: {
    fontSize: 9,
    letterSpacing: 1.2,
    color: "#b0a8b0",
    marginTop: 2,
    textTransform: "uppercase",
    fontFamily: "Inter_500Medium",
  },

  swapRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0ece4",
  },
  swapBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd8e8",
    backgroundColor: "#f7f4f0",
    alignItems: "center",
    justifyContent: "center",
  },
  dotsRow: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 },
  dot: { height: 8, borderRadius: 4 },
  idxText: { fontSize: 11, color: "#b0a8b0", fontFamily: "Inter_500Medium" },

  prepHead: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 10 },
  prepHeadText: { fontSize: 11, color: "#a09090", fontFamily: "Inter_500Medium" },
  prepText: {
    fontSize: 12,
    color: "#6b6070",
    lineHeight: 19,
    marginTop: 6,
    paddingLeft: 4,
    fontFamily: "Inter_400Regular",
  },

  saveBtn: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
  },
  saveBtnUnsaved: { backgroundColor: "#8b4fd1", borderColor: "#8b4fd1" },
  saveBtnSaved: { backgroundColor: "#f3eefb", borderColor: "#c8b8e8" },
  saveBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

  toast: {
    position: "absolute",
    left: 24,
    right: 24,
    backgroundColor: "#1e1030",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(139,79,209,0.3)",
  },
  toastText: { color: "#f0e9d6", fontSize: 13, fontFamily: "Inter_500Medium" },
});
