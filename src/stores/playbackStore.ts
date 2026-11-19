
import { create } from "zustand";
import type { Song } from "@/types/music";
import useMusicStore from "@/stores/musicStore";

import {
  getAudioPlayer,
  playSong as playAudioSong,
  pausePlayback,
  clearPlayback,
  resumePlayback,
  seekToPosition,
} from "@/services/music/musicPlaybackService";

interface PlaybackState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  error: string | null;

  playSong: (song: Song) => Promise<void>;
  togglePlayPause: () => void;
  nextSong: () => Promise<void>;
  seekTo: (seconds: number) => Promise<void>;
  resetPlayback: () => void;
}

let isSwitchingSong = false;

export const usePlaybackStore = create<PlaybackState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  error: null,

  playSong: async (song: Song) => {
    const { currentSong, isPlaying } = get();

    // If tapping the song that is already playing, keep it playing smoothly
    if (currentSong?.id === song.id) {
      if (!isPlaying) {
        get().togglePlayPause();
      }
      return;
    }

    isSwitchingSong = true;

    try {
      set({
        currentSong: song,
        isPlaying: true,
        currentTime: 0,
        duration: song.duration ?? 0,
        error: null,
      });

      await playAudioSong(song);
    } catch (error) {
      isSwitchingSong = false;
      set({
        isPlaying: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to play this song.",
      });
    }
  },

  togglePlayPause: () => {
    isSwitchingSong = false;
    const { isPlaying, currentSong } = get();

    if (!currentSong) return;

    if (isPlaying) {
      set({ isPlaying: false });
      pausePlayback();
    } else {
      set({ isPlaying: true });
      resumePlayback();
    }
  },

  nextSong: async () => {
    const songs = useMusicStore.getState().songs;
    const currentSong = get().currentSong;

    if (songs.length === 0) return;

    const currentIndex = songs.findIndex(
      (song: Song) => song.id === currentSong?.id
    );

    const nextIndex =
      currentIndex === -1 || currentIndex === songs.length - 1
        ? 0
        : currentIndex + 1;

    await get().playSong(songs[nextIndex]);
  },

  seekTo: async (seconds: number) => {
    const { duration, currentSong } = get();

    if (!currentSong || duration <= 0) return;

    const safePosition = Math.min(
      Math.max(seconds, 0),
      duration
    );

    try {
      await seekToPosition(safePosition);
      set({ currentTime: safePosition });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Unable to seek playback.",
      });
    }
  },

  resetPlayback: () => {
    isSwitchingSong = false;
    clearPlayback();

    set({
      currentSong: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      error: null,
    });
  },
}));

const audioPlayer = getAudioPlayer();

audioPlayer.addListener("playbackStatusUpdate", (status) => {
  if (isSwitchingSong) {
    if (status.playing) {
      // Audio has officially begun playing the new song
      isSwitchingSong = false;
    } else {
      // Ignore transient false playing updates while switching/loading a song
      usePlaybackStore.setState({
        currentTime: status.currentTime,
        duration:
          status.duration > 0
            ? status.duration
            : usePlaybackStore.getState().duration,
        error: status.error ?? null,
      });
      return;
    }
  }

  usePlaybackStore.setState({
    isPlaying: status.playing,
    currentTime: status.currentTime,
    duration:
      status.duration > 0
        ? status.duration
        : usePlaybackStore.getState().duration,
    error: status.error ?? null,
  });

  if (
    status.didJustFinish &&
    !isSwitchingSong &&
    usePlaybackStore.getState().currentSong
  ) {
    void usePlaybackStore.getState().nextSong();
  }
});
