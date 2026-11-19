
import React from "react";
import {
  View,
  StyleSheet,
  ImageSourcePropType,
  ScrollView,
} from "react-native";

import NowPlayingHeader from "../../molecules/NowPlayingHeader/NowPlayingHeader";
import SongInformation from "../../molecules/SongInformation/SongInformation";
import PlaybackControls from "../../molecules/PlaybackControls/PlaybackControls";

import SpinningArtwork from "../../atoms/SpinningArtwork/SpinningArtwork";
import PlaybackProgress from "../../atoms/PlaybackProgress/PlaybackProgress";

import { useAppTheme } from "@/theme/useThemeStore";

type NowPlayingContentProps = {
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

function NowPlayingContent({
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
}: NowPlayingContentProps) {
  const { theme } = useAppTheme();

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <NowPlayingHeader
        onBack={onBack}
        onMorePress={onMorePress}
      />

      {/* Album Artwork */}
      <View style={styles.artworkContainer}>
        <SpinningArtwork
          source={image}
          size={280}
          isSpinning={isPlaying}
        />
      </View>

      {/* Song Information */}
      <SongInformation
        title={title}
        artist={artist}
      />

      {/* Playback Progress */}
      <View style={styles.progressContainer}>
        <PlaybackProgress
          currentTime={currentTime}
          duration={duration}
          onSeek={onSeek}
          trackHeight={5}
          thumbSize={15}
          showTime
        />
      </View>

      {/* Playback Controls */}
      <View style={styles.controlsContainer}>
        <PlaybackControls
          isPlaying={isPlaying}
          onPlayPause={onPlayPause}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },

  artworkContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 45,
    marginBottom: 40,
  },

  progressContainer: {
    marginTop: 30,
  },

  controlsContainer: {
    marginTop: 35,
  },
});

export default NowPlayingContent;
