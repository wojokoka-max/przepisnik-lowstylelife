import { Check, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
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

import type { Recipe } from "../data/recipes";

const CATEGORIES = [
  "Dania główne",
  "Zupy",
  "Desery",
  "Śniadania",
  "Pieczywo",
  "Przetwory",
  "Świąteczne",
  "Z lodówki",
  "Pobrane",
  "Kreator",
];

interface FormState {
  title: string;
  category: string;
  ingredients: string;
  preparation: string;
  notes: string;
  handwrittenNote: string;
  sourceUrl: string;
}

function toForm(recipe: Recipe): FormState {
  return {
    title: recipe.title,
    category: recipe.category,
    ingredients: recipe.ingredients.join("\n"),
    preparation: recipe.steps.join("\n"),
    notes: recipe.notes ?? "",
    handwrittenNote: recipe.handwrittenNote ?? "",
    sourceUrl: recipe.sourceUrl ?? "",
  };
}

interface Props {
  open: boolean;
  recipe: Recipe;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
}

export default function EditRecipeModal({ open, recipe, onClose, onSave }: Props) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<FormState>(() => toForm(recipe));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setForm(toForm(recipe));
    setError("");
  }, [open, recipe]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  function handleSave() {
    const title = form.title.trim();
    if (!title) {
      setError("Podaj nazwę przepisu.");
      return;
    }

    const ingredients = form.ingredients
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    const steps = form.preparation
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    onSave({
      ...recipe,
      title,
      category: form.category.trim() || recipe.category,
      ingredients,
      steps,
      notes: form.notes.trim() || undefined,
      handwrittenNote: form.handwrittenNote.trim() || undefined,
      sourceUrl: form.sourceUrl.trim() || undefined,
    });
    onClose();
  }

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.sheetWrap}
        >
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.grabber} />
            <View style={styles.headRow}>
              <Text style={styles.headTitle}>Edytuj przepis</Text>
              <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
                <X size={18} color="#5F6B7A" strokeWidth={2} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.body}
              contentContainerStyle={styles.bodyContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={{ gap: 16 }}>
                <View style={styles.field}>
                  <Text style={styles.label}>Nazwa przepisu</Text>
                  <TextInput
                    value={form.title}
                    onChangeText={(value) => set("title", value)}
                    placeholder="Nazwa przepisu"
                    placeholderTextColor="#5F6B7A"
                    style={styles.input}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Kategoria</Text>
                  <View style={styles.catGrid}>
                    {CATEGORIES.map((cat) => {
                      const active = form.category === cat;
                      return (
                        <Pressable
                          key={cat}
                          onPress={() => set("category", cat)}
                          style={[styles.catChip, active && styles.catChipActive]}
                        >
                          <Text style={[styles.catText, active && styles.catTextActive]}>{cat}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {form.sourceUrl ? (
                  <View style={styles.field}>
                    <Text style={styles.label}>Link źródłowy</Text>
                    <TextInput
                      value={form.sourceUrl}
                      onChangeText={(value) => set("sourceUrl", value)}
                      placeholder="https://..."
                      placeholderTextColor="#5F6B7A"
                      autoCapitalize="none"
                      keyboardType="url"
                      style={styles.input}
                    />
                  </View>
                ) : null}

                <View style={styles.field}>
                  <Text style={styles.label}>Składniki</Text>
                  <Text style={styles.hint}>Każdy składnik w osobnej linii</Text>
                  <TextInput
                    value={form.ingredients}
                    onChangeText={(value) => set("ingredients", value)}
                    placeholder="Składniki"
                    placeholderTextColor="#5F6B7A"
                    multiline
                    style={[styles.input, styles.textarea]}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Przygotowanie</Text>
                  <Text style={styles.hint}>Każdy krok w osobnej linii</Text>
                  <TextInput
                    value={form.preparation}
                    onChangeText={(value) => set("preparation", value)}
                    placeholder="Przygotowanie"
                    placeholderTextColor="#5F6B7A"
                    multiline
                    style={[styles.input, styles.textarea]}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Wskazówka / notatka AI</Text>
                  <TextInput
                    value={form.notes}
                    onChangeText={(value) => set("notes", value)}
                    placeholder="Krótka wskazówka"
                    placeholderTextColor="#5F6B7A"
                    multiline
                    style={[styles.input, styles.textareaSmall]}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Notatka odręczna</Text>
                  <TextInput
                    value={form.handwrittenNote}
                    onChangeText={(value) => set("handwrittenNote", value)}
                    placeholder="Twoja własna notatka do tego przepisu"
                    placeholderTextColor="#5F6B7A"
                    multiline
                    style={[styles.input, styles.textareaSmall, styles.handNote]}
                  />
                </View>

                {error ? <Text style={styles.errText}>{error}</Text> : null}

                <Pressable onPress={handleSave} style={styles.saveBtn}>
                  <Check size={18} color="#fff" strokeWidth={2} />
                  <Text style={styles.saveBtnText}>Zapisz zmiany</Text>
                </Pressable>
              </View>
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
  sheetWrap: { width: "100%", flex: 1, justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#F6F7F8",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 18,
    paddingTop: 8,
    height: "94%",
    overflow: "hidden",
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
  body: { flex: 1 },
  bodyContent: { paddingBottom: 18 },
  field: { gap: 6 },
  label: {
    color: "#1c1810",
    fontFamily: "Inter_600SemiBold",
    fontSize: 13.5,
  },
  hint: {
    color: "#5F6B7A",
    fontFamily: "Inter_400Regular",
    fontSize: 11.5,
    marginTop: -2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "rgba(216, 222, 232, 0.85)",
    backgroundColor: "#F4F7FB",
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: "#111827",
    fontFamily: "Inter_400Regular",
    fontSize: 14.5,
  },
  textarea: {
    minHeight: 104,
    textAlignVertical: "top",
    lineHeight: 21,
  },
  textareaSmall: {
    minHeight: 82,
    textAlignVertical: "top",
    lineHeight: 21,
  },
  handNote: {
    borderStyle: "dashed",
    backgroundColor: "#F4F7FB",
  },
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(216, 222, 232, 0.85)",
    backgroundColor: "#F4F7FB",
  },
  catChipActive: {
    backgroundColor: "#C6A35B",
    borderColor: "#C6A35B",
  },
  catText: {
    color: "#5F6B7A",
    fontFamily: "Inter_500Medium",
    fontSize: 12.5,
  },
  catTextActive: { color: "#fff" },
  errText: {
    color: "#B94A48",
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#C6A35B",
    borderRadius: 999,
    paddingVertical: 15,
    marginTop: 4,
    shadowColor: "#07111F",
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
