// Lista zakupów — mobilny odpowiednik webowego src/pages/Lista.tsx.
// Trwały zapis w AsyncStorage (klucz pp-lista-zakupow), kategorie, odhaczanie,
// filtry, statystyki, usuwanie pojedyncze i "usuń gotowe" z animacją znikania.

import { Check, Plus, X } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
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

type CatKey =
  | "warzywa" | "owoce" | "nabial" | "mieso"
  | "piekarnia" | "napoje" | "suche" | "inne";

const CATS: Record<CatKey, { emoji: string; label: string }> = {
  warzywa:   { emoji: "🥦", label: "Warzywa" },
  owoce:     { emoji: "🍓", label: "Owoce" },
  nabial:    { emoji: "🥛", label: "Nabiał" },
  mieso:     { emoji: "🥩", label: "Mięso" },
  piekarnia: { emoji: "🍞", label: "Piekarnia" },
  napoje:    { emoji: "🧃", label: "Napoje" },
  suche:     { emoji: "🫙", label: "Sypkie i puszki" },
  inne:      { emoji: "✨", label: "Inne" },
};

const CAT_KEYS = Object.keys(CATS) as CatKey[];

type Filter = "all" | "active" | "done";

interface ShopItem {
  id: number;
  name: string;
  qty: string;
  cat: CatKey;
  done: boolean;
}

const STORAGE_KEY = "pp-lista-zakupow";

function sanitize(parsed: unknown): ShopItem[] {
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter(
      (i): i is ShopItem =>
        !!i && Number.isFinite(i.id) && typeof i.name === "string" && i.cat in CATS,
    )
    .map((i) => ({
      id: i.id,
      name: i.name,
      qty: typeof i.qty === "string" ? i.qty : "",
      cat: i.cat,
      done: i.done === true,
    }));
}

