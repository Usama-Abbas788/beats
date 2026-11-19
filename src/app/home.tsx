import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, AppState } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";

import HomeTemplate from "../components/templates/HomeTemplate/HomeTemplate";

import { useAppTheme } from "@/theme/useThemeStore";
import useMusicStore from "@/stores/musicStore";
import { usePlaybackStore } from "@/stores/playbackStore";

import type { Song, SongSortOption } from "@/types/music";

const categories = [
  "All",
  "Tracks",
  "Recent",
  "Favorites",
  "Artists",
  "Albums",
  "Folders",
];

// Bottom navigation items.
const navigationItems: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}[] = [
  { label: "Home", icon: "home-outline" },
  { label: "Search", icon: "search-outline" },
  { label: "Library", icon: "library-outline" },
  { label: "Profile", icon: "person-outline" },
];

export default function HomePage() {
  const { theme } = useAppTheme();

  // Zustand music library state.
  const localSongs = useMusicStore((state) => state.songs);
  const isLoading = useMusicStore((state) => state.isLoading);
  const isRefreshing = useMusicStore((state) => state.isRefreshing);
  const permissionStatus = useMusicStore(
    (state) => state.permissionStatus
  );
  const canAskAgain = useMusicStore((state) => state.canAskAgain);
  const error = useMusicStore((state) => state.error);

  const initializeMusic = useMusicStore(
    (state) => state.initializeMusic
  );
  const requestPermission = useMusicStore(
    (state) => state.requestPermission
  );
  const syncMusicLibrary = useMusicStore(
    (state) => state.syncMusicLibrary
  );
  const refreshMusicLibrary = useMusicStore(
    (state) => state.refreshMusicLibrary
  );

  // Zustand playback state - note: currentTime and duration are subscribed directly by MiniPlayer
  // to avoid re-rendering the home screen every 500ms during audio playback.
  const currentSong = usePlaybackStore((state) => state.currentSong);
  const isPlaying = usePlaybackStore((state) => state.isPlaying);
  const playbackError = usePlaybackStore((state) => state.error);

  const playSong = usePlaybackStore((state) => state.playSong);
  const togglePlayPause = usePlaybackStore(
    (state) => state.togglePlayPause
  );
  const nextSong = usePlaybackStore((state) => state.nextSong);
  const resetPlayback = usePlaybackStore(
    (state) => state.resetPlayback
  );

  // Search and sort state.
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] =
    useState<SongSortOption>("newest");
  const [shuffleOrder, setShuffleOrder] =
    useState<Record<string, number> | null>(null);

  // Category state.
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Navigation state.
  const [activeTab, setActiveTab] = useState("Home");

  /**
   * Initialize the local cache and automatically synchronize
   * when the media library changes or the app returns to foreground.
   */
  useEffect(() => {
    void initializeMusic();

    // Listen for device media-library changes.
    const mediaSubscription = MediaLibrary.addListener(() => {
      void syncMusicLibrary();
    });

    // Listen for app foreground transitions.
    let previousAppState = AppState.currentState ?? "active";

    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        const returnedToForeground =
          /inactive|background/.test(previousAppState) &&
          nextAppState === "active";

        if (returnedToForeground) {
          // Silent synchronization; no manual refresh spinner.
          void syncMusicLibrary();
        }

        previousAppState = nextAppState;
      }
    );

    return () => {
      mediaSubscription.remove();
      appStateSubscription.remove();
    };
  }, [initializeMusic, syncMusicLibrary]);

  // Show music-library synchronization errors.
  useEffect(() => {
    if (error) {
      Alert.alert("Music Library", error);
    }
  }, [error]);

  // Show audio playback errors.
  useEffect(() => {
    if (playbackError) {
      Alert.alert("Playback Error", playbackError);
    }
  }, [playbackError]);

  /**
   * Filter and sort the actual device songs.
   * Default sorting: newest to oldest.
   * When shuffle is active: random ordering without auto-playing.
   */
  const filteredSongs = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = localSongs.filter((song: Song) => {
      let matchesCategory = true;
      if (selectedCategory === "All" || selectedCategory === "Tracks") {
        matchesCategory = true;
      } else if (selectedCategory === "Recent") {
        matchesCategory = true;
      } else if (selectedCategory === "Favorites") {
        matchesCategory = song.category === "Favorites";
      } else if (selectedCategory === "Artists") {
        matchesCategory =
          song.artist !== "Unknown Artist" || localSongs.length > 0;
      } else {
        matchesCategory =
          song.category.toLowerCase() === selectedCategory.toLowerCase();
      }

      const matchesSearch =
        normalizedQuery.length === 0 ||
        song.title.toLowerCase().includes(normalizedQuery) ||
        song.artist.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });

    if (shuffleOrder) {
      return [...filtered].sort(
        (first, second) =>
          (shuffleOrder[first.id] ?? 0) - (shuffleOrder[second.id] ?? 0)
      );
    }

    return [...filtered].sort((first, second) => {
      switch (sortOption) {
        case "oldest":
          return (first.addedAt ?? 0) - (second.addedAt ?? 0);
        case "title":
          return first.title.localeCompare(second.title);
        case "artist":
          return first.artist.localeCompare(second.artist);
        case "longest":
          return (second.duration ?? 0) - (first.duration ?? 0);
        case "newest":
        default:
          return (second.addedAt ?? 0) - (first.addedAt ?? 0);
      }
    });
  }, [localSongs, searchQuery, selectedCategory, sortOption, shuffleOrder]);

  // Request audio permission.
  const handleGrantPermission = useCallback(() => {
    void requestPermission();
  }, [requestPermission]);

  // Manual refresh.
  const handleRefresh = useCallback(() => {
    void refreshMusicLibrary();
  }, [refreshMusicLibrary]);

  // Shuffle only shuffles the list order randomly without auto-playing music.
  const handleShuffle = useCallback(() => {
    if (localSongs.length === 0) return;

    const newOrder: Record<string, number> = {};
    for (const song of localSongs) {
      newOrder[song.id] = Math.random();
    }
    setShuffleOrder(newOrder);
  }, [localSongs]);

  const handleSortChange = useCallback((option: SongSortOption) => {
    setSortOption(option);
    setShuffleOrder(null);
  }, []);

  // Select and play a song by user's own choice.
  const handleSongPress = useCallback(
    (song: Song) => {
      void playSong(song);
    },
    [playSong]
  );

  // Play the next song.
  const handleNext = useCallback(() => {
    void nextSong();
  }, [nextSong]);

  // Toggle audio playback.
  const handlePlayPause = useCallback(() => {
    togglePlayPause();
  }, [togglePlayPause]);

  // Quit playback and clear the current song.
  const handleQuitPlayback = useCallback(() => {
    resetPlayback();
  }, [resetPlayback]);

  // Bottom navigation.
  const handleTabPress = useCallback((tab: string) => {
    setActiveTab(tab);

    if (tab !== "Home") {
      Alert.alert(tab, `${tab} screen will be implemented next.`);
    }
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
      edges={["top", "right", "bottom", "left"]}
    >
      <HomeTemplate
        onShuffle={handleShuffle}
        isShuffled={shuffleOrder !== null}

        // Search.
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOption={sortOption}
        onSortChange={handleSortChange}

        // Categories.
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}

        // Local music.
        songs={filteredSongs}
        songCount={localSongs.length}
        onSongPress={handleSongPress}

        // Mini player.
        currentSong={currentSong}
        currentSongId={currentSong?.id ?? null}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onQuitPlayback={handleQuitPlayback}

        // Permission and loading.
        permissionStatus={permissionStatus}
        canAskAgain={canAskAgain}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        error={error}
        onGrantPermission={handleGrantPermission}
        onRefresh={handleRefresh}

        // Bottom navigation.
        navigationItems={navigationItems}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
}
