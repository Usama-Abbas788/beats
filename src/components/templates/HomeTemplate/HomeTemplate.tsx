
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Animated,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import IconButton from "../../atoms/IconButton/IconButton";
import HomeHeader from "../../organisms/HomeHeader/HomeHeader";
import CategorySelector from "../../organisms/CategorySelector/CategorySelector";
import BottomNavigation from "../../organisms/BottomNavigation/BottomNavigation";
import SearchInput from "../../atoms/SearchInput/SearchInput";
import AppText from "../../atoms/AppText/AppText";
import MiniPlayer from "../../molecules/MiniPlayer/MiniPlayer";
import SongListItem from "../../molecules/SongListItem/SongListItem";
import MusicLibraryStatus from "../../organisms/MusicLibraryStatus/MusicLibraryStatus";

import { useAppTheme } from "@/theme/useThemeStore";
import type { Song, SongSortOption } from "@/types/music";

const DEFAULT_SONG_IMAGE = require("@/assets/images/default-song-image/default-song-image.png");

const ITEM_HEIGHT = 67;
const PAGE_SIZE = 30;
const LOAD_MORE_DELAY = 250;

const getItemLayout = (_: any, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

type NavigationItem = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
};

type HomeTemplateProps = {
  onShuffle: () => void;
  isShuffled?: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortOption: SongSortOption;
  onSortChange: (option: SongSortOption) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  songs: Song[];
  songCount: number;
  onSongPress: (song: Song) => void;
  currentSong: Song | null;
  currentSongId: string | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onQuitPlayback: () => void;
  permissionStatus: "unknown" | "granted" | "denied";
  canAskAgain: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  onGrantPermission: () => void;
  onRefresh: () => void;
  navigationItems: NavigationItem[];
  activeTab: string;
  onTabPress: (tab: string) => void;
};

type PaginationState = {
  key: string;
  count: number;
  loading: boolean;
};

