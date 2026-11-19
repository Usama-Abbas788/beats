import React from "react";
import {
  GestureResponderEvent,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/theme/useThemeStore";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type IconButtonProps = {
  icon: IconName;
  onPress: (event: GestureResponderEvent) => void;
  size?: number;
  iconSize?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
};

export default function IconButton({
  icon,
  onPress,
  size = 44,
  iconSize = 22,
  color,
  backgroundColor,
  style,
  children,
}: IconButtonProps) {
  const { theme } = useAppTheme();
  const hasChildren = React.Children.count(children) > 0;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.button,
        {
          height: size,
          borderRadius: size / 3,
          backgroundColor: backgroundColor ?? theme.surface,
        },
        hasChildren ? styles.withChildren : { width: size },
        style,
      ]}
    >
      <Ionicons
        name={icon}
        size={iconSize}
        color={color ?? theme.text}
      />
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  withChildren: {
    paddingHorizontal: 10,
  },
});