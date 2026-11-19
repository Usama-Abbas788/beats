
import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAppTheme } from "@/theme/useThemeStore";

const WELCOME_KEY = "hasSeenWelcome";

export default function SplashScreen() {
  const { theme } = useAppTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    const navigateAfterSplash = async () => {
      try {
        // Keep the splash visible for a short duration
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const hasSeenWelcome = await AsyncStorage.getItem(WELCOME_KEY);

        if (hasSeenWelcome === "true") {
          router.replace("/home");
        } else {
          router.replace("/welcome");
        }
      } catch (error) {
        console.error("Splash navigation error:", error);
        router.replace("/welcome");
      }
    };

    navigateAfterSplash();
  }, [fadeAnim, scaleAnim]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.brand },
      ]}
    >
      <StatusBar style="light" />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.appName}>Beats</Text>

        <Text
          style={[
            styles.tagline,
            { color: theme.textSecondary },
          ]}
        >
          Your Music. Your World.
        </Text>
      </Animated.View>

      <Text style={styles.footer}>MADE FOR YOUR SOUND</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 25,
  },
  appName: {
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: 5,
    color: "#F2E6D6",
  },
  tagline: {
    fontSize: 15,
    marginTop: 10,
    letterSpacing: 1,
  },
  footer: {
    position: "absolute",
    bottom: 45,
    color: "#F2E6D6",
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: "600",
  },
});