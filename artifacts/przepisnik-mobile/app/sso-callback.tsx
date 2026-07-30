import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function SsoCallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    const id = setTimeout(() => {
      router.replace("/");
    }, 400);

    return () => clearTimeout(id);
  }, [router]);

  return (
    <View style={styles.root}>
      <ActivityIndicator color="#C6A35B" />
      <Text style={styles.text}>Kończę logowanie...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#F6F7F8",
  },
  text: {
    color: "#111827",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
});
