import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Check, Mic, MicOff, Camera, Loader2, Link2, BookOpen } from "lucide-react";
import { generateSlug, type Recipe } from "@/data/recipes";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useAiLimit } from "@/hooks/useAiLimit";
import PremiumModal from "@/components/PremiumModal";

const CATEGORIES = ["Dania główne", "Zupy", "Desery", "Śniadania", "Pieczywo", "Przetwory", "Świąteczne"];

const CATEGORY_EMOJI: Record<string, string> = {
  "Dania główne": "🍝",
  "Zupy":         "🍲",
  "Desery":       "🍰",
  "Śniadania":    "🍳",
  "Pieczywo":     "🍞",
  "Przetwory":    "🫙",
  "Świąteczne":   "🎄🎂",
};

type FieldKey = "title" | "category" | "ingredients" | "preparation" | "notes";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
  initialRecipe?: Recipe;
  mode?: "add" | "edit";
}

interface FormState {
  title:       string;
  category:    string;
  ingredients: string;
  preparation: string;
  notes:       string;
}

const emptyForm: FormState = {
  title: "", category: "", ingredients: "", preparation: "", notes: "",
};

function recipeToForm(r: Recipe): FormState {
  return {
    title:       r.title,
    category:    r.category,
    ingredients: r.ingredients.join("\n"),
    preparation: r.steps.join("\n"),
    notes:       r.notes ?? "",
  };
}

function Field({ label, hint, children }: {
  label: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {hint && <p className="text-xs text-muted-foreground -mt-0.5">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground " +
  "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition";
const textareaCls = inputCls + " resize-none leading-relaxed";

// ── shared mic pill button ────────────────────────────────────────────────────
type MicState = "idle" | "listening" | "done";

function MicPill({
  fieldKey, activeField, lastDoneField, isSupported, onStart, onStop,
}: {
  fieldKey:      FieldKey;
  activeField:   string | null;
  lastDoneField: string | null;
  isSupported:   boolean;
  onStart: (f: FieldKey) => void;
  onStop:  () => void;
}) {
  if (!isSupported) return null;

  const state: MicState =
    activeField === fieldKey   ? "listening" :
    lastDoneField === fieldKey ? "done"       : "idle";

  return (
    <button
      type="button"
      onMouseDown={e => e.preventDefault()}
      onClick={() => state === "listening" ? onStop() : onStart(fieldKey)}
      aria-label={state === "listening" ? "Zatrzymaj dyktowanie" : "Dyktuj"}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
        state === "listening"
          ? "bg-rose-500 text-white shadow-sm"
          : state === "done"
            ? "bg-green-500 text-white"
            : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 active:scale-95"
      }`}
    >
      {state === "listening" ? (
        <>
          <span className="inline-flex gap-px items-end" aria-hidden="true">
            {[0.5, 1, 0.7].map((h, i) => (
              <span
                key={i}
                className="inline-block w-0.5 rounded-full bg-white"
                style={{
                  height: `${h * 10}px`,
                  animation: `micPulse 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
                }}
              />
            ))}
          </span>
          Słucham…
        </>
      ) : state === "done" ? (
        <>
          <Check size={10} />
          Nagrywanie zakończone
        </>
      ) : (
        <>
          <Mic size={11} />
          Dyktuj
        </>
      )}
    </button>
  );
}

