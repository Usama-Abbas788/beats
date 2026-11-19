
import {
  createAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";

import type { Song } from "@/types/music";

const player = createAudioPlayer(null, {
  updateInterval: 500,
});

let audioModeConfigured = false;

export const configureAudioPlayback = async (): Promise<void> => {
  if (audioModeConfigured) {
    return;
  }

  await setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: true,
    interruptionMode: "doNotMix",
  });

  audioModeConfigured = true;
};

// Pre-configure playback so the first play is instant
void configureAudioPlayback();

export const playSong = async (song: Song): Promise<void> => {
  if (!song.uri) {
    throw new Error("This song does not have a valid audio URI.");
  }

  await configureAudioPlayback();

  try {
    player.pause();
  } catch {}

  player.setActiveForLockScreen(true, {
    title: song.title,
    artist: song.artist,
    albumTitle: "Beats",
  });

  player.replace({ uri: song.uri });
  player.play();
};

export const pausePlayback = (): void => {
  player.pause();
};

export const clearPlayback = (): void => {
  player.pause();
  player.setActiveForLockScreen(false);
  player.replace(null);
};

export const resumePlayback = (): void => {
  player.play();
};

export const seekToPosition = async (
  seconds: number
): Promise<void> => {
  await player.seekTo(seconds);
};

export const getAudioPlayer = () => player;
