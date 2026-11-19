
import React, { useEffect } from "react";
import { Alert, ActivityIndicator, View, StyleSheet, } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import defaultCover from "@/assets/images/default-song-image/default-song-image.png";
import NowPlayingTemplate from "@/components/templates/NowPlayingTemplate/NowPlayingTemplate";
import { usePlaybackStore } from "@/stores/playbackStore";
import useMusicStore from "@/stores/musicStore";
import { useAppTheme } from "@/theme/useThemeStore";

export default function NowPlayingScreen() {
  const { theme } = useAppTheme();

  // Playback store
  const currentSong = usePlaybackStore(
    (state) => state.currentSong
  );

  const isPlaying = usePlaybackStore(
    (state) => state.isPlaying
  );

  const currentTime = usePlaybackStore(
    (state) => state.currentTime
  );

  const duration = usePlaybackStore(
    (state) => state.duration
  );

  const playSong = usePlaybackStore(
    (state) => state.playSong
  );

  const togglePlayPause = usePlaybackStore(
    (state) => state.togglePlayPause
  );

  const nextSong = usePlaybackStore(
    (state) => state.nextSong
  );

  const seekTo = usePlaybackStore(
    (state) => state.seekTo
  );

  // Music library
  const songs = useMusicStore((state) => state.songs);

  // Redirect if there is no active song
  useEffect(() => {
    if (!currentSong) {
      router.replace("/home");
    }
  }, [currentSong]);

  // Previous song
  const handlePrevious = () => {
    if (!currentSong || songs.length === 0) return;

    const currentIndex = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    if (currentIndex === -1) return;

    const previousIndex =
      (currentIndex - 1 + songs.length) % songs.length;

    const previousSong = songs[previousIndex];

    if (previousSong) {
      void playSong(previousSong);
    }
  };

  // More options
  const handleMorePress = () => {
    Alert.alert(
      "More Options",
      "Additional playback options will be available here."
    );
  };

  if (!currentSong) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={theme.accent}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: theme.background,
    }}
      edges={["top", "right", "bottom", "left"]}>
      <NowPlayingTemplate
        title={currentSong.title}
        artist={currentSong.artist}
        image={currentSong.image ?? defaultCover}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onBack={() => router.back()}
        onMorePress={handleMorePress}
        onPlayPause={togglePlayPause}
        onPrevious={handlePrevious}
        onNext={nextSong}
        onSeek={seekTo}
      />
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
