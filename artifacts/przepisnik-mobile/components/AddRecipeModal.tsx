// Dodawanie przepisu na mobile — port webowego AddRecipeModal.
// Tryby: ręczny przepis (z dyktowaniem + importem ze zdjęcia AI) oraz "z linku".
// Paleta i typografia spójne z resztą aplikacji.

import {
  BookOpen,
  Camera,
  Check,
  Link as LinkIcon,
  Mic,
  Radio,
  Sparkles,
  X,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { generateSlug, type Recipe } from "../data/recipes";
import { useAiLimit } from "../hooks/useAiLimit";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { recipeFromImage } from "../lib/api";

const CATEGORIES = [
  "Dania główne",
  "Zupy",
  "Desery",
  "Śniadania",
  "Pieczywo",
  "Przetwory",
  "Świąteczne",
];

const CATEGORY_EMOJI: Record<string, string> = {
  "Dania główne": "🍝",
  Zupy: "🍲",
  Desery: "🍰",
  Śniadania: "🍳",
  Pieczywo: "🍞",
  Przetwory: "🫙",
  Świąteczne: "🎄",
};

type FieldKey = "title" | "ingredients" | "preparation" | "notes";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
}

interface FormState {
  title: string;
  category: string;
  ingredients: string;
  preparation: string;
  notes: string;
}

const emptyForm: FormState = {
  title: "",
  category: "",
  ingredients: "",
  preparation: "",
  notes: "",
};

function MicPill({
  fieldKey,
  activeField,
  lastDoneField,
  isSupported,
  onStart,
  onStop,
}: {
  fieldKey: FieldKey;
  activeField: string | null;
  lastDoneField: string | null;
  isSupported: boolean;
  onStart: (f: FieldKey) => void;
  onStop: () => void;
}) {
  if (!isSupported) return null;

  const state =
    activeField === fieldKey ? "listening" : lastDoneField === fieldKey ? "done" : "idle";

  return (
    <Pressable
      onPress={() => (state === "listening" ? onStop() : onStart(fieldKey))}
      style={[
        styles.mic,
        state === "listening" && styles.micListening,
        state === "done" && styles.micDone,
      ]}
    >
      {state === "listening" ? (
        <Radio size={12} color="#fff" strokeWidth={2} />
      ) : state === "done" ? (
        <Check size={12} color="#fff" strokeWidth={2} />
      ) : (
        <Mic size={12} color="#7a3fc0" strokeWidth={2} />
      )}
      <Text
        style={[
          styles.micText,
          state === "idle" ? { color: "#7a3fc0" } : { color: "#fff" },
        ]}
      >
        {state === "listening" ? "Słucham…" : state === "done" ? "Gotowe" : "Dyktuj"}
      </Text>
    </Pressable>
  );
}

