import React, { memo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";

import AppText from "../../atoms/AppText/AppText";
import SpinningArtwork from "../../atoms/SpinningArtwork/SpinningArtwork";
import { useAppTheme } from "@/theme/useThemeStore";

type SongListItemProps = {
  title: string;
  artist: string;
  image: ImageSourcePropType;
  isCurrentlyPlaying: boolean;
  isPlaying: boolean;
  onPress: () => void;
};

function SongListItem({
  title,
  artist,
  image,
  isCurrentlyPlaying,
  isPlaying,
  onPress,
}: SongListItemProps) {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        <SpinningArtwork
          source={image}
          size={48}
          isSpinning={isCurrentlyPlaying && isPlaying}
        />
      </View>

      <View style={styles.info}>
        <AppText
          size={14}
          weight="800"
          numberOfLines={1}
          color={isCurrentlyPlaying ? theme.accent : theme.text}
        >
          {title}
        </AppText>

        <AppText
          size={12}
          color={theme.textSecondary}
          numberOfLines={1}
          style={styles.artist}
        >
          {artist}
        </AppText>
      </View>
    </TouchableOpacity>
  );
}

export default memo(SongListItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginBottom: 15,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    overflow: "hidden",
    width: 52,
    height: 52,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  info: {
    flex: 1,
  },
  artist: {
    marginTop: 5,
  },
});
