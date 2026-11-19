
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../atoms/AppText/AppText";
import { useAppTheme } from "@/theme/useThemeStore";

type TabItem = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
};

type BottomNavigationProps = {
  items: TabItem[];
  activeTab: string;
  onTabPress: (tab: string) => void;
};

export default function BottomNavigation({
  items,
  activeTab,
  onTabPress,
}: BottomNavigationProps) {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        },
      ]}
    >
      {items.map((item) => {
        const isActive = activeTab === item.label;

        return (
          <TouchableOpacity
            key={item.label}
            activeOpacity={0.7}
            onPress={() => onTabPress(item.label)}
            style={styles.navItem}
          >
            <Ionicons
              name={item.icon}
              size={23}
              color={isActive ? theme.accent : theme.textSecondary}
            />

            <AppText
              size={10}
              weight="700"
              color={isActive ? theme.accent : theme.textSecondary}
            >
              {item.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 8,
    borderTopWidth: 1,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    minWidth: 55,
  },
});
