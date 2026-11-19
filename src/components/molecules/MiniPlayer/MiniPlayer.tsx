import React, { memo, useEffect, useState } from "react";
import { router } from "expo-router";
import {
  Animated,
  Easing,
  View,
  StyleSheet,
  ImageSourcePropType,
  Pressable,
} from "react-native";

import AppText from "../../atoms/AppText/AppText";
import PlayButton from "../../atoms/PlayButton/PlayButton";
import IconButton from "../../atoms/IconButton/IconButton";
import SpinningArtwork from "../../atoms/SpinningArtwork/SpinningArtwork";
import PlaybackProgress from "../../atoms/PlaybackProgress/PlaybackProgress";

import { useAppTheme } from "@/theme/useThemeStore";
import { usePlaybackStore } from "@/stores/playbackStore";

type MiniPlayerProps = {
  title: string;
  artist: string;
  image: ImageSourcePropType;
  isPlaying: boolean;
  currentTime?: number;
  duration?: number;
  onPlayPause: () => void;
  onNext: () => void;
  onSeek?: (seconds: number) => void | Promise<void>;
  onQuitPlayback: () => void;
  onShowToast: () => void;
};

function MiniPlayer({
  title,
  artist,
  image,
  isPlaying,
  currentTime: propCurrentTime,
  duration: propDuration,
  onPlayPause,
  onNext,
  onSeek: propOnSeek,
  onQuitPlayback,
  onShowToast,
}: MiniPlayerProps) {
  const { theme } = useAppTheme();

  const storeCurrentTime = usePlaybackStore(
    (state) => state.currentTime
  );

  const storeDuration = usePlaybackStore(
    (state) => state.duration
  );

  const storeSeekTo = usePlaybackStore(
    (state) => state.seekTo
  );

  const currentTime =
    propCurrentTime !== undefined
      ? propCurrentTime
      : storeCurrentTime;

  const duration =
    propDuration !== undefined
      ? propDuration
      : storeDuration;

  const onSeek = propOnSeek ?? storeSeekTo;

  const [titleViewportWidth, setTitleViewportWidth] = useState(0);
  const [titleWidth, setTitleWidth] = useState(0);

  const [marqueeOffset] = useState(() => new Animated.Value(0));

  const MARQUEE_GAP = 28;

  const cycleDistance =
    (titleWidth > 0 ? titleWidth : 120) + MARQUEE_GAP;

  // Marquee animation
  useEffect(() => {
    marqueeOffset.stopAnimation();

    if (!isPlaying || titleWidth <= 0) {
      marqueeOffset.setValue(0);
      return;
    }

    marqueeOffset.setValue(0);

    const animationDuration = Math.max(
      cycleDistance * 40,
      3200
    );

    const animation = Animated.loop(
      Animated.timing(marqueeOffset, {
        toValue: -cycleDistance,
        duration: animationDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => animation.stop();
  }, [
    isPlaying,
    marqueeOffset,
    cycleDistance,
    titleWidth,
  ]);

  const handleLongPress = () => {
    onShowToast();
  };

  return (
    <Pressable
      onPress={() => router.push("/now-playing")}
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
      onLongPress={handleLongPress}
      delayLongPress={400}
    >
      {/* Song information and controls */}
      <View style={styles.topRow}>
        <View style={styles.songSection}>
          <SpinningArtwork
            source={image}
            size={34}
            isSpinning={isPlaying}
            style={styles.image}
          />

          <View style={styles.songInfo}>
            {/* Animated song title */}
            <View
              style={styles.titleViewport}
              onLayout={(event) =>
                setTitleViewportWidth(
                  event.nativeEvent.layout.width
                )
              }
            >
              <Animated.View
                style={[
                  styles.marqueeTrack,
                  isPlaying && titleWidth > 0
                    ? {
                      transform: [
                        { translateX: marqueeOffset },
                      ],
                    }
                    : undefined,
                ]}
              >
                <AppText
                  size={12}
                  weight="800"
                  numberOfLines={1}
                  style={styles.marqueeTitle}
                  onLayout={(event) =>
                    setTitleWidth(
                      event.nativeEvent.layout.width
                    )
                  }
                >
                  {title}
                </AppText>

                <View style={styles.marqueeGap} />

                <AppText size={12} weight="800" numberOfLines={1}>
                  {title}
                </AppText>

                <View style={styles.marqueeGap} />

                <AppText size={12} weight="800" numberOfLines={1}>
                  {title}
                </AppText>
              </Animated.View>
            </View>

            {/* Artist */}
            <AppText
              size={10}
              color={theme.textSecondary}
              numberOfLines={1}
              style={styles.artist}
            >
              {artist}
            </AppText>
          </View>
        </View>

        {/* Playback controls */}
        <View style={styles.controls}>
          <PlayButton
            isPlaying={isPlaying}
            onPress={(event) => {
              event.stopPropagation();
              onPlayPause();
            }}
            size={32}
          />

          <IconButton
            icon="play-forward"
            onPress={(event) => {
              event.stopPropagation();
              onNext();
            }}
            size={32}
            iconSize={19}
            color={theme.text}
            backgroundColor="transparent"
          />
        </View>
      </View>

      {/* Reusable playback progress atom */}
      <View style={styles.progressSection}>
        <PlaybackProgress
          currentTime={currentTime}
          duration={duration}
          onSeek={onSeek}
          trackHeight={3}
          thumbSize={10}
          showTime={true}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginHorizontal: 12,
    marginBottom: 6,
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  songSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    overflow: "hidden",
  },

  image: {
    flexShrink: 0,
    borderRadius: 17,
  },

  songInfo: {
    flex: 1,
    overflow: "hidden",
  },

  titleViewport: {
    overflow: "hidden",
  },

  marqueeTrack: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },

  marqueeTitle: {
    flexShrink: 0,
  },

  marqueeGap: {
    width: 28,
  },

  artist: {
    marginTop: 2,
  },

  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  progressSection: {
    marginTop: 4,
  },
});

export default memo(MiniPlayer);
