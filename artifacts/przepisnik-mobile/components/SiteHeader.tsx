// Premium cream/translucent header — soft, lifestyle-feel.

import { BlurView } from "expo-blur";
import { CircleUserRound, LogOut, Plus, Sparkles } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../context/AuthContext";

interface Props {
  showAdd: boolean;
  onAdd: () => void;
}

export default function SiteHeader({ showAdd, onAdd }: Props) {
  const insets = useSafeAreaInsets();
  const { user, isAdmin, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    if (Platform.OS === "web") {
      // Alert API on web is blocking & ugly — just sign out.
      void signOut();
      return;
    }
    Alert.alert("Wylogować się?", user?.email ?? "", [
      { text: "Anuluj", style: "cancel" },
      { text: "Wyloguj", style: "destructive", onPress: () => void signOut() },
    ]);
  };

  return (
    <View style={[styles.header, { height: 52 + insets.top }]}>
      {Platform.OS === "ios" ? (
        <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFill} />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(253,248,239,0.94)" }]} />
      )}

      <View style={[styles.row, { paddingTop: insets.top + 6 }]}>
        <View style={styles.left}>
          <View style={styles.mark}>
            <Text style={styles.markText}>L</Text>
          </View>
          <View>
            <Text style={styles.title}>Przepiśnik</Text>
            <Text style={styles.kicker}>L O W S T Y L E L I F E</Text>
          </View>
        </View>

        <View style={styles.actions}>
          {showAdd ? (
            <Pressable
              onPress={onAdd}
              hitSlop={6}
              style={({ pressed }) => [styles.addBtn, { opacity: pressed ? 0.85 : 1 }]}
            >
              <Plus size={22} color="#fff" strokeWidth={2} />
            </Pressable>
          ) : null}

          {user ? (
            <Pressable
              onPress={() => setMenuOpen(true)}
              hitSlop={8}
              style={({ pressed }) => [styles.accountBtn, { opacity: pressed ? 0.7 : 1 }]}
            >
              <CircleUserRound size={28} color="#1c1810" strokeWidth={2} />
              {isAdmin ? <View style={styles.adminDot} /> : null}
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.hairline} />

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={styles.menuBackdrop} onPress={() => setMenuOpen(false)}>
          <Pressable style={[styles.menu, { marginTop: insets.top + 60 }]} onPress={(e) => e.stopPropagation?.()}>
            <Text style={styles.menuKicker}>K O N T O</Text>
            <Text style={styles.menuEmail} numberOfLines={1}>
              {user?.email}
            </Text>
            {isAdmin ? (
              <View style={styles.adminBadge}>
                <Sparkles size={11} color="#b8923a" strokeWidth={2} />
                <Text style={styles.adminBadgeText}>Admin · pełny dostęp AI</Text>
              </View>
            ) : (
              <Text style={styles.menuNote}>
                Funkcje AI: 3 generacje na dobę.
              </Text>
            )}
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [styles.logoutBtn, { opacity: pressed ? 0.85 : 1 }]}
            >
              <LogOut size={16} color="#fff" strokeWidth={2} />
              <Text style={styles.logoutText}>Wyloguj</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    overflow: "hidden",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 8,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 },
  mark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(216,177,92,0.45)",
    backgroundColor: "rgba(216,177,92,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  markText: {
    color: "#b8923a",
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 18,
    lineHeight: 20,
    marginTop: 1,
  },
  title: {
    color: "#1c1810",
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 19,
    lineHeight: 21,
  },
  kicker: {
    marginTop: 1,
    color: "#5a4f3a",
    fontFamily: "Inter_700Bold",
    fontSize: 7.5,
    letterSpacing: 2,
  },
  actions: { flexDirection: "row", alignItems: "center", gap: 10 },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6a2fb8",
    shadowColor: "#5a2a8e",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  accountBtn: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  adminDot: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d8b15c",
    borderWidth: 1.5,
    borderColor: "#fdf8ef",
  },
  hairline: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(28,24,16,0.08)",
  },

  menuBackdrop: {
    flex: 1,
    backgroundColor: "rgba(28,24,16,0.18)",
    alignItems: "flex-end",
    paddingHorizontal: 16,
  },
  menu: {
    width: 260,
    backgroundColor: "#fffdf8",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#1c1810",
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(28,24,16,0.06)",
  },
  menuKicker: {
    color: "#8a6a1f",
    fontFamily: "Inter_700Bold",
    fontSize: 9.5,
    letterSpacing: 3,
    marginBottom: 6,
  },
  menuEmail: {
    color: "#1c1810",
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 17,
    marginBottom: 10,
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(216,177,92,0.45)",
    backgroundColor: "rgba(216,177,92,0.1)",
    marginBottom: 14,
  },
  adminBadgeText: {
    color: "#8a6a1f",
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 0.4,
  },
  menuNote: {
    color: "#4a4030",
    fontFamily: "Inter_500Medium",
    fontSize: 12.5,
    lineHeight: 17,
    marginBottom: 14,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#6a2fb8",
    borderRadius: 12,
    paddingVertical: 12,
  },
  logoutText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    letterSpacing: 0.4,
  },
});
