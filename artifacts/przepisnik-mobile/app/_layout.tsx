import {
  CormorantGaramond_400Regular,
  CormorantGaramond_400Regular_Italic,
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
} from "@expo-google-fonts/cormorant-garamond";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { ClerkLoaded, ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { setBaseUrl } from "@workspace/api-client-react";

import LoginOverlay from "../components/LoginOverlay";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { RecipesProvider } from "../context/RecipesContext";

SplashScreen.preventAutoHideAsync();

const domain = process.env.EXPO_PUBLIC_DOMAIN;
if (domain) setBaseUrl(`https://${domain}`);

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const proxyUrl = process.env.EXPO_PUBLIC_CLERK_PROXY_URL || undefined;
const hasClerkConfig = Boolean(publishableKey?.trim());

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#fdf8ef" },
      }}
    />
  );
}

function Gate({ children }: { children: React.ReactNode }) {
  const { ready, user } = useAuth();

  if (!ready) return null;

  // Single overlay: LoginOverlay doubles as the welcome cover (gold serif
  // brand mark + tagline + email/password form). No two-step flow.
  return (
    <>
      <StatusBar style="dark" />
      {children}
      {!user ? <LoginOverlay /> : null}
    </>
  );
}

function MissingClerkConfig() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={styles.configRoot}>
        <Text style={styles.configTitle}>Brakuje konfiguracji logowania</Text>
        <Text style={styles.configText}>
          Ustaw EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY dla aplikacji mobilnej.
        </Text>
      </View>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    CormorantGaramond_400Regular,
    CormorantGaramond_400Regular_Italic,
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  if (!hasClerkConfig) {
    return <MissingClerkConfig />;
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ClerkProvider
          publishableKey={publishableKey}
          tokenCache={tokenCache}
          proxyUrl={proxyUrl}
        >
          <ClerkLoaded>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <RecipesProvider>
                  <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#fdf8ef" }}>
                    <KeyboardProvider>
                      <Gate>
                        <RootLayoutNav />
                      </Gate>
                    </KeyboardProvider>
                  </GestureHandlerRootView>
                </RecipesProvider>
              </AuthProvider>
            </QueryClientProvider>
          </ClerkLoaded>
        </ClerkProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  configRoot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    backgroundColor: "#fdf8ef",
  },
  configTitle: {
    color: "#1a1a2e",
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 26,
    lineHeight: 31,
    textAlign: "center",
  },
  configText: {
    marginTop: 10,
    color: "#6a5d44",
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});
