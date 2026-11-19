import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { useAppTheme } from "@/theme/useThemeStore";

type AppTextProps = TextProps & {
  children: React.ReactNode;
  size?: number;
  weight?: TextStyle["fontWeight"];
  color?: string;
  style?: TextStyle;
  numberOfLines?: number;
};

export default function AppText({
  children,
  size = 14,
  weight = "400",
  color,
  style,
  numberOfLines,
  ...props
}: AppTextProps) {
  const { theme } = useAppTheme();

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          fontSize: size,
          fontWeight: weight,
          color: color ?? theme.text,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}