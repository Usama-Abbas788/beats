
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

import CategoryChip from "../../molecules/CategoryChip/CategoryChip";

type CategorySelectorProps = {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
};

export default function CategorySelector({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategorySelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <CategoryChip
          key={category}
          label={category}
          isSelected={selectedCategory === category}
          onPress={() => onCategoryChange(category)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
    paddingTop: 6,
    paddingBottom: 10,
  },
});
