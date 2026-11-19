
import { create } from "zustand";
import type { Song } from "@/types/music";

import {
  checkAudioPermission,
  requestAudioPermission,
} from "@/services/music/musicPermissionService";

import { scanLocalMusic } from "@/services/music/musicLibraryService";

import {
  getCachedMusic,
  saveMusicCache,
} from "@/services/music/musicCacheService";

type PermissionStatus = "unknown" | "granted" | "denied";

type MusicState = {
  songs: Song[];
  isLoading: boolean;
  isRefreshing: boolean;
  hasLoadedCache: boolean;
  permissionStatus: PermissionStatus;
  canAskAgain: boolean;
  error: string | null;

  initializeMusic: () => Promise<void>;
  requestPermission: () => Promise<void>;
  syncMusicLibrary: () => Promise<void>;
  refreshMusicLibrary: () => Promise<void>;
};

const useMusicStore = create<MusicState>((set, get) => {
  let refreshPromise: Promise<void> | null = null;
  let initializationPromise: Promise<void> | null = null;

  /**
   * Synchronizes the device music library.
   *
   * isManual = true:
   * Shows the refresh spinner.
   *
   * isManual = false:
   * Runs silently in the background.
   */
  const refreshLibrary = async (isManual = false): Promise<void> => {
    // If a scan is already running, reuse it.
    if (refreshPromise) {
      if (isManual) {
        set({ isRefreshing: true });
      }

      await refreshPromise;
      return;
    }

    if (isManual) {
      set({
        isRefreshing: true,
        error: null,
        isLoading: get().songs.length === 0,
      });
    } else {
      set({
        error: null,
        isLoading: get().songs.length === 0,
      });
    }

    refreshPromise = (async () => {
      try {
        const permission = await checkAudioPermission();

        set({
          permissionStatus: permission.granted ? "granted" : "denied",
          canAskAgain: permission.canAskAgain,
        });

        if (!permission.granted) {
          set({
            songs: [],
            isLoading: false,
            isRefreshing: false,
          });

          return;
        }

        // Fetch the latest songs from the device.
        const freshSongs = await scanLocalMusic();

        // Update the UI without clearing the existing cached list first.
        set({ songs: freshSongs });

        // Save the latest successful scan locally.
        await saveMusicCache(freshSongs);

        set({
          isLoading: false,
          isRefreshing: false,
          error: null,
        });
      } catch (error) {
        console.error("Music library synchronization failed:", error);

        // Keep existing songs if synchronization fails.
        set({
          isLoading: false,
          isRefreshing: false,
          error: "Unable to refresh your music library. Please try again.",
        });
      } finally {
        refreshPromise = null;
      }
    })();

    await refreshPromise;
  };

  return {
    songs: [],
    isLoading: true,
    isRefreshing: false,
    hasLoadedCache: false,
    permissionStatus: "unknown",
    canAskAgain: true,
    error: null,

    /**
     * Load cached songs first, then silently synchronize.
     */
    initializeMusic: async () => {
      if (initializationPromise) {
        await initializationPromise;
        return;
      }

      initializationPromise = (async () => {
        try {
          const cachedSongs = await getCachedMusic();

          set({
            songs: cachedSongs,
            hasLoadedCache: true,
            isLoading: cachedSongs.length === 0,
          });

          // Silent synchronization; no refresh icon spinner.
          await refreshLibrary(false);
        } catch (error) {
          console.error("Music initialization failed:", error);

          set({
            hasLoadedCache: true,
            isLoading: false,
            error: "Unable to load your music library.",
          });
        } finally {
          initializationPromise = null;
        }
      })();

      await initializationPromise;
    },

    /**
     * Request audio permission when the user grants access.
     */
    requestPermission: async () => {
      set({
        isLoading: get().songs.length === 0,
        error: null,
      });

      try {
        const permission = await requestAudioPermission();

        set({
          permissionStatus: permission.granted ? "granted" : "denied",
          canAskAgain: permission.canAskAgain,
        });

        if (!permission.granted) {
          set({
            isLoading: false,
            isRefreshing: false,
          });
          return;
        }

        await refreshLibrary(false);
      } catch (error) {
        console.error("Audio permission request failed:", error);

        set({
          isLoading: false,
          error: "Unable to access your music library.",
        });
      }
    },

    /**
     * Automatic synchronization.
     * Does not show the refresh icon spinner.
     */
    syncMusicLibrary: async () => {
      await refreshLibrary(false);
    },

    /**
     * Manual synchronization.
     * Shows the refresh icon spinner.
     */
    refreshMusicLibrary: async () => {
      await refreshLibrary(true);
    },
  };
});

export default useMusicStore;
