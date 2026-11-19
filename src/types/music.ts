
import { ImageSourcePropType } from "react-native";

export type Song = {
  id: string;
  title: string;
  artist: string;
  image?: ImageSourcePropType;
  category: string;
  uri?: string;
  duration?: number;
  addedAt?: number;
};

export type SongSortOption =
  | "newest"
  | "oldest"
  | "title"
  | "artist"
  | "longest";

