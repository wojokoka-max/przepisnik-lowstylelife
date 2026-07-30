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
      <ActivityIndicator color="#7B4AB8" />
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
    backgroundColor: "#FDF8EF",
  },
  text: {
    color: "#1C1810",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
});
