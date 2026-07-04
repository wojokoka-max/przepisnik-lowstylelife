// Premium consistent outline-icon system for recipe categories.
// Single source of truth — used in lists, cards, chips.

import {
  Cherry,
  Croissant,
  Gift,
  IceCreamCone,
  Link as LinkIcon,
  Soup,
  Sun,
  Utensils,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Dania główne": UtensilsCrossed,
  Zupy: Soup,
  Desery: IceCreamCone,
  Śniadania: Sun,
  Pieczywo: Croissant,
  Przetwory: Cherry,
  Świąteczne: Gift,
  Pobrane: LinkIcon,
};

const FALLBACK: LucideIcon = Utensils;

export function CategoryGlyph({
  category,
  size = 20,
  color = "#d8b15c",
}: {
  category: string;
  size?: number;
  color?: string;
}) {
  const Icon = CATEGORY_ICONS[category] ?? FALLBACK;
  return <Icon size={size} color={color} strokeWidth={2} />;
}

/**
 * Premium tile: dark navy with thin gold edge and gold glyph.
 * Sized 52×52 by default — fits cards/chips/lists.
 */
export function CategoryTile({
  category,
  size = 52,
  iconSize,
  variant = "navy",
}: {
  category: string;
  size?: number;
  iconSize?: number;
  variant?: "navy" | "cream";
}) {
  const isCream = variant === "cream";
  return (
    <View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.34),
          backgroundColor: isCream ? "#f5efe0" : "#0e1a2c",
          borderColor: isCream
            ? "rgba(216,177,92,0.28)"
            : "rgba(216,177,92,0.32)",
        },
      ]}
    >
      <CategoryGlyph
        category={category}
        size={iconSize ?? Math.round(size * 0.46)}
        color={isCream ? "#b8923a" : "#d8b15c"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
