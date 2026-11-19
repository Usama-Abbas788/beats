
import React from "react";
import {
  GestureResponderEvent,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/theme/useThemeStore";

type PlayButtonProps = {
  isPlaying?: boolean;
  onPress: (event: GestureResponderEvent) => void;
  size?: number;
  style?: ViewStyle;
};

export default function PlayButton({
  isPlaying = false,
  onPress,
  size = 48,
  style,
}: PlayButtonProps) {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.accent,
        },
        style,
      ]}
    >
      <Ionicons
        name={isPlaying ? "pause" : "play"}
        size={size * 0.45}
        color="#14292A"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
});
