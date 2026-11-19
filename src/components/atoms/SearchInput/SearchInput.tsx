
import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/theme/useThemeStore";

type SearchInputProps = TextInputProps & {
  value: string;
  onChangeText: (text: string) => void;
};

export default function SearchInput({
  value,
  onChangeText,
  placeholder = "Search songs, artists, albums...",
  ...props
}: SearchInputProps) {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      <Ionicons
        name="search-outline"
        size={21}
        color={theme.textSecondary}
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        style={[styles.input, { color: theme.text }]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
  },
});
