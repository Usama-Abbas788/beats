import React, { useEffect, useState } from "react";
import {
  Animated,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
} from "react-native";

type SpinningArtworkProps = {
  source: ImageSourcePropType;
  size: number;
  isSpinning: boolean;
  style?: StyleProp<ImageStyle>;
};

export default function SpinningArtwork({
  source,
  size,
  isSpinning,
  style,
}: SpinningArtworkProps) {
  const [rotation] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!isSpinning) {
      rotation.stopAnimation();
      rotation.setValue(0);
      return;
    }

    const spin = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    );

    spin.start();

    return () => spin.stop();
  }, [isSpinning, rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.Image
      source={source}
      resizeMode="cover"
      style={[
        styles.image,
        {
          width: size,
          height: size,
          transform: [{ rotate }],
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 999,
  },
});
