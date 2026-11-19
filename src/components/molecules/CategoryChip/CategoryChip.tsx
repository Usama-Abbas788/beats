
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";

import AppText from "../../atoms/AppText/AppText";
import { useAppTheme } from "@/theme/useThemeStore";

type CategoryChipProps = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  style?: ViewStyle;
};

export default function CategoryChip({
  label,
  isSelected,
  onPress,
  style,
}: CategoryChipProps) {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.container,
        style,
      ]}
    >
      <AppText
        size={14}
        weight={isSelected ? "800" : "600"}
        color={isSelected ? theme.accent : theme.textSecondary}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
