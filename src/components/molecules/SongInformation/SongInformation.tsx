
import React from "react";
import { View, StyleSheet } from "react-native";

import AppText from "../../atoms/AppText/AppText";
import { useAppTheme } from "@/theme/useThemeStore";

type SongInformationProps = {
  title: string;
  artist: string;
};

function SongInformation({
  title,
  artist,
}: SongInformationProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <AppText
        size={22}
        weight="800"
        color={theme.text}
        numberOfLines={2}
        style={styles.title}
      >
        {title}
      </AppText>

      <AppText
        size={14}
        weight="500"
        color={theme.textSecondary}
        numberOfLines={1}
        style={styles.artist}
      >
        {artist}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
  },

  title: {
    textAlign: "center",
  },

  artist: {
    textAlign: "center",
    marginTop: 7,
  },
});

export default SongInformation;