export default function AddRecipeModal({ open, onClose, onSave }: Props) {
  const insets = useSafeAreaInsets();
  const aiLimit = useAiLimit();
  const { isSupported, activeField, startListening, stopListening } = useSpeechRecognition();

  const [linkMode, setLinkMode] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<FieldKey | "category", string>>>({});
  const [lastDoneField, setLastDoneField] = useState<string | null>(null);

  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoStatus, setPhotoStatus] = useState("");

  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkErrors, setLinkErrors] = useState<{ url?: string; title?: string }>({});

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setErrors({});
      setLastDoneField(null);
      setPhotoStatus("");
      setLinkMode(false);
      setLinkUrl("");
      setLinkTitle("");
      setLinkErrors({});
      stopListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function set(key: FieldKey, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function appendDictated(fieldKey: FieldKey, transcript: string) {
    setForm((f) => {
      const current = f[fieldKey];
      const sep = fieldKey === "title" ? (current.trim() ? " " : "") : current.trim() ? "\n" : "";
      return { ...f, [fieldKey]: current + sep + transcript };
    });
  }

  function handleStart(fieldKey: FieldKey) {
    setLastDoneField(null);
    startListening(fieldKey, (text) => appendDictated(fieldKey, text));
  }

  function handleStop() {
    const field = activeField;
    stopListening();
    if (field) {
      setLastDoneField(field);
      setTimeout(() => setLastDoneField((f) => (f === field ? null : f)), 2500);
    }
  }

  async function pickImage(from: "camera" | "library") {
    if (!aiLimit.canUse) {
      Alert.alert(
        "Limit dzienny",
        "Wykorzystałaś już dzisiejsze 3 generacje AI. Wróć jutro lub odblokuj wersję premium.",
      );
      return;
    }

    try {
      const perm =
        from === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Brak uprawnień", "Aby zaimportować przepis, zezwól na dostęp do zdjęć.");
        return;
      }

      const result =
        from === "camera"
          ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.7,
            });

      if (result.canceled || !result.assets?.[0]) return;
      const asset = result.assets[0];

      setPhotoLoading(true);
      setPhotoStatus("Przetwarzam zdjęcie…");

      const data = await recipeFromImage(asset.uri, asset.mimeType);

      // Zużywamy limit dopiero po udanym odczycie — nieudane próby nie palą kredytu.
      await aiLimit.consume();

      const splitItems = (items: string[] = []) =>
        items
          .flatMap((s) => s.split(/\n+/))
          .map((s) => s.trim())
          .filter(Boolean);

      const ingredients = splitItems(data.ingredients);
      const preparation = splitItems(data.preparation);
      const title = data.title?.trim() || "Przepis ze zdjęcia";
      const ts = Date.now();

      const recipe: Recipe = {
        id: `photo-${ts}`,
        slug: `${generateSlug(title)}-${ts.toString(36).slice(-5)}`,
        title,
        description: "",
        category: "Pobrane",
        prepTime: "—",
        servings: 0,
        difficulty: "łatwy",
        emoji: "📷",
        ingredients,
        steps: preparation,
        images: [asset.uri],
        notes: "Zaimportowano ze zdjęcia.",
      };

      setPhotoStatus("Przepis zapisany ze zdjęcia ✓");
      onSave(recipe);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Nie udało się odczytać przepisu ze zdjęcia";
      setPhotoStatus(msg);
      setTimeout(() => setPhotoStatus(""), 8000);
    } finally {
      setPhotoLoading(false);
    }
  }

  function importFromPhoto() {
    if (photoLoading) return;
    if (Platform.OS === "web") {
      void pickImage("library");
      return;
    }
    Alert.alert("Importuj ze zdjęcia", "Skąd chcesz wziąć zdjęcie przepisu?", [
      { text: "Aparat", onPress: () => void pickImage("camera") },
      { text: "Galeria", onPress: () => void pickImage("library") },
      { text: "Anuluj", style: "cancel" },
    ]);
  }

  function validate() {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = "Podaj tytuł przepisu";
    if (!form.category) e.category = "Wybierz kategorię";
    if (!form.ingredients.trim()) e.ingredients = "Dodaj przynajmniej jeden składnik";
    if (!form.preparation.trim()) e.preparation = "Dodaj przynajmniej jeden krok";
    setErrors(e);
    return !Object.keys(e).length;
  }

  function handleSave() {
    if (!validate()) return;
    stopListening();
    const ingredients = form.ingredients
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const steps = form.preparation
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const ts = Date.now();
    const recipe: Recipe = {
      id: `custom-${ts}`,
      slug: `${generateSlug(form.title.trim())}-${ts.toString(36).slice(-5)}`,
      title: form.title.trim(),
      description: "",
      category: form.category,
      prepTime: "—",
      servings: 2,
      difficulty: "łatwy",
      emoji: CATEGORY_EMOJI[form.category] ?? "📝",
      ingredients,
      steps,
      notes: form.notes.trim() || undefined,
    };
    onSave(recipe);
    onClose();
  }

  function handleSaveLink() {
    const errs: { url?: string; title?: string } = {};
    const trimUrl = linkUrl.trim();
    const trimTitle = linkTitle.trim();
    if (!trimUrl) errs.url = "Podaj adres URL";
    else if (!/^https?:\/\/.+/.test(trimUrl))
      errs.url = "Adres musi zaczynać się od http:// lub https://";
    if (!trimTitle) errs.title = "Podaj nazwę przepisu";
    setLinkErrors(errs);
    if (Object.keys(errs).length) return;

    const ts = Date.now();
    const recipe: Recipe = {
      id: `link-${ts}`,
      slug: `${generateSlug(trimTitle)}-${ts.toString(36).slice(-5)}`,
      title: trimTitle,
      description: "",
      category: "Pobrane",
      prepTime: "—",
      servings: 0,
      difficulty: "łatwy",
      emoji: "🔗",
      ingredients: [],
      steps: [],
      sourceUrl: trimUrl,
      isDraft: true,
    };
    onSave(recipe);
    onClose();
  }

  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={() => {
        stopListening();
        onClose();
      }}
    >
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => {
            stopListening();
            onClose();
          }}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.sheetWrap}
        >
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.grabber} />

            <View style={styles.headRow}>
              <Text style={styles.headTitle}>{linkMode ? "Dodaj z linku" : "Dodaj przepis"}</Text>
              <Pressable
                onPress={() => {
                  stopListening();
                  onClose();
                }}
                hitSlop={8}
                style={styles.closeBtn}
              >
                <X size={18} color="#5a4f3a" strokeWidth={2} />
              </Pressable>
            </View>

            {/* Mode toggle */}
            <View style={styles.segmented}>
              <Pressable
                onPress={() => setLinkMode(false)}
                style={[styles.segment, !linkMode && styles.segmentActive]}
              >
                <BookOpen size={14} color={!linkMode ? "#fff" : "#7a3fc0"} strokeWidth={2} />
                <Text style={[styles.segmentText, !linkMode && styles.segmentTextActive]}>
                  Przepis
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setLinkMode(true)}
                style={[styles.segment, linkMode && styles.segmentActive]}
              >
                <LinkIcon size={14} color={linkMode ? "#fff" : "#7a3fc0"} strokeWidth={2} />
                <Text style={[styles.segmentText, linkMode && styles.segmentTextActive]}>
                  Z linku
                </Text>
              </Pressable>
            </View>

            <ScrollView
              style={styles.body}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {linkMode ? (
                <View style={{ gap: 16 }}>
                  <View style={styles.field}>
                    <Text style={styles.label}>Wklej link do przepisu</Text>
                    <TextInput
                      value={linkUrl}
                      onChangeText={(t) => {
                        setLinkUrl(t);
                        setLinkErrors((v) => ({ ...v, url: undefined }));
                      }}
                      placeholder="https://strona.pl/przepis…"
                      placeholderTextColor="#9a8e78"
                      autoCapitalize="none"
                      keyboardType="url"
                      style={styles.input}
                    />
                    {linkErrors.url ? <Text style={styles.errText}>{linkErrors.url}</Text> : null}
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.label}>Nazwa przepisu</Text>
                    <TextInput
                      value={linkTitle}
                      onChangeText={(t) => {
                        setLinkTitle(t);
                        setLinkErrors((v) => ({ ...v, title: undefined }));
                      }}
                      placeholder="np. Ciasto czekoladowe babci"
                      placeholderTextColor="#9a8e78"
                      style={styles.input}
                    />
                    {linkErrors.title ? (
                      <Text style={styles.errText}>{linkErrors.title}</Text>
                    ) : null}
                  </View>

                  <Pressable onPress={handleSaveLink} style={styles.saveBtn}>
                    <LinkIcon size={16} color="#fff" strokeWidth={2} />
                    <Text style={styles.saveBtnText}>Dodaj z linku</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={{ gap: 16 }}>
                  {/* AI usage */}
                  <View style={styles.aiBadge}>
                    <Sparkles size={11} color="#8b4fd1" strokeWidth={2} />
                    <Text style={styles.aiBadgeText}>
                      {aiLimit.unlimited
                        ? "AI: nielimitowane (admin)"
                        : `AI dzisiaj: ${aiLimit.remaining}/${aiLimit.limit}`}
                    </Text>
                  </View>

                  {/* Photo import */}
                  <Pressable
                    onPress={importFromPhoto}
                    disabled={photoLoading}
                    style={[styles.photoBtn, photoLoading && { opacity: 0.7 }]}
                  >
                    {photoLoading ? (
                      <ActivityIndicator size="small" color="#8b4fd1" />
                    ) : (
                      <Camera size={18} color="#8b4fd1" strokeWidth={2} />
                    )}
                    <Text style={styles.photoBtnText}>
                      {photoLoading ? "Przetwarzam zdjęcie…" : "Importuj przepis ze zdjęcia"}
                    </Text>
                  </Pressable>

                  {photoStatus ? (
                    <View
                      style={[
                        styles.statusBox,
                        photoStatus.includes("✓") ? styles.statusOk : styles.statusWarn,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          photoStatus.includes("✓")
                            ? { color: "#065f46" }
                            : { color: "#92400e" },
                        ]}
                      >
                        {photoStatus}
                      </Text>
                    </View>
                  ) : null}

                  {/* Title */}
                  <View style={styles.field}>
                    <Text style={styles.label}>Tytuł przepisu</Text>
                    <View style={styles.inputRow}>
                      <TextInput
                        value={form.title}
                        onChangeText={(v) => set("title", v)}
                        placeholder="Wpisz tytuł przepisu…"
                        placeholderTextColor="#9a8e78"
                        style={[styles.input, { flex: 1 }]}
                      />
                      <MicPill
                        fieldKey="title"
                        activeField={activeField}
                        lastDoneField={lastDoneField}
                        isSupported={isSupported}
                        onStart={handleStart}
                        onStop={handleStop}
                      />
                    </View>
                    {errors.title ? <Text style={styles.errText}>{errors.title}</Text> : null}
                  </View>

                  {/* Category */}
                  <View style={styles.field}>
                    <Text style={styles.label}>Kategoria</Text>
                    <View style={styles.catGrid}>
                      {CATEGORIES.map((cat) => {
                        const active = form.category === cat;
                        return (
                          <Pressable
                            key={cat}
                            onPress={() => {
                              setForm((f) => ({ ...f, category: cat }));
                              setErrors((e) => ({ ...e, category: undefined }));
                            }}
                            style={[styles.catChip, active && styles.catChipActive]}
                          >
                            <Text style={styles.catEmoji}>{CATEGORY_EMOJI[cat]}</Text>
                            <Text style={[styles.catText, active && styles.catTextActive]}>
                              {cat}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                    {errors.category ? <Text style={styles.errText}>{errors.category}</Text> : null}
                  </View>

                  {/* Ingredients */}
                  <View style={styles.field}>
                    <View style={styles.labelRow}>
                      <Text style={styles.label}>Składniki</Text>
                      <MicPill
                        fieldKey="ingredients"
                        activeField={activeField}
                        lastDoneField={lastDoneField}
                        isSupported={isSupported}
                        onStart={handleStart}
                        onStop={handleStop}
                      />
                    </View>
                    <Text style={styles.hint}>Każdy składnik w osobnej linii</Text>
                    <TextInput
                      value={form.ingredients}
                      onChangeText={(v) => set("ingredients", v)}
                      placeholder={"200 g mąki\n3 jajka\nszczypta soli"}
                      placeholderTextColor="#9a8e78"
                      multiline
                      style={[styles.input, styles.textarea]}
                    />
                    {errors.ingredients ? (
                      <Text style={styles.errText}>{errors.ingredients}</Text>
                    ) : null}
                  </View>

                  {/* Preparation */}
                  <View style={styles.field}>
                    <View style={styles.labelRow}>
                      <Text style={styles.label}>Przygotowanie</Text>
                      <MicPill
                        fieldKey="preparation"
                        activeField={activeField}
                        lastDoneField={lastDoneField}
                        isSupported={isSupported}
                        onStart={handleStart}
                        onStop={handleStop}
                      />
                    </View>
                    <Text style={styles.hint}>Każdy krok w osobnej linii</Text>
                    <TextInput
                      value={form.preparation}
                      onChangeText={(v) => set("preparation", v)}
                      placeholder={"Rozgrzej piekarnik do 180°C\nWymieszaj składniki\n…"}
                      placeholderTextColor="#9a8e78"
                      multiline
                      style={[styles.input, styles.textarea]}
                    />
                    {errors.preparation ? (
                      <Text style={styles.errText}>{errors.preparation}</Text>
                    ) : null}
                  </View>

                  {/* Notes */}
                  <View style={styles.field}>
                    <View style={styles.labelRow}>
                      <Text style={styles.label}>Notatki (opcjonalnie)</Text>
                      <MicPill
                        fieldKey="notes"
                        activeField={activeField}
                        lastDoneField={lastDoneField}
                        isSupported={isSupported}
                        onStart={handleStart}
                        onStop={handleStop}
                      />
                    </View>
                    <TextInput
                      value={form.notes}
                      onChangeText={(v) => set("notes", v)}
                      placeholder="Wskazówki, warianty, podanie…"
                      placeholderTextColor="#9a8e78"
                      multiline
                      style={[styles.input, styles.textarea]}
                    />
                  </View>

                  {!isSupported ? (
                    <Text style={styles.noVoice}>
                      Dyktowanie głosowe nie działa w Expo Go na Androidzie. Ten tryb wymaga później
                      natywnej wersji aplikacji z modułem rozpoznawania mowy.
                    </Text>
                  ) : null}

                  <Pressable onPress={handleSave} style={styles.saveBtn}>
                    <Check size={18} color="#fff" strokeWidth={2} />
                    <Text style={styles.saveBtnText}>Zapisz przepis</Text>
                  </Pressable>
                </View>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(28,24,16,0.28)",
    justifyContent: "flex-end",
  },
  sheetWrap: { width: "100%" },
  sheet: {
    backgroundColor: "#fdf8ef",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 18,
    paddingTop: 8,
    maxHeight: "92%",
  },
  grabber: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(28,24,16,0.16)",
    marginBottom: 8,
  },
  headRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headTitle: {
    color: "#1c1810",
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 24,
    lineHeight: 28,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(28,24,16,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  segmented: {
    flexDirection: "row",
    gap: 6,
    padding: 4,
    borderRadius: 14,
    backgroundColor: "rgba(28,24,16,0.05)",
    marginBottom: 14,
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 11,
  },
  segmentActive: {
    backgroundColor: "#7a3fc0",
  },
  segmentText: {
    color: "#7a3fc0",
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  segmentTextActive: { color: "#fff" },

  body: { flexGrow: 0 },

  field: { gap: 6 },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    color: "#1c1810",
    fontFamily: "Inter_600SemiBold",
    fontSize: 13.5,
  },
  hint: {
    color: "#7a6f58",
    fontFamily: "Inter_400Regular",
    fontSize: 11.5,
    marginTop: -2,
  },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  input: {
    borderWidth: 1.5,
    borderColor: "rgba(168,128,31,0.32)",
    backgroundColor: "#fffdf8",
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: "#1a1a2e",
    fontFamily: "Inter_400Regular",
    fontSize: 14.5,
  },
  textarea: {
    minHeight: 92,
    textAlignVertical: "top",
    lineHeight: 21,
  },
  errText: {
    color: "#c0392b",
    fontFamily: "Inter_500Medium",
    fontSize: 11.5,
  },

  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(168,128,31,0.3)",
    backgroundColor: "#fffdf8",
  },
  catChipActive: {
    backgroundColor: "#7a3fc0",
    borderColor: "#7a3fc0",
  },
  catEmoji: { fontSize: 14 },
  catText: {
    color: "#5a4f3a",
    fontFamily: "Inter_500Medium",
    fontSize: 12.5,
  },
  catTextActive: { color: "#fff" },

  mic: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(139,79,209,0.28)",
    backgroundColor: "rgba(139,79,209,0.1)",
  },
  micListening: { backgroundColor: "#e0506e", borderColor: "#e0506e" },
  micDone: { backgroundColor: "#15995d", borderColor: "#15995d" },
  micText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11.5,
  },

  photoBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    paddingVertical: 14,
    borderRadius: 15,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#c4a8e0",
    backgroundColor: "#faf5ff",
  },
  photoBtnText: {
    color: "#8b4fd1",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14.5,
  },
  statusBox: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusOk: { backgroundColor: "#ecfdf5", borderColor: "#a7f3d0" },
  statusWarn: { backgroundColor: "#fef3c7", borderColor: "#fcd34d" },
  statusText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12.5,
  },

  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(139,79,209,0.25)",
    backgroundColor: "rgba(139,79,209,0.08)",
  },
  aiBadgeText: {
    color: "#7a3fc0",
    fontFamily: "Inter_600SemiBold",
    fontSize: 11.5,
  },

  noVoice: {
    color: "#7a6f58",
    fontFamily: "Inter_400Regular",
    fontSize: 11.5,
    textAlign: "center",
  },

  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#7a3fc0",
    borderRadius: 999,
    paddingVertical: 15,
    marginTop: 4,
    shadowColor: "#5a2a8e",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  saveBtnText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 14.5,
    letterSpacing: 0.3,
  },
});
