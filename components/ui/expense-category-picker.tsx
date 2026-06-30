import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { EXPENSE_CATEGORIES, type ExpenseCategory, getCategoryPath, parseCategoryPath } from "@/constants/expense-categories";
import { uberColors, uberRounded, uberSpacing, uberTypography } from "@/constants/theme";

type ExpenseCategoryPickerProps = {
  value: string; // full path like "Utilities / Electricity"
  onChange: (value: string) => void;
};

export function ExpenseCategoryPicker({ value, onChange }: ExpenseCategoryPickerProps) {
  const parsed = parseCategoryPath(value || "");
  const [selectedCategory, setSelectedCategory] = useState(parsed.category || "");
  const [selectedSubcategory, setSelectedSubcategory] = useState(parsed.subcategory || "");

  const handleCategorySelect = (cat: ExpenseCategory) => {
    setSelectedCategory(cat.category);
    setSelectedSubcategory("");
    if (cat.subcategories.length === 0) {
      onChange(getCategoryPath(cat.category));
    } else {
      onChange(getCategoryPath(cat.category, ""));
    }
  };

  const handleSubcategorySelect = (sub: string) => {
    setSelectedSubcategory(sub);
    onChange(getCategoryPath(selectedCategory, sub));
  };

  const currentCategory = EXPENSE_CATEGORIES.find((c) => c.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* Main categories */}
      <View style={styles.chips}>
        {EXPENSE_CATEGORIES.map((cat) => (
          <Pressable
            key={cat.category}
            style={[styles.chip, selectedCategory === cat.category && styles.chipActive]}
            onPress={() => handleCategorySelect(cat)}
          >
            <Text style={[styles.chipText, selectedCategory === cat.category && styles.chipTextActive]}>
              {cat.category}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Subcategories (shown only when a category with subcategories is selected) */}
      {currentCategory && currentCategory.subcategories.length > 0 && (
        <View style={styles.subRow}>
          <Text style={styles.subLabel}>Sub-category</Text>
          <View style={styles.chips}>
            {currentCategory.subcategories.map((sub) => (
              <Pressable
                key={sub}
                style={[styles.subChip, selectedSubcategory === sub && styles.subChipActive]}
                onPress={() => handleSubcategorySelect(sub)}
              >
                <Text style={[styles.subChipText, selectedSubcategory === sub && styles.subChipTextActive]}>
                  {sub}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Value display */}
      {value ? (
        <View style={styles.valueDisplay}>
          <Text style={styles.valueLabel}>Selected: </Text>
          <Text style={styles.valueText}>{value}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: uberSpacing.md,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: uberSpacing.sm,
  },
  chip: {
    paddingHorizontal: uberSpacing.lg,
    paddingVertical: uberSpacing.sm,
    borderRadius: uberRounded.pill,
    backgroundColor: uberColors.canvasSoft,
    borderWidth: 1,
    borderColor: uberColors.canvasSoft,
  },
  chipActive: {
    backgroundColor: uberColors.primary,
    borderColor: uberColors.primary,
  },
  chipText: {
    fontSize: uberTypography.bodySm.fontSize,
    color: uberColors.ink,
    fontWeight: "500",
    fontFamily: uberTypography.bodySm.fontFamily,
  },
  chipTextActive: {
    color: uberColors.onPrimary,
  },
  subRow: {
    gap: uberSpacing.sm,
    paddingLeft: uberSpacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: uberColors.canvasSoft,
  },
  subLabel: {
    fontSize: uberTypography.caption.fontSize,
    color: uberColors.body,
    fontWeight: "600",
    fontFamily: uberTypography.caption.fontFamily,
  },
  subChip: {
    paddingHorizontal: uberSpacing.lg,
    paddingVertical: uberSpacing.sm,
    borderRadius: uberRounded.pill,
    backgroundColor: uberColors.canvasSoft,
    borderWidth: 1,
    borderColor: uberColors.canvasSoft,
  },
  subChipActive: {
    backgroundColor: uberColors.primary,
    borderColor: uberColors.primary,
  },
  subChipText: {
    fontSize: uberTypography.caption.fontSize,
    color: uberColors.body,
    fontWeight: "500",
    fontFamily: uberTypography.caption.fontFamily,
  },
  subChipTextActive: {
    color: uberColors.onPrimary,
  },
  valueDisplay: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: uberSpacing.sm,
    paddingHorizontal: uberSpacing.md,
    backgroundColor: uberColors.canvasSoft,
    borderRadius: uberRounded.md,
  },
  valueLabel: {
    fontSize: uberTypography.caption.fontSize,
    color: uberColors.body,
    fontFamily: uberTypography.caption.fontFamily,
  },
  valueText: {
    fontSize: uberTypography.bodySm.fontSize,
    color: uberColors.ink,
    fontWeight: "600",
    fontFamily: uberTypography.bodySm.fontFamily,
  },
});
