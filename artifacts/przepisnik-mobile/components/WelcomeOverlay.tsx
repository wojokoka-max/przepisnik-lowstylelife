// Native port webowego WelcomeScreen — full-screen overlay nad stackiem.

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const logo = require("../assets/images/logo-lsl.png");

export default function WelcomeOverlay({ onEnter }: { onEnter: () => void }) {
  const insets = useSafeAreaInsets();

  const cta = (
    <Text style={styles.ctaText}>WEJDŹ</Text>
  );

  return (
    <LinearGradient
      colors={["#07111f", "#12081f", "#1a0d24", "#241119"]}
      locations={[0, 0.28, 0.62, 1]}
      style={[
        styles.root,
        {
          paddingTop: insets.top + 32,
          paddingBottom: insets.bottom + 32,
        },
      ]}
    >
      {/* Brand mark */}
      <View style={styles.markWrap}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Title block */}
      <View style={styles.titleWrap}>
        <Text style={styles.title}>Przepiśnik</Text>
        <Text style={styles.brand}>LOWSTYLELIFE</Text>
        <View style={styles.divider} />
        <Text style={styles.tagline}>Tworzony z pasji do smaków i chwili</Text>
      </View>

      {/* CTA + footer */}
      <View style={styles.bottomWrap}>
        {Platform.OS === "web" ? (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onEnter();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 16,
              paddingBottom: 16,
              paddingLeft: 56,
              paddingRight: 56,
              borderRadius: 999,
              border: "1px solid rgba(216,177,92,0.55)",
              background: "transparent",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            {cta}
          </a>
        ) : (
          <Pressable
            onPress={onEnter}
            style={({ pressed }) => [
              styles.cta,
              { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
            ]}
          >
            {cta}
          </Pressable>
        )}

        <View style={{ alignItems: "center", gap: 8 }}>
          <Pressable onPress={() => Linking.openURL("https://lowstylelife.art")}>
            <Text style={styles.link}>lowstylelife.art</Text>
          </Pressable>
          <Text style={styles.copy}>Wszelkie prawa zastrzeżone</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 9999,
  },
  markWrap: { alignItems: "center", gap: 14 },
  logo: { width: 96, height: 96 },
  titleWrap: { alignItems: "center", paddingHorizontal: 16, maxWidth: 380, width: "100%" },
  title: {
    color: "#d8b15c",
    fontFamily: "CormorantGaramond_500Medium",
    fontSize: 60,
    lineHeight: 64,
    letterSpacing: 1,
    textAlign: "center",
  },
  brand: {
    marginTop: 14,
    color: "#d8b15c",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    letterSpacing: 5,
    opacity: 0.85,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: "rgba(216,177,92,0.4)",
    marginTop: 26,
    marginBottom: 22,
  },
  tagline: {
    color: "rgba(245,241,234,0.7)",
    fontFamily: "CormorantGaramond_400Regular_Italic",
    fontSize: 18,
    letterSpacing: 0.4,
    lineHeight: 26,
    textAlign: "center",
  },
  bottomWrap: { alignItems: "center", gap: 22, width: "100%", maxWidth: 380 },
  cta: {
    paddingVertical: 16,
    paddingHorizontal: 56,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(216,177,92,0.55)",
    backgroundColor: "transparent",
  },
  ctaText: {
    color: "#d8b15c",
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    letterSpacing: 5,
  },
  link: {
    color: "rgba(216,177,92,0.55)",
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    letterSpacing: 3,
  },
  copy: {
    color: "rgba(245,241,234,0.30)",
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    letterSpacing: 2,
    textAlign: "center",
  },
});
