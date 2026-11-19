
import React, { memo, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
} from "react-native";

import AppText from "../AppText/AppText";
import { useAppTheme } from "@/theme/useThemeStore";

type PlaybackProgressProps = {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void | Promise<void>;
  trackHeight?: number;
  thumbSize?: number;
  showTime?: boolean;
};

function PlaybackProgress({
  currentTime,
  duration,
  onSeek,
  trackHeight = 3,
  thumbSize = 10,
  showTime = true,
}: PlaybackProgressProps) {
  const { theme } = useAppTheme();

  const [progressWidth, setProgressWidth] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  const [panHandlers, setPanHandlers] = useState<
    ReturnType<typeof PanResponder.create>["panHandlers"] | null
  >(null);

  const progressRef = useRef(0);
  const progressWidthRef = useRef(0);
  const durationRef = useRef(duration);
  const onSeekRef = useRef(onSeek);
  const touchStartXRef = useRef(0);

  useEffect(() => {
    durationRef.current = duration;
    onSeekRef.current = onSeek;
  }, [duration, onSeek]);

  const progress =
    duration > 0
      ? Math.min(Math.max(currentTime / duration, 0), 1)
      : 0;

  const displayedProgress = dragging ? dragProgress : progress;

  const calculateProgress = (positionX: number) => {
    const width = progressWidthRef.current;
    const length = durationRef.current;

    if (width <= 0 || length <= 0) {
      return 0;
    }

    return Math.min(Math.max(positionX / width, 0), 1);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;

    progressWidthRef.current = width;
    setProgressWidth(width);
  };

  useEffect(() => {
    const responder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (event) => {
        touchStartXRef.current = event.nativeEvent.locationX;

        const nextProgress = calculateProgress(
          touchStartXRef.current
        );

        progressRef.current = nextProgress;
        setDragProgress(nextProgress);
        setDragging(true);
      },

      onPanResponderMove: (_event, gestureState) => {
        const nextX =
          touchStartXRef.current + gestureState.dx;

        const nextProgress = calculateProgress(nextX);

        progressRef.current = nextProgress;
        setDragProgress(nextProgress);
      },

      onPanResponderRelease: (event) => {
        event.stopPropagation();

        const selectedTime =
          progressRef.current * durationRef.current;

        void (async () => {
          try {
            await onSeekRef.current(selectedTime);
          } finally {
            setDragging(false);
          }
        })();
      },

      onPanResponderTerminate: () => {
        setDragging(false);
      },
    });

    setPanHandlers(responder.panHandlers);
  }, []);

  const formatTime = (seconds: number) => {
    const safeSeconds = Math.max(0, Math.floor(seconds));

    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const displayedTime = dragging
    ? dragProgress * duration
    : currentTime;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.sliderTouchArea,
          { height: Math.max(17, thumbSize + 6) },
        ]}
        onLayout={handleLayout}
        {...(panHandlers ?? {})}
      >
        <View
          style={[
            styles.progressTrack,
            {
              height: trackHeight,
              backgroundColor: theme.border,
            },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${displayedProgress * 100}%`,
                backgroundColor: theme.accent,
              },
            ]}
          />
        </View>

        {progressWidth > 0 && (
          <View
            style={[
              styles.thumb,
              {
                width: thumbSize,
                height: thumbSize,
                borderRadius: thumbSize / 2,
                marginLeft: -thumbSize / 2,
                backgroundColor: theme.accent,
                left: `${displayedProgress * 100}%`,
              },
            ]}
          />
        )}
      </View>

      {showTime && (
        <View style={styles.timeRow}>
          <AppText size={9} color={theme.textSecondary}>
            {formatTime(displayedTime)}
          </AppText>

          <AppText size={9} color={theme.textSecondary}>
            {formatTime(duration)}
          </AppText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  sliderTouchArea: {
    justifyContent: "center",
  },

  progressTrack: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  thumb: {
    position: "absolute",
    elevation: 2,
  },

  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 1,
  },
});

export default memo(PlaybackProgress);
