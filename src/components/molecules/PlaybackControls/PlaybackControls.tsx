
import React from "react";
import { View, StyleSheet } from "react-native";

import IconButton from "../../atoms/IconButton/IconButton";
import PlayButton from "../../atoms/PlayButton/PlayButton";
import { useAppTheme } from "@/theme/useThemeStore";

type PlaybackControlsProps = {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

function PlaybackControls({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
}: PlaybackControlsProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <IconButton
        icon="play-skip-back"
        onPress={onPrevious}
        size={48}
        iconSize={25}
        color={theme.text}
        backgroundColor="transparent"
      />

      <PlayButton
        isPlaying={isPlaying}
        onPress={onPlayPause}
        size={64}
      />

      <IconButton
        icon="play-skip-forward"
        onPress={onNext}
        size={48}
        iconSize={25}
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
    justifyContent: "center",
    gap: 28,
    width: "100%",
  },
});

export default PlaybackControls;
