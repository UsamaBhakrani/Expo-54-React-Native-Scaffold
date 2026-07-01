import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { uberColors, uberRounded, uberSpacing, uberTypography } from "@/constants/theme";

export type PickerItem = { id: string; label: string; subtitle?: string };

type PickerModalProps = {
  visible: boolean;
  data: PickerItem[];
  selectedId: string | null;
  onSelect: (item: PickerItem) => void;
  onClose: () => void;
  title: string;
  emptyText?: string;
};

export default function PickerModal({
  visible, data, selectedId, onSelect, onClose, title, emptyText = "No items found.",
}: PickerModalProps) {
  if (!visible) return null;

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + uberSpacing.md }]}>
        <Pressable onPress={onClose} style={styles.cancelButton}>
          <Ionicons name="close" size={20} color={uberColors.ink} />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedId;
          return (
            <Pressable
              style={({ pressed }) => [
                styles.item,
                pressed && styles.itemPressed,
                isSelected && styles.itemSelected,
              ]}
              onPress={() => onSelect(item)}
            >
              <View style={styles.itemContent}>
                <Text style={[styles.itemLabel, isSelected && styles.itemLabelSelected]}>
                  {item.label}
                </Text>
                {item.subtitle ? (
                  <Text style={[styles.itemSubtitle, isSelected && styles.itemSubtitleSelected]}>
                    {item.subtitle}
                  </Text>
                ) : null}
              </View>
              {isSelected && (
                <View style={styles.checkmarkCircle}>
                  <Ionicons name="checkmark" size={16} color={uberColors.onPrimary} />
                </View>
              )}
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="cube-outline" size={40} color={uberColors.mute} />
            <Text style={styles.emptyText}>{emptyText}</Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: uberColors.canvas, zIndex: 100,
  },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: uberSpacing.xl, paddingBottom: uberSpacing.lg,
    borderBottomWidth: 1, borderBottomColor: uberColors.canvasSoft,
    backgroundColor: uberColors.canvas,
  },
  cancelButton: {
    width: 36, height: 36,
    borderRadius: uberRounded.full,
    backgroundColor: uberColors.canvasSoft,
    alignItems: "center", justifyContent: "center",
    minWidth: 36,
  },
  title: {
    fontSize: uberTypography.bodyMdStrong.fontSize,
    fontWeight: uberTypography.bodyMdStrong.fontWeight,
    color: uberColors.ink, textAlign: "center", flex: 1,
    fontFamily: uberTypography.bodyMdStrong.fontFamily,
  },
  headerSpacer: { width: 36 },
  list: {
    padding: uberSpacing.lg,
    paddingBottom: 40,
    gap: uberSpacing.sm,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: uberSpacing.lg,
    backgroundColor: uberColors.canvasSoft,
    borderRadius: uberRounded.lg,
  },
  itemPressed: { opacity: 0.7 },
  itemSelected: {
    backgroundColor: uberColors.primary,
  },
  itemContent: { flex: 1, gap: 2 },
  itemLabel: {
    fontSize: uberTypography.bodyMd.fontSize,
    color: uberColors.ink,
    fontWeight: "500",
    fontFamily: uberTypography.bodyMd.fontFamily,
  },
  itemLabelSelected: { color: uberColors.onPrimary },
  itemSubtitle: {
    fontSize: uberTypography.bodySm.fontSize,
    color: uberColors.body,
    fontFamily: uberTypography.bodySm.fontFamily,
    marginTop: 2,
  },
  itemSubtitleSelected: { color: uberColors.onPrimary, opacity: 0.8 },
  checkmarkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: uberSpacing.md,
  },
  empty: {
    paddingVertical: 80,
    alignItems: "center",
    gap: uberSpacing.sm,
  },
  emptyText: {
    fontSize: uberTypography.bodyMd.fontSize,
    color: uberColors.mute,
    fontFamily: uberTypography.bodyMd.fontFamily,
    textAlign: "center",
  },
});
