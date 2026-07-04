import React, { useRef, useState } from "react";
import { useAiLimit } from "@/hooks/useAiLimit";
import PremiumModal from "@/components/PremiumModal";
import AiUsageBadge from "@/components/AiUsageBadge";

export default function AddRecipeFromPhoto() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [preparation, setPreparation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [premiumOpen, setPremiumOpen] = useState(false);
  const aiLimit = useAiLimit();

  const handleTakePhotoClick = () => {
    if (!aiLimit.canUse) {
      setPremiumOpen(true);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!aiLimit.canUse) {
      event.target.value = "";
      setPremiumOpen(true);
      return;
    }

    setIsLoading(true);
    setStatus("Przetwarzam zdjęcie...");

    try {
      if (!aiLimit.consume()) {
        setPremiumOpen(true);
        setIsLoading(false);
        event.target.value = "";
        return;
      }
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/recipe-from-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Nie udało się przetworzyć zdjęcia.");
      }

      const data = await response.json();

      setTitle(data.title || "");
      setIngredients((data.ingredients || []).join("\n"));
      setPreparation((data.preparation || []).join("\n"));
      setStatus("Przepis uzupełniony.");
    } catch (error) {
      console.error(error);
      setStatus("Nie udało się odczytać przepisu.");
    } finally {
      setIsLoading(false);
      event.target.value = "";
    }
  };

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <AiUsageBadge onUpgrade={() => setPremiumOpen(true)} />
      </div>

      <button
        type="button"
        onClick={handleTakePhotoClick}
        disabled={isLoading}
        style={{
          padding: "16px 20px",
          borderRadius: "14px",
          border: "none",
          background: "#8b4fd1",
          color: "#fff",
          fontSize: "18px",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        {isLoading ? "Przetwarzam..." : "Zrób zdjęcie"}
      </button>

      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />

      {status && (
        <div
          style={{
            padding: "12px 14px",
            borderRadius: "12px",
            background: "#f3eef8",
            color: "#5e4b82",
          }}
        >
          {status}
        </div>
      )}

      <input
        type="text"
        placeholder="Nazwa przepisu"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          padding: "14px 16px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          fontSize: "16px",
        }}
      />

      <textarea
        placeholder="Składniki"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        rows={8}
        style={{
          padding: "14px 16px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          fontSize: "16px",
          resize: "vertical",
        }}
      />

      <textarea
        placeholder="Przygotowanie"
        value={preparation}
        onChange={(e) => setPreparation(e.target.value)}
        rows={10}
        style={{
          padding: "14px 16px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          fontSize: "16px",
          resize: "vertical",
        }}
      />
    </div>
  );
}
