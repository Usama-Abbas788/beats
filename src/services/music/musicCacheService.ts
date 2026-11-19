import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Song } from "@/types/music";

const MUSIC_CACHE_KEY = "@beats/local_music_library";

export const getCachedMusic = async (): Promise<Song[]> => {
  try {
    const cachedData = await AsyncStorage.getItem(MUSIC_CACHE_KEY);

    if (!cachedData) return [];

    return JSON.parse(cachedData) as Song[];
  } catch (error) {
    console.error("Failed to read cached music:", error);
    return [];
  }
};

export const saveMusicCache = async (songs: Song[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      MUSIC_CACHE_KEY,
      JSON.stringify(songs)
    );
  } catch (error) {
    console.error("Failed to save music cache:", error);
  }
};