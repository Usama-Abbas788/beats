
import * as MediaLibrary from "expo-media-library";

export const checkAudioPermission = async () => {
  return await MediaLibrary.getPermissionsAsync(false, ["audio"]);
};

export const requestAudioPermission = async () => {
  return await MediaLibrary.requestPermissionsAsync(false, ["audio"]);
};
