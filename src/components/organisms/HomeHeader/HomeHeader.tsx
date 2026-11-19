import React from "react";
import { View, StyleSheet } from "react-native";

import AppText from "../../atoms/AppText/AppText";
import IconButton from "../../atoms/IconButton/IconButton";
import { useAppTheme } from "@/theme/useThemeStore";

type HomeHeaderProps = {
  title?: string;
};

export default function HomeHeader({
  title = "Your music.",
}: HomeHeaderProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AppText size={25} weight="900">
          {title}
        </AppText>
      </View>

      <View style={styles.actions}>
        <IconButton
          icon="ellipsis-horizontal"
          onPress={() => {}}
          size={42}
          iconSize={23}
          color={theme.text}
          backgroundColor="transparent"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  textContainer: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
});