export default function HomeTemplate({
  onShuffle,
  isShuffled = false,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  categories,
  selectedCategory,
  onCategoryChange,
  songs,
  songCount,
  onSongPress,
  currentSong,
  currentSongId,
  isPlaying,
  onPlayPause,
  onNext,
  onQuitPlayback,
  permissionStatus,
  canAskAgain,
  isLoading,
  isRefreshing,
  error,
  onGrantPermission,
  onRefresh,
  navigationItems,
  activeTab,
  onTabPress,
}: HomeTemplateProps) {
  const { theme } = useAppTheme();

  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const [toastOpacity] = useState(() => new Animated.Value(0));
  const [toastTranslateY] = useState(() => new Animated.Value(25));

  const [toastTimer, setToastTimer] = useState<
    ReturnType<typeof setTimeout> | null
  >(null);

  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    key: "",
    count: PAGE_SIZE,
    loading: false,
  });

  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadingMoreRef = useRef(false);

  const hasPermission = permissionStatus === "granted";
  const hasSongs = songCount > 0;

  // Create a key from the current filtered and sorted song list
  const paginationKey = useMemo(
    () => songs.map((song) => song.id).join("|"),
    [songs],
  );

  // Derive pagination values without resetting state inside an effect
  const visibleSongsCount =
    pagination.key === paginationKey ? pagination.count : PAGE_SIZE;

  const isLoadingMore =
    pagination.key === paginationKey && pagination.loading;

  // Display only the currently requested chunk
  const visibleSongs = useMemo(
    () => songs.slice(0, visibleSongsCount),
    [songs, visibleSongsCount],
  );

  const hasMoreSongs = visibleSongsCount < songs.length;

  // Load the next chunk when the user approaches the bottom
  const handleLoadMore = useCallback(() => {
    if (isLoadingMoreRef.current || !hasMoreSongs) {
      return;
    }

    isLoadingMoreRef.current = true;

    setPagination({
      key: paginationKey,
      count: visibleSongsCount,
      loading: true,
    });

    loadingTimerRef.current = setTimeout(() => {
      setPagination((previous) => {
        const currentCount =
          previous.key === paginationKey ? previous.count : PAGE_SIZE;

        return {
          key: paginationKey,
          count: Math.min(currentCount + PAGE_SIZE, songs.length),
          loading: false,
        };
      });

      isLoadingMoreRef.current = false;
      loadingTimerRef.current = null;
    }, LOAD_MORE_DELAY);
  }, [hasMoreSongs, paginationKey, visibleSongsCount, songs.length]);

  // Clean up pending pagination timer
  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, []);

  // Show toast emerging from the mini player
  const showQuitToast = useCallback(() => {
    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastOpacity.stopAnimation();
    toastTranslateY.stopAnimation();

    toastOpacity.setValue(0);
    toastTranslateY.setValue(25);

    setToastVisible(true);

    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(toastTranslateY, {
        toValue: 0,
        friction: 7,
        tension: 65,
        useNativeDriver: true,
      }),
    ]).start();

    // Hide the toast after 5 seconds
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(toastTranslateY, {
          toValue: 12,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setToastVisible(false);
        }
      });
    }, 5000);

    setToastTimer(timer);
  }, [toastOpacity, toastTranslateY, toastTimer]);

  // Clicking the toast exits playback
  const handleToastPress = useCallback(() => {
    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    setToastVisible(false);
    onQuitPlayback();
  }, [toastTimer, onQuitPlayback]);

  // Clean up toast timer
  useEffect(() => {
    if (!toastTimer) return;

    return () => {
      clearTimeout(toastTimer);
    };
  }, [toastTimer]);

  const sortOptions: {
    value: SongSortOption;
    label: string;
  }[] = [
    { value: "newest", label: "Newest to oldest (Default)" },
    { value: "oldest", label: "Oldest first" },
    { value: "title", label: "Title: A to Z" },
    { value: "artist", label: "Artist: A to Z" },
    { value: "longest", label: "Longest first" },
  ];

  const renderSongItem = useCallback(
    ({ item }: { item: Song }) => (
      <SongListItem
        title={item.title}
        artist={item.artist}
        image={item.image ?? DEFAULT_SONG_IMAGE}
        isCurrentlyPlaying={item.id === currentSongId}
        isPlaying={isPlaying}
        onPress={() => onSongPress(item)}
      />
    ),
    [currentSongId, isPlaying, onSongPress],
  );

  const renderHeader = useMemo(
    () => (
      <View>
        <MusicLibraryStatus
          permissionStatus={permissionStatus}
          canAskAgain={canAskAgain}
          isLoading={isLoading}
          songCount={songCount}
          error={error}
          onGrantPermission={onGrantPermission}
        />

        {hasPermission && hasSongs && songs.length > 0 && (
          <View style={styles.libraryHeaderRow}>
            <AppText
              size={20}
              weight="800"
              style={styles.libraryHeading}
            >
              Your library
            </AppText>

            {isRefreshing ? (
              <View style={styles.refreshIndicator}>
                <ActivityIndicator size="small" color={theme.accent} />
              </View>
            ) : (
              <IconButton
                icon="refresh-outline"
                onPress={onRefresh}
                size={36}
                iconSize={20}
                color={theme.accent}
                backgroundColor="transparent"
              />
            )}
          </View>
        )}
      </View>
    ),
    [
      permissionStatus,
      canAskAgain,
      isLoading,
      songCount,
      error,
      onGrantPermission,
      hasPermission,
      hasSongs,
      songs.length,
      isRefreshing,
      onRefresh,
      theme.accent,
    ],
  );

  const renderEmpty = useMemo(() => {
    if (!hasPermission || !hasSongs || songs.length > 0 || isLoading) {
      return undefined;
    }

    return (
      <View
        style={[
          styles.emptySearchContainer,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={28}
          color={theme.textSecondary}
        />

        <Text style={[styles.emptySearchTitle, { color: theme.text }]}>
          No matching songs
        </Text>

        <Text
          style={[
            styles.emptySearchDescription,
            { color: theme.textSecondary },
          ]}
        >
          Try another song title or artist name.
        </Text>
      </View>
    );
  }, [hasPermission, hasSongs, songs.length, isLoading, theme]);

  // Footer loader for the next chunk
  const renderFooter = useMemo(() => {
    if (!hasMoreSongs) {
      return undefined;
    }

    return (
      <View style={styles.loadingFooter}>
        {isLoadingMore && (
          <ActivityIndicator size="small" color={theme.accent} />
        )}
      </View>
    );
  }, [hasMoreSongs, isLoadingMore, theme.accent]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.fixedHeader}>
        <HomeHeader />

        <View style={styles.searchRow}>
          <View style={styles.searchInput}>
            <SearchInput
              value={searchQuery}
              onChangeText={onSearchChange}
              placeholder="Search songs, artists..."
            />
          </View>

          <View />

          <IconButton
            icon="shuffle"
            onPress={onShuffle}
            size={36}
            iconSize={22}
            style={{ flexDirection: "row" }}
            color={isShuffled ? theme.brand : theme.accent}
            backgroundColor={isShuffled ? theme.accent : theme.surface}
          >
            <Text
              style={[
                styles.iconText,
                { color: isShuffled ? theme.brand : theme.accent },
              ]}
            >
              Shuffle
            </Text>
          </IconButton>

          <IconButton
            icon="swap-vertical"
            onPress={() => setSortMenuVisible(true)}
            size={36}
            iconSize={22}
            color={theme.text}
          />
        </View>

        {hasPermission && hasSongs && (
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        )}
      </View>

      <FlatList
        data={visibleSongs}
        keyExtractor={(item) => item.id}
        renderItem={renderSongItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        initialNumToRender={20}
        maxToRenderPerBatch={15}
        updateCellsBatchingPeriod={40}
        windowSize={11}
        removeClippedSubviews={Platform.OS === "android" ? false : undefined}
        getItemLayout={getItemLayout}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />

      {/* Bottom player and navigation */}
      <View style={styles.bottomContainer}>
        {currentSong && (
          <MiniPlayer
            title={currentSong.title}
            artist={currentSong.artist}
            image={currentSong.image ?? DEFAULT_SONG_IMAGE}
            isPlaying={isPlaying}
            onPlayPause={onPlayPause}
            onNext={onNext}
            onQuitPlayback={onQuitPlayback}
            onShowToast={showQuitToast}
          />
        )}

        <BottomNavigation
          items={navigationItems}
          activeTab={activeTab}
          onTabPress={onTabPress}
        />
      </View>

      {/* Quit playback toast */}
      {toastVisible && (
        <Animated.View
          style={[
            styles.quitToastContainer,
            {
              opacity: toastOpacity,
              transform: [{ translateY: toastTranslateY }],
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleToastPress}
            style={[
              styles.quitToast,
              {
                backgroundColor:
                  theme.mode === "dark" ? "#1A3633" : "#14292A",
                borderColor: theme.accent,
              },
            ]}
          >
            <Ionicons
              name="close-circle"
              size={17}
              color={theme.accent}
            />

            <Text style={styles.quitToastText}>Quit</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Sorting modal */}
      <Modal
        visible={sortMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSortMenuVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSortMenuVisible(false)}
        >
          <Pressable
            style={[
              styles.sortMenu,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
            onPress={() => {}}
          >
            <Text style={[styles.sortTitle, { color: theme.text }]}>
              Sort songs
            </Text>

            {sortOptions.map((option) => {
              const isSelected =
                !isShuffled && sortOption === option.value;

              return (
                <TouchableOpacity
                  key={option.value}
                  style={styles.sortOption}
                  onPress={() => {
                    onSortChange(option.value);
                    setSortMenuVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.sortOptionLabel,
                      {
                        color: isSelected ? theme.accent : theme.text,
                        fontWeight: isSelected ? "700" : "400",
                      },
                    ]}
                  >
                    {option.label}
                  </Text>

                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={theme.accent}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  fixedHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  searchInput: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },

  libraryHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 10,
  },

  libraryHeading: {},

  refreshIndicator: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingFooter: {
    height: 55,
    alignItems: "center",
    justifyContent: "center",
  },

  quitToastContainer: {
    position: "absolute",
    zIndex: 999,
    bottom: 148,
    alignSelf: "center",
  },

  quitToast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1.5,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },

  quitToastText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    padding: 28,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },

  sortMenu: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  sortTitle: {
    fontSize: 18,
    fontWeight: "800",
    paddingVertical: 12,
  },

  sortOption: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sortOptionLabel: {
    fontSize: 15,
  },

  emptySearchContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 8,
  },

  emptySearchTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
  },

  emptySearchDescription: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
  },

  bottomContainer: {
    paddingTop: 4,
  },

  iconText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
