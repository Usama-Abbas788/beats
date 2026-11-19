import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import PrimaryButton from "@/components/atoms/PrimaryButton/PrimaryButton";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAppTheme } from "@/theme/useThemeStore";

const WELCOME_KEY = "hasSeenWelcome";

const keywords = ["Discover", "Feel", "Explore", "Move"];

export default function WelcomeScreen() {
  const { theme } = useAppTheme();

  // Animation values
  const floatAnim = useRef(new Animated.Value(0)).current;
  const highlightAnim = useRef(new Animated.Value(0)).current;

  // Keyword animation values
  const keywordTranslateY = useRef(new Animated.Value(35)).current;
  const keywordOpacity = useRef(new Animated.Value(0)).current;

  const [keywordIndex, setKeywordIndex] = useState(0);

  useEffect(() => {
    // Floating text animation
    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    // Moving highlight animation
    const movingHighlight = Animated.loop(
      Animated.sequence([
        Animated.timing(highlightAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(highlightAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    floatingAnimation.start();
    movingHighlight.start();

    return () => {
      floatingAnimation.stop();
      movingHighlight.stop();
    };
  }, [floatAnim, highlightAnim]);

  // Continuous vertical keyword animation
  useEffect(() => {
    let isActive = true;
    let currentIndex = 0;

    const animateKeyword = () => {
      if (!isActive) return;

      // Reset keyword position below the visible area
      keywordTranslateY.setValue(35);
      keywordOpacity.setValue(0);

      // Enter from bottom
      Animated.parallel([
        Animated.timing(keywordTranslateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(keywordOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished || !isActive) return;

        // Keep keyword visible briefly
        Animated.delay(1200).start(({ finished: delayFinished }) => {
          if (!delayFinished || !isActive) return;

          // Disappear through the top
          Animated.parallel([
            Animated.timing(keywordTranslateY, {
              toValue: -35,
              duration: 500,
              easing: Easing.in(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(keywordOpacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]).start(({ finished: exitFinished }) => {
            if (!exitFinished || !isActive) return;

            // Switch to next keyword
            currentIndex = (currentIndex + 1) % keywords.length;

            setKeywordIndex(currentIndex);

            // Start next keyword
            animateKeyword();
          });
        });
      });
    };

    animateKeyword();

    return () => {
      isActive = false;
      keywordTranslateY.stopAnimation();
      keywordOpacity.stopAnimation();
    };
  }, [keywordTranslateY, keywordOpacity]);

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem(WELCOME_KEY, "true");
      router.replace("/home");
    } catch (error) {
      console.error("Unable to save welcome status:", error);
    }
  };

  const textTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  const highlightTranslateX = highlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Brand */}
        <Text style={[styles.brand, { color: theme.secondary }]}>BEATS</Text>

        {/* Animated Heading */}
        <Animated.View
          style={[
            styles.headingContainer,
            {
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text style={[styles.titleLarge, { color: theme.text }]}>
            Every Beat
          </Text>
          {/* Animated Keywords */}
          <View style={styles.keywordContainer}>
            <Animated.Text
              style={[
                styles.keyword,
                {
                  color: theme.accent,
                  opacity: keywordOpacity,
                  transform: [{ translateY: keywordTranslateY }],
                },
              ]}
            >
              {keywords[keywordIndex]}
            </Animated.Text>
          </View>

          <Text style={[styles.titleSmall, { color: theme.text }]}>
            Your Way
          </Text>

          {/* Moving Highlight */}
          <View
            style={[styles.highlightTrack, { backgroundColor: theme.border }]}
          >
            <Animated.View
              style={[
                styles.highlightBar,
                {
                  backgroundColor: theme.secondary,
                  transform: [{ translateX: highlightTranslateX }],
                },
              ]}
            />
          </View>
        </Animated.View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <PrimaryButton title="Get Started" onPress={handleGetStarted} />

        <Text style={[styles.footer, { color: theme.textMuted }]}>
          YOUR MUSIC. YOUR SPACE.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingVertical: 45,
    justifyContent: "space-between",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  brand: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 8,
    marginBottom: 100,
  },

  headingContainer: {
    alignItems: "center",
  },

  titleLarge: {
    fontSize: 58,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 40,
  },
  titleSmall: {
    fontSize: 38,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 40,
  },

  keywordContainer: {
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginTop: 5,
  },

  keyword: {
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 60,
  },

  highlightTrack: {
    width: 180,
    height: 4,
    borderRadius: 10,
    marginTop: 18,
    overflow: "hidden",
  },

  highlightBar: {
    width: 80,
    height: 4,
    borderRadius: 10,
  },

  bottomSection: {
    gap: 22,
  },

  footer: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2,
    textAlign: "center",
  },
});