export default function ListaTab() {
  const insets = useSafeAreaInsets();
  const { content } = useBreakpoint();

  const [items, setItems] = useState<ShopItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [cat, setCat] = useState<CatKey>("warzywa");
  const [filter, setFilter] = useState<Filter>("all");
  const [vanishing, setVanishing] = useState<Set<number>>(new Set());
  const idRef = useRef<number>(1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // czyszczenie oczekujących timerów animacji przy odmontowaniu ekranu
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    },
    [],
  );

  // wczytanie z pamięci
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const list = sanitize(JSON.parse(raw));
          setItems(list);
          idRef.current = Math.max(0, ...list.map((i) => i.id)) + 1;
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  // zapis po każdej zmianie (dopiero po wczytaniu, by nie nadpisać pustą listą)
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items, loaded]);

  const uid = () => idRef.current++;

  const now = new Date();
  const dateStr = now.toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const total = items.length;
  const doneCount = items.filter((i) => i.done).length;
  const leftCount = total - doneCount;

  function addItem() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setItems((prev) => [...prev, { id: uid(), name: trimmed, qty: qty.trim(), cat, done: false }]);
    setName("");
    setQty("");
    if (filter === "done") setFilter("all");
  }

  function toggleItem(id: number) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  }

  function deleteItem(id: number) {
    setVanishing((prev) => new Set([...prev, id]));
    timers.current.push(
      setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== id));
        setVanishing((prev) => {
          const set = new Set(prev);
          set.delete(id);
          return set;
        });
      }, 360),
    );
  }

  function clearDone() {
    const doneIds = items.filter((i) => i.done).map((i) => i.id);
    if (doneIds.length === 0) return;
    setVanishing(new Set(doneIds));
    timers.current.push(
      setTimeout(() => {
        setItems((prev) => prev.filter((i) => !i.done));
        setVanishing(new Set());
      }, 360),
    );
  }

  const visible = items.filter((i) => {
    if (filter === "active") return !i.done;
    if (filter === "done") return i.done;
    return true;
  });

  const groups = useMemo(() => {
    const g: Partial<Record<CatKey, ShopItem[]>> = {};
    visible.forEach((item) => {
      (g[item.cat] ??= []).push(item);
    });
    return g;
  }, [visible]);

  const STATS: [string, number, string][] = [
    ["total", total, "produktów"],
    ["left", leftCount, "zostało"],
    ["done", doneCount, "gotowe"],
  ];

  // do czasu wczytania z pamięci nie pozwalamy na edycję — inaczej późniejszy
  // setItems(list) mógłby nadpisać zmiany zrobione przed hydracją
  if (!loaded) {
    return (
      <View style={styles.root}>
        <SiteHeader showAdd={false} onAdd={() => {}} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={styles.deco}>𖦹</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>TWOJA</Text>
          <Text style={styles.h1}>
            Lista{" "}
            <Text style={styles.h1em}>Zakupów</Text>
          </Text>
          <Text style={styles.dateLine}>{dateStr}</Text>
        </View>

        {/* STATS */}
        <View style={styles.stats}>
          {STATS.map(([k, n, lbl]) => (
            <View key={k} style={styles.statPill}>
              <Text style={styles.statNum}>{n}</Text>
              <Text style={styles.statLabel}>{lbl}</Text>
            </View>
          ))}
        </View>

        {/* ADD FORM */}
        <View style={styles.addForm}>
          <View style={styles.addRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Co kupić?"
              placeholderTextColor="#b9aa8c"
              value={name}
              onChangeText={setName}
              onSubmitEditing={addItem}
              returnKeyType="done"
              autoCorrect={false}
            />
            <TextInput
              style={[styles.input, { width: 72, textAlign: "center" }]}
              placeholder="szt."
              placeholderTextColor="#b9aa8c"
              value={qty}
              onChangeText={setQty}
              onSubmitEditing={addItem}
              returnKeyType="done"
              autoCorrect={false}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catRow}
            keyboardShouldPersistTaps="handled"
          >
            {CAT_KEYS.map((k) => {
              const active = cat === k;
              return (
                <Pressable
                  key={k}
                  onPress={() => setCat(k)}
                  style={[styles.catChip, active && styles.catChipActive]}
                >
                  <Text style={{ marginRight: 5 }}>{CATS[k].emoji}</Text>
                  <Text style={[styles.catChipText, active && styles.catChipTextActive]}>
                    {CATS[k].label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Pressable
            style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.85 }]}
            onPress={addItem}
          >
            <Plus size={18} color="#fff" strokeWidth={2} />
            <Text style={styles.addBtnText}>Dodaj</Text>
          </Pressable>
        </View>

        {/* FILTER TABS */}
        <View style={styles.tabs}>
          {(
            [
              ["all", "Wszystko"],
              ["active", "Do kupienia"],
              ["done", "Gotowe"],
            ] as const
          ).map(([f, lbl]) => {
            const active = filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[styles.tab, active && styles.tabActive]}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{lbl}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* LIST */}
        {visible.length === 0 ? (
          <View style={styles.empty}>
            <Text style={{ fontSize: 34, marginBottom: 8 }}>🌿</Text>
            <Text style={styles.emptyTitle}>
              {filter === "done" ? "Nic tu nie ma" : "Lista jest pusta"}
            </Text>
            <Text style={styles.emptySub}>
              {filter === "done"
                ? "Może to i dobrze — odpocznij chwilę."
                : "Dodaj pierwszy produkt powyżej."}
            </Text>
          </View>
        ) : (
          <View style={{ gap: 14 }}>
            {CAT_KEYS.map((catKey) => {
              const group = groups[catKey];
              if (!group || group.length === 0) return null;
              return (
                <View key={catKey} style={{ gap: 6 }}>
                  <Text style={styles.sectionLabel}>
                    {CATS[catKey].emoji} {CATS[catKey].label.toUpperCase()}
                  </Text>
                  {group.map((item) => (
                    <Item
                      key={item.id}
                      item={item}
                      vanishing={vanishing.has(item.id)}
                      onToggle={() => toggleItem(item.id)}
                      onDelete={() => deleteItem(item.id)}
                    />
                  ))}
                </View>
              );
            })}
          </View>
        )}

        {/* CLEAR DONE */}
        {doneCount > 0 ? (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Pressable
              style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.7 }]}
              onPress={clearDone}
            >
              <Text style={styles.clearBtnText}>Usuń gotowe produkty</Text>
            </Pressable>
          </View>
        ) : null}

        <Text style={styles.deco}>𖦹 𖦹 𖦹</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Item({
  item,
  vanishing,
  onToggle,
  onDelete,
}: {
  item: ShopItem;
  vanishing: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (vanishing) {
      Animated.timing(anim, {
        toValue: 0,
        duration: 340,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [vanishing, anim]);

  const cat = CATS[item.cat];

  return (
    <Animated.View
      style={[
        styles.item,
        item.done && styles.itemDone,
        {
          opacity: anim,
          transform: [
            { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
            { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.93, 1] }) },
          ],
        },
      ]}
    >
      <Pressable
        onPress={onToggle}
        hitSlop={6}
        style={[styles.checkBtn, item.done && styles.checkBtnDone]}
      >
        {item.done ? <Check size={15} color="#fff" strokeWidth={2.5} /> : null}
      </Pressable>

      <Text style={{ fontSize: 19 }}>{cat.emoji}</Text>

      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={[styles.itemName, item.done && styles.itemNameDone]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
        {item.qty ? <Text style={styles.itemQty}>{item.qty}</Text> : null}
      </View>

      <Pressable onPress={onDelete} hitSlop={8} style={styles.delBtn}>
        <X size={17} color="#cdbf9f" strokeWidth={2} />
      </Pressable>
    </Animated.View>
  );
}

const SERIF = "CormorantGaramond_500Medium";
const SERIF_ITALIC = "CormorantGaramond_400Regular_Italic";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5f1ea" },

  header: { alignItems: "center", paddingHorizontal: 16, paddingTop: 2 },
  eyebrow: {
    fontSize: 9.5,
    letterSpacing: 2.4,
    color: "#9a8e78",
    marginBottom: 3,
    fontFamily: "Inter_500Medium",
  },
  h1: { fontFamily: SERIF, fontSize: 30, lineHeight: 34, color: "#1a1a2e", textAlign: "center" },
  h1em: { fontFamily: SERIF_ITALIC, color: "#8b4fd1" },
  dateLine: { marginTop: 3, fontSize: 12.5, color: "#9a8e78", fontFamily: "Inter_400Regular" },

  stats: { flexDirection: "row", gap: 10, paddingHorizontal: 16, marginTop: 16 },
  statPill: {
    flex: 1,
    backgroundColor: "#fffdf8",
    borderRadius: 16,
    paddingVertical: 11,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ece3d2",
  },
  statNum: { fontFamily: "Inter_700Bold", fontSize: 22, color: "#8b4fd1", lineHeight: 24 },
  statLabel: {
    fontSize: 9.5,
    color: "#9a8e78",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 3,
    fontFamily: "Inter_500Medium",
  },

  addForm: {
    backgroundColor: "#fffdf8",
    borderRadius: 18,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#ece3d2",
    gap: 10,
  },
  addRow: { flexDirection: "row", gap: 8 },
  input: {
    backgroundColor: "#f5f1ea",
    borderWidth: 1.5,
    borderColor: "#e3d9c4",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#1a1a2e",
    fontFamily: "Inter_500Medium",
  },
  catRow: { gap: 8, paddingVertical: 2, paddingRight: 4 },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#e3d9c4",
    backgroundColor: "#f5f1ea",
  },
  catChipActive: { backgroundColor: "#8b4fd1", borderColor: "#8b4fd1" },
  catChipText: { fontSize: 13, color: "#7a6d8a", fontFamily: "Inter_500Medium" },
  catChipTextActive: { color: "#fff", fontFamily: "Inter_600SemiBold" },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#8b4fd1",
    borderRadius: 12,
    paddingVertical: 12,
  },
  addBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },

  tabs: { flexDirection: "row", gap: 8, paddingHorizontal: 16, marginTop: 18 },
  tab: {
    backgroundColor: "#fffdf8",
    borderWidth: 1.5,
    borderColor: "#e3d9c4",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  tabActive: { backgroundColor: "#8b4fd1", borderColor: "#8b4fd1" },
  tabText: { fontSize: 12.5, color: "#9a8e78", fontFamily: "Inter_500Medium" },
  tabTextActive: { color: "#fff", fontFamily: "Inter_600SemiBold" },

  sectionLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: "#9a8e78",
    paddingLeft: 4,
    fontFamily: "Inter_600SemiBold",
    marginTop: 4,
  },

  item: {
    backgroundColor: "#fffdf8",
    borderWidth: 1.5,
    borderColor: "#ece3d2",
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 10,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  itemDone: { opacity: 0.6, backgroundColor: "#f3eee3" },
  checkBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#e0d4ee",
    alignItems: "center",
    justifyContent: "center",
  },
  checkBtnDone: { backgroundColor: "#8b4fd1", borderColor: "#8b4fd1" },
  itemName: { fontSize: 14.5, color: "#1a1a2e", fontFamily: "Inter_600SemiBold" },
  itemNameDone: { color: "#a89b85", textDecorationLine: "line-through" },
  itemQty: { fontSize: 12.5, color: "#9a8e78", marginTop: 2, fontFamily: "Inter_400Regular" },
  delBtn: { padding: 4 },

  empty: { alignItems: "center", paddingVertical: 44, paddingHorizontal: 16 },
  emptyTitle: { fontFamily: SERIF_ITALIC, fontSize: 20, color: "#1a1a2e", marginBottom: 6 },
  emptySub: { fontSize: 13, color: "#9a8e78", fontFamily: "Inter_400Regular", textAlign: "center" },

  clearBtn: {
    borderWidth: 1.5,
    borderColor: "#e3d9c4",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  clearBtnText: { fontSize: 12.5, color: "#9a8e78", fontFamily: "Inter_500Medium" },

  deco: {
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 6,
    opacity: 0.3,
    color: "#8b4fd1",
    marginTop: 24,
  },
});
