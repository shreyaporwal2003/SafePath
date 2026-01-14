import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { SnackbarProvider } from "@/context/SnackbarContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // Check token in AsyncStorage
  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token); // true if token exists, false otherwise
    } catch (err) {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Wait until login check is complete
  if (!loaded || isLoggedIn === null) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SnackbarProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            // Logged-in users see the main tabs
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          ) : (
            // Not logged-in users see login & signup screens
            <>
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="signup" options={{ headerShown: false }} />
            </>
          )}

          {/* Screens accessible regardless of login */}
          <Stack.Screen name="report" options={{ headerShown: false }} />
          <Stack.Screen
            name="registerReport"
            options={{ title: "Register a New Report", headerShown: true }}
          />
          <Stack.Screen
            name="reportHistory"
            options={{ title: "Report History", headerShown: true }}
          />
          <Stack.Screen
            name="nearbyPotholes"
            options={{ title: "Nearby Potholes", headerShown: true }}
          />
          <Stack.Screen
            name="realtimeDetection"
            options={{ title: "Realtime Detection", headerShown: true }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </SnackbarProvider>
    </ThemeProvider>
  );
}
