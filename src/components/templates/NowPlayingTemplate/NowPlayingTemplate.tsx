
import React from "react";
import { StyleSheet, View } from "react-native";

import NowPlayingContent from "../../organisms/NowPlayingContent/NowPlayingContent";
import { useAppTheme } from "@/theme/useThemeStore";

import type { ImageSourcePropType } from "react-native";

type NowPlayingTemplateProps = {
  title: string;
  artist: string;
  image?: ImageSourcePropType;

  isPlaying: boolean;
  currentTime: number;
  duration: number;

  onBack: () => void;
  onMorePress: () => void;

  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void | Promise<void>;
};

function NowPlayingTemplate({
  title,
  artist,
  image,
  isPlaying,
  currentTime,
  duration,
  onBack,
  onMorePress,
  onPlayPause,
  onPrevious,
  onNext,
  onSeek,
}: NowPlayingTemplateProps) {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <NowPlayingContent
        title={title}
        artist={artist}
        image={image}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onBack={onBack}
        onMorePress={onMorePress}
        onPlayPause={onPlayPause}
        onPrevious={onPrevious}
        onNext={onNext}
        onSeek={onSeek}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default NowPlayingTemplate;
