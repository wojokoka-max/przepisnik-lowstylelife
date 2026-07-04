import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { BookOpen, CalendarDays, Refrigerator, ShoppingBag } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE = "#7a3fc0";
const INACTIVE = "#6a5d44";

function TabBarBackground() {
  if (Platform.OS === "ios") {
    return (
      <BlurView
        intensity={80}
        tint="light"
        style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(253,248,239,0.86)" }]}
      />
    );
  }
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "#fdf8ef" }]} />
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  // Reserve real space for system gesture indicator on iOS, plus a generous
  // breathing margin on Android/web so labels never sit flush with the edge.
  const bottomPad = Math.max(insets.bottom, 14);
  const height = 54 + bottomPad;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarBackground: () => <TabBarBackground />,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: "rgba(28,24,16,0.08)",
          elevation: 0,
          height,
          paddingBottom: bottomPad,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_600SemiBold",
          fontSize: 9.5,
          letterSpacing: 0,
          marginTop: 2,
          marginBottom: 0,
        },
        tabBarIconStyle: { marginTop: 1 },
        tabBarItemStyle: { paddingTop: 0, paddingHorizontal: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Przepisy",
          tabBarIcon: ({ color, focused }) => (
            <BookOpen size={22} color={color} strokeWidth={focused ? 2.4 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="z-lodowki"
        options={{
          title: "Lodówka",
          tabBarIcon: ({ color, focused }) => (
            <Refrigerator size={22} color={color} strokeWidth={focused ? 2.4 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="planer"
        options={{
          title: "Planer",
          tabBarIcon: ({ color, focused }) => (
            <CalendarDays size={22} color={color} strokeWidth={focused ? 2.4 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="lista"
        options={{
          title: "Lista",
          tabBarIcon: ({ color, focused }) => (
            <ShoppingBag size={22} color={color} strokeWidth={focused ? 2.4 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}
