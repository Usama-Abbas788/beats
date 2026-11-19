
import React from "react";
import { View, StyleSheet } from "react-native";

import AppText from "../../atoms/AppText/AppText";
import IconButton from "../../atoms/IconButton/IconButton";
import { useAppTheme } from "@/theme/useThemeStore";

type NowPlayingHeaderProps = {
  onBack: () => void;
  onMorePress: () => void;
};

function NowPlayingHeader({
  onBack,
  onMorePress,
}: NowPlayingHeaderProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <IconButton
        icon="chevron-back"
        onPress={onBack}
        size={40}
        iconSize={23}
        color={theme.text}
        backgroundColor="transparent"
      />

      <AppText
        size={15}
        weight="700"
        color={theme.text}
      >
        Now Playing
      </AppText>

      <IconButton
        icon="ellipsis-horizontal"
        onPress={onMorePress}
        size={40}
        iconSize={23}
        color={theme.text}
        backgroundColor="transparent"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default NowPlayingHeader;
