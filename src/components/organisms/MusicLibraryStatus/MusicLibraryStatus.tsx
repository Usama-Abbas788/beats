
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "@/theme/useThemeStore";

type MusicLibraryStatusProps = {
  permissionStatus: "unknown" | "granted" | "denied";
  canAskAgain: boolean;
  isLoading: boolean;
  songCount: number;
  error: string | null;
  onGrantPermission: () => void;
};

export default function MusicLibraryStatus({
  permissionStatus,
  canAskAgain,
  isLoading,
  songCount,
  error,
  onGrantPermission,
}: MusicLibraryStatusProps) {
  const { theme } = useAppTheme();

  const openSettings = async () => {
    await Linking.openSettings();
  };

  if (permissionStatus === "unknown") {
    return null;
  }

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <ActivityIndicator size="large" color={theme.accent} />
        <Text
          style={[
            styles.description,
            { color: theme.textSecondary, marginTop: 16, marginBottom: 0 },
          ]}
        >
          Scanning your music library...
        </Text>
      </View>
    );
  }

  if (permissionStatus === "denied") {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.background },
          ]}
        >
          <Ionicons
            name="musical-notes-outline"
            size={30}
            color={theme.accent}
          />
        </View>

        <Text style={[styles.title, { color: theme.text }]}>
          Access Your Music
        </Text>

        <Text style={[styles.description, { color: theme.textSecondary }]}>
          Beats needs permission to access audio files stored on your device
          so it can display your local music.
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.accent }]}
          onPress={canAskAgain ? onGrantPermission : openSettings}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {canAskAgain ? "Grant Audio Permission" : "Open Settings"}
          </Text>
        </TouchableOpacity>

        {!canAskAgain && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onGrantPermission}
          >
            <Text
              style={[
                styles.secondaryButtonText,
                { color: theme.accent },
              ]}
            >
              Try Again
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (permissionStatus === "granted" && songCount === 0) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.background },
          ]}
        >
          <Ionicons
            name="folder-open-outline"
            size={30}
            color={theme.accent}
          />
        </View>

        <Text style={[styles.title, { color: theme.text }]}>
          No Music Found
        </Text>

        <Text style={[styles.description, { color: theme.textSecondary }]}>
          Your music library is empty. Add some audio files to your device
          and scan again.
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.accent }]}
          onPress={onGrantPermission}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Scan Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          Something Went Wrong
        </Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {error}
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.accent }]}
          onPress={onGrantPermission}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    marginVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 12,
    minWidth: 190,
    alignItems: "center",
  },
  buttonText: {
    color: "#14292A",
    fontSize: 14,
    fontWeight: "700",
  },
  secondaryButton: {
    marginTop: 12,
    padding: 10,
  },
  secondaryButtonText: {
    fontWeight: "600",
    fontSize: 14,
  },
});