// ── single-line input with mic ────────────────────────────────────────────────
function MicInput({
  value, onChange, placeholder,
  fieldKey, activeField, lastDoneField, isSupported, onStart, onStop,
}: {
  value: string; onChange: (v: string) => void; placeholder: string;
  fieldKey: FieldKey; activeField: string | null; lastDoneField: string | null;
  isSupported: boolean; onStart: (f: FieldKey) => void; onStop: () => void;
}) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputCls} flex-1`}
      />
      <MicPill
        fieldKey={fieldKey} activeField={activeField} lastDoneField={lastDoneField}
        isSupported={isSupported} onStart={onStart} onStop={onStop}
      />
    </div>
  );
}

// ── textarea with mic ─────────────────────────────────────────────────────────
function MicTextarea({
  value, onChange, placeholder, rows,
  fieldKey, activeField, lastDoneField, isSupported, onStart, onStop,
}: {
  value: string; onChange: (v: string) => void; placeholder: string; rows: number;
  fieldKey: FieldKey; activeField: string | null; lastDoneField: string | null;
  isSupported: boolean; onStart: (f: FieldKey) => void; onStop: () => void;
}) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`${textareaCls} pb-10`}
      />
      <div className="absolute bottom-2.5 right-2.5 pointer-events-none">
        <div className="pointer-events-auto">
          <MicPill
            fieldKey={fieldKey} activeField={activeField} lastDoneField={lastDoneField}
            isSupported={isSupported} onStart={onStart} onStop={onStop}
          />
        </div>
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export default function AddRecipeModal({ open, onClose, onSave, initialRecipe, mode = "add" }: Props) {
  const [form,          setForm]          = useState<FormState>(initialRecipe ? recipeToForm(initialRecipe) : emptyForm);
  const [errors,        setErrors]        = useState<Partial<Record<FieldKey, string>>>({});
  const [lastDoneField, setLastDoneField] = useState<string | null>(null);
  const [photoLoading,  setPhotoLoading]  = useState(false);
  const [photoStatus,   setPhotoStatus]   = useState<string>("");
  const [premiumOpen,   setPremiumOpen]   = useState(false);
  const aiLimit = useAiLimit();
  const [linkMode,      setLinkMode]      = useState(false);
  const [linkUrl,       setLinkUrl]       = useState("");
  const [linkTitle,     setLinkTitle]     = useState("");
  const [linkErrors,    setLinkErrors]    = useState<{ url?: string; title?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isSupported, activeField, startListening, stopListening } = useSpeechRecognition();

  useEffect(() => {
    if (open) {
      setForm(initialRecipe ? recipeToForm(initialRecipe) : emptyForm);
      setErrors({});
      setLastDoneField(null);
      setPhotoStatus("");
      setLinkMode(false);
      setLinkUrl("");
      setLinkTitle("");
      setLinkErrors({});
      stopListening();
    }
  }, [open, initialRecipe]);

  function handleSaveLink() {
    const errs: { url?: string; title?: string } = {};
    const trimUrl   = linkUrl.trim();
    const trimTitle = linkTitle.trim();
    if (!trimUrl)   errs.url   = "Podaj adres URL";
    else if (!/^https?:\/\/.+/.test(trimUrl)) errs.url = "Adres musi zaczynać się od http:// lub https://";
    if (!trimTitle) errs.title = "Podaj nazwę przepisu";
    setLinkErrors(errs);
    if (Object.keys(errs).length) return;

    const recipe: Recipe = {
      id: `link-${Date.now()}`,
      slug: generateSlug(trimTitle),
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

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!aiLimit.canUse) {
      event.target.value = "";
      setPremiumOpen(true);
      return;
    }

    setPhotoLoading(true);
    setPhotoStatus("Przetwarzam zdjęcie...");

    try {
      if (!aiLimit.consume()) {
        setPremiumOpen(true);
        setPhotoLoading(false);
        event.target.value = "";
        return;
      }
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/recipe-from-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json() as {
        title?: string;
        ingredients?: string[];
        preparation?: string[];
        error?: string;
      };

      if (!response.ok || data.error) {
        throw new Error(data.error || "Błąd serwera");
      }

      // Split any single oversized element into multiple lines (safety net)
      const splitItems = (items: string[] = []) =>
        items.flatMap(s => s.split(/\n+/)).map(s => s.trim()).filter(Boolean);

      const ingredients = splitItems(data.ingredients);
      const preparation = splitItems(data.preparation);

      setForm(f => ({
        ...f,
        title:       data.title?.trim() || f.title,
        ingredients: ingredients.join("\n") || f.ingredients,
        preparation: preparation.join("\n") || f.preparation,
      }));
      setPhotoStatus("Przepis uzupełniony ze zdjęcia ✓");
      setTimeout(() => setPhotoStatus(""), 4000);
    } catch (err: any) {
      const msg = err?.message || "Nie udało się odczytać przepisu ze zdjęcia";
      setPhotoStatus(msg);
      setTimeout(() => setPhotoStatus(""), 8000);
    } finally {
      setPhotoLoading(false);
      event.target.value = "";
    }
  }

  function set(key: FieldKey, value: string) {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }

  function appendDictated(fieldKey: FieldKey, transcript: string) {
    setForm(f => {
      const current = f[fieldKey];
      // title uses a space separator; multiline fields use newline
      const sep = fieldKey === "title"
        ? (current.trim() ? " " : "")
        : (current.trim() ? "\n" : "");
      return { ...f, [fieldKey]: current + sep + transcript };
    });
  }

  function handleStart(fieldKey: FieldKey) {
    setLastDoneField(null);
    startListening(fieldKey, (text) => {
      appendDictated(fieldKey, text);
    });
  }

  function handleStop() {
    const field = activeField;
    stopListening();
    if (field) {
      setLastDoneField(field);
      setTimeout(() => setLastDoneField(f => (f === field ? null : f)), 2500);
    }
  }

  function validate() {
    const e: typeof errors = {};
    if (!form.title.trim())       e.title       = "Podaj tytuł przepisu";
    if (!form.category)           e.category    = "Wybierz kategorię";
    if (!form.ingredients.trim()) e.ingredients = "Dodaj przynajmniej jeden składnik";
    if (!form.preparation.trim()) e.preparation = "Dodaj przynajmniej jeden krok";
    setErrors(e);
    return !Object.keys(e).length;
  }

  function handleSave() {
    if (!validate()) return;
    stopListening();
    const ingredients = form.ingredients.split("\n").map(s => s.trim()).filter(Boolean);
    const steps       = form.preparation.split("\n").map(s => s.trim()).filter(Boolean);
    const recipe: Recipe = initialRecipe
      ? { ...initialRecipe, title: form.title.trim(), category: form.category, ingredients, steps, notes: form.notes.trim() || undefined }
      : {
          id: `custom-${Date.now()}`,
          slug: generateSlug(form.title.trim()),
          title: form.title.trim(), description: "",
          category: form.category, prepTime: "—", servings: 2, difficulty: "łatwy",
          emoji: CATEGORY_EMOJI[form.category] ?? "📝",
          ingredients, steps, notes: form.notes.trim() || undefined,
        };
    onSave(recipe);
    onClose();
  }

  const isEdit = mode === "edit";

  const micProps = { activeField, lastDoneField, isSupported, onStart: handleStart, onStop: handleStop };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => { stopListening(); onClose(); }}
          />

          <motion.div
            key="sheet"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90dvh] overflow-y-auto rounded-t-3xl bg-background shadow-xl"
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            <div className="px-5 pb-8 max-w-2xl mx-auto">
              {/* header */}
              <div className="flex items-center justify-between py-4 mb-2">
                <h2 className="text-lg font-semibold text-foreground">
                  {isEdit ? "Edytuj przepis" : (linkMode ? "Dodaj z linku" : "Dodaj przepis")}
                </h2>
                <button
                  onClick={() => { stopListening(); setErrors({}); onClose(); }}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* mode toggle — only when adding */}
              {!isEdit && (
                <div className="flex gap-2 mb-5 p-1 bg-muted rounded-xl">
                  <button
                    type="button"
                    onClick={() => setLinkMode(false)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      !linkMode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <BookOpen size={14} />
                    Przepis
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkMode(true)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      linkMode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Link2 size={14} />
                    Dodaj z linku
                  </button>
                </div>
              )}

              {/* ── Link mode form ──────────────────────────────────────────── */}
              {!isEdit && linkMode && (
                <div className="flex flex-col gap-5">
                  <Field label="Wklej link do przepisu">
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={e => { setLinkUrl(e.target.value); setLinkErrors(v => ({ ...v, url: undefined })); }}
                      placeholder="https://przykładowastrona.pl/przepis..."
                      className={inputCls}
                      autoFocus
                    />
                    {linkErrors.url && <p className="text-xs text-destructive mt-0.5">{linkErrors.url}</p>}
                  </Field>

                  <Field label="Nazwa przepisu" hint="Jak chcesz go zapamiętać?">
                    <input
                      type="text"
                      value={linkTitle}
                      onChange={e => { setLinkTitle(e.target.value); setLinkErrors(v => ({ ...v, title: undefined })); }}
                      placeholder="np. Ciasto czekoladowe babci"
                      className={inputCls}
                      onKeyDown={e => e.key === "Enter" && handleSaveLink()}
                    />
                    {linkErrors.title && <p className="text-xs text-destructive mt-0.5">{linkErrors.title}</p>}
                  </Field>

                  <button
                    onClick={handleSaveLink}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold hover:brightness-90 active:brightness-85 active:scale-[0.98] transition-all"
                  >
                    <Link2 size={16} />
                    Dodaj z linku
                  </button>
                </div>
              )}

              {/* ── Recipe mode (existing form) — hidden when link mode ─────── */}
              {(isEdit || !linkMode) && (<>

              {/* not-supported notice */}
              {!isSupported && (
                <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
                  <MicOff size={12} className="flex-shrink-0" />
                  Twoja przeglądarka nie obsługuje dyktowania głosowego.
                </div>
              )}

              {/* ── Photo import ─────────────────────────────────────────── */}
              {!isEdit && (
                <div className="mb-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={photoLoading}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      padding: "16px 20px",
                      borderRadius: "16px",
                      border: "1.5px dashed #c4a8e0",
                      background: "#faf5ff",
                      color: "#8b4fd1",
                      fontSize: "16px",
                      fontWeight: 600,
                      cursor: photoLoading ? "not-allowed" : "pointer",
                      opacity: photoLoading ? 0.7 : 1,
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => { if (!photoLoading) e.currentTarget.style.background = "#f3e8ff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#faf5ff"; }}
                  >
                    {photoLoading
                      ? <><Loader2 size={18} className="animate-spin" /> Przetwarzam zdjęcie...</>
                      : <><Camera size={18} /> Importuj przepis ze zdjęcia</>
                    }
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />

                  <AnimatePresence>
                    {photoStatus && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                        style={{
                          marginTop: "10px",
                          padding: "10px 14px",
                          borderRadius: "12px",
                          background: photoStatus.includes("✓") ? "#ecfdf5" : "#fef3c7",
                          border: `1px solid ${photoStatus.includes("✓") ? "#a7f3d0" : "#fcd34d"}`,
                          color: photoStatus.includes("✓") ? "#065f46" : "#92400e",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                      >
                        {photoStatus}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="flex flex-col gap-5">

                {/* ── Tytuł + mic ─────────────────────────────────────────── */}
                <Field label="Tytuł przepisu">
                  <MicInput
                    value={form.title}
                    onChange={v => set("title", v)}
                    placeholder="Wpisz tytuł przepisu..."
                    fieldKey="title"
                    {...micProps}
                  />
                  {errors.title && <p className="text-xs text-destructive mt-0.5">{errors.title}</p>}
                </Field>

                {/* ── Kategoria ───────────────────────────────────────────── */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Kategoria</label>
                  <div className={`grid grid-cols-2 gap-2 rounded-xl transition-all ${errors.category ? "ring-2 ring-destructive/50 p-1" : ""}`}>
                    {CATEGORIES.map(cat => (
                      <button key={cat} type="button" onClick={() => set("category", cat)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
                          form.category === cat
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-card-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="text-base leading-none">{CATEGORY_EMOJI[cat]}</span>
                        <span>{cat}</span>
                      </button>
                    ))}
                  </div>
                  {errors.category && <p className="text-xs text-destructive mt-0.5">{errors.category}</p>}
                </div>

                {/* ── Składniki + mic ─────────────────────────────────────── */}
                <Field label="Składniki" hint="Każdy składnik w osobnej linii">
                  <MicTextarea
                    value={form.ingredients}
                    onChange={v => set("ingredients", v)}
                    placeholder={"Wpisz składniki..."}
                    rows={5}
                    fieldKey="ingredients"
                    {...micProps}
                  />
                  {errors.ingredients && <p className="text-xs text-destructive">{errors.ingredients}</p>}
                </Field>

                {/* ── Sposób przygotowania + mic ──────────────────────────── */}
                <Field label="Sposób przygotowania" hint="Każdy krok w osobnej linii">
                  <MicTextarea
                    value={form.preparation}
                    onChange={v => set("preparation", v)}
                    placeholder={"Wpisz kroki przygotowania..."}
                    rows={6}
                    fieldKey="preparation"
                    {...micProps}
                  />
                  {errors.preparation && <p className="text-xs text-destructive">{errors.preparation}</p>}
                </Field>

                {/* ── Notatki — plain, no mic ─────────────────────────────── */}
                <Field label="Notatki (opcjonalnie)">
                  <textarea
                    value={form.notes}
                    onChange={e => set("notes", e.target.value)}
                    placeholder="Dodatkowe wskazówki, uwagi, triki..."
                    rows={3}
                    className={textareaCls}
                  />
                </Field>

                {/* ── Save ────────────────────────────────────────────────── */}
                <button
                  onClick={handleSave}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold hover:brightness-90 active:brightness-85 active:scale-[0.98] transition-all"
                >
                  {isEdit ? <Check size={16} /> : <Plus size={16} />}
                  {isEdit ? "Zapisz zmiany" : "Zapisz przepis"}
                </button>

              </div>
              </>)}
            </div>
          </motion.div>
        </>
      )}
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />
    </AnimatePresence>
  );
}
