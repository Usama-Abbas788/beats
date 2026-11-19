
import {
  AssetField,
  MediaType,
  Query,
} from "expo-media-library";

import type { Song } from "@/types/music";

export const scanLocalMusic = async (): Promise<Song[]> => {
  try {
    const assets = await new Query()
      .eq(AssetField.MEDIA_TYPE, MediaType.AUDIO)
      .orderBy({
        key: AssetField.CREATION_TIME,
        ascending: false,
      })
      .limit(500)
      .exe();

    const songs: Song[] = await Promise.all(
      assets.map(async (asset) => {
        const info = await asset.getInfo();

        // Remove the file extension from the filename.
        const title = info.filename.replace(/\.[^/.]+$/, "");

        const timestamp =
          (info.creationTime && info.creationTime > 0
            ? info.creationTime
            : info.modificationTime) ?? 0;

        return {
          id: asset.id,
          title,
          artist: "Unknown Artist",
          category: "All",
          uri: info.uri,
          duration: info.duration ?? 0,
          addedAt: timestamp,
        };
      })
    );

    return songs;
  } catch (error) {
    console.error("Failed to scan local music:", error);
    throw error;
  }
};
