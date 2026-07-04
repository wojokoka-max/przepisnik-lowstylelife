// Login / register overlay shown when there is no active session.
// Visual language matches the rest of the app: cream brand, navy serif title,
// lavender CTA, gold accents. High contrast so everything reads clearly.

import { LinearGradient } from "expo-linear-gradient";
import { CircleAlert } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
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

import { useAuth } from "../context/AuthContext";

const heroImg = require("../assets/images/start-hero.png");
const HERO_H = Math.round(Dimensions.get("window").height * 0.5);

type Mode = "signin" | "signup";

export default function LoginOverlay() {
  const insets = useSafeAreaInsets();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      const fn = mode === "signin" ? signIn : signUp;
      const res = await fn(email, password);
      if (!res.ok) setError(res.error);
    } finally {
      setBusy(false);
    }
  };

  const switchMode = () => {
    setError(null);
    setMode(mode === "signin" ? "signup" : "signin");
  };

  return (
    <LinearGradient
      colors={["#fdf8ef", "#fbf6ec", "#f7efe0"]}
      locations={[0, 0.5, 1]}
      style={styles.root}
    >
      {/* Full lavender-notebook photo as the start-screen hero, melting into cream */}
      <View pointerEvents="none" style={styles.hero}>
        <Image source={heroImg} style={styles.heroImg} resizeMode="cover" />
        <LinearGradient
          colors={[
            "rgba(253,248,239,0)",
            "rgba(253,248,239,0.05)",
            "rgba(253,248,239,0.7)",
            "#fdf8ef",
          ]}
          locations={[0, 0.5, 0.85, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, width: "100%" }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: HERO_H - 46, paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand */}
          <View style={styles.head}>
            <View style={styles.mark}>
              <Text style={styles.markText}>L</Text>
            </View>
            <Text style={styles.title}>Przepiśnik</Text>
            <Text style={styles.kicker}>L O W S T Y L E L I F E</Text>
            <View style={styles.divider} />
            <Text style={styles.tagline}>
              {mode === "signin" ? "Witaj z powrotem w swojej kuchni." : "Załóż konto i zacznij gotować."}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="twoj@email.com"
              placeholderTextColor="#b9aa8c"
              style={styles.input}
              editable={!busy}
              returnKeyType="next"
            />

            <Text style={[styles.label, { marginTop: 14 }]}>Hasło</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder={mode === "signup" ? "min. 6 znaków" : "twoje hasło"}
              placeholderTextColor="#b9aa8c"
              style={styles.input}
              editable={!busy}
              returnKeyType="go"
              onSubmitEditing={submit}
            />

            {error ? (
              <View style={styles.errorBox}>
                <CircleAlert size={16} color="#c0566f" strokeWidth={2} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Pressable
              onPress={submit}
              disabled={busy}
              style={({ pressed }) => [
                styles.cta,
                { opacity: pressed || busy ? 0.85 : 1 },
              ]}
            >
              {busy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.ctaText}>
                  {mode === "signin" ? "Z A L O G U J   S I Ę" : "Z A Ł Ó Ż   K O N T O"}
                </Text>
              )}
            </Pressable>

            <Pressable onPress={switchMode} hitSlop={10} style={styles.switchBtn}>
              <Text style={styles.switchText}>
                {mode === "signin" ? "Nie masz konta? " : "Masz już konto? "}
                <Text style={styles.switchTextEm}>
                  {mode === "signin" ? "Załóż konto" : "Zaloguj się"}
                </Text>
              </Text>
            </Pressable>
          </View>

          <View style={styles.foot}>
            <Text style={styles.footTitle}>Wczesny dostęp</Text>
            <Text style={styles.footText}>
              Aplikacja jest w fazie zamkniętej. Dostęp tylko dla zaproszonych osób.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 },
  hero: { position: "absolute", top: 0, left: 0, right: 0, height: HERO_H },
  heroImg: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    alignItems: "center",
  },

  head: { alignItems: "center", marginBottom: 20 },
  mark: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(168,128,31,0.5)",
    backgroundColor: "rgba(216,177,92,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  markText: {
    color: "#a8801f",
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 24,
    lineHeight: 26,
    marginTop: 1,
  },
  title: {
    color: "#1a1a2e",
    fontFamily: "CormorantGaramond_500Medium",
    fontSize: 27,
    lineHeight: 31,
    letterSpacing: 0.4,
  },
  kicker: {
    marginTop: 7,
    color: "#8b4fd1",
    fontFamily: "Inter_700Bold",
    fontSize: 9.5,
    letterSpacing: 3,
  },
  divider: {
    width: 32,
    height: 1,
    backgroundColor: "rgba(168,128,31,0.45)",
    marginTop: 12,
    marginBottom: 10,
  },
  tagline: {
    color: "#5a4f3a",
    fontFamily: "CormorantGaramond_400Regular_Italic",
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0.3,
    textAlign: "center",
    maxWidth: 300,
  },

  form: { width: "100%", maxWidth: 380 },
  label: {
    color: "#8a6a1f",
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  input: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(168,128,31,0.35)",
    backgroundColor: "#fffdf8",
    color: "#1a1a2e",
    paddingHorizontal: 16,
    fontFamily: "Inter_500Medium",
    fontSize: 15.5,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "rgba(192,86,111,0.1)",
    borderWidth: 1,
    borderColor: "rgba(192,86,111,0.4)",
  },
  errorText: {
    flex: 1,
    color: "#a8324c",
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    lineHeight: 18,
  },
  cta: {
    marginTop: 16,
    height: 48,
    borderRadius: 999,
    backgroundColor: "#7a3fc0",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5a2a8e",
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  ctaText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    letterSpacing: 2.4,
  },
  switchBtn: { marginTop: 14, alignItems: "center" },

  switchText: {
    color: "#5a4f3a",
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  switchTextEm: {
    color: "#7a3fc0",
    fontFamily: "Inter_700Bold",
  },

  foot: {
    marginTop: 22,
    width: "100%",
    maxWidth: 380,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(168,128,31,0.25)",
    alignItems: "center",
  },
  footTitle: {
    color: "#8a6a1f",
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 3,
    marginBottom: 8,
  },
  footText: {
    color: "#6a5d44",
    fontFamily: "CormorantGaramond_400Regular_Italic",
    fontSize: 13.5,
    lineHeight: 19,
    textAlign: "center",
  },
});
