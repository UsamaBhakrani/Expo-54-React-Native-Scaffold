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
      <View style={[styles.header, { paddingTop: insets.top + uberSpacing.md }]}>
        <Pressable onPress={onClose} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.headerSpacer} />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedId;
          return (
            <Pressable
              style={({ pressed }) => [styles.item, pressed && styles.itemPressed, isSelected && styles.itemSelected]}
              onPress={() => onSelect(item)}
            >
              <View style={styles.itemContent}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                {item.subtitle ? <Text style={styles.itemSubtitle}>{item.subtitle}</Text> : null}
              </View>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </Pressable>
          );
        }}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>{emptyText}</Text></View>}
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
  cancelButton: { minWidth: 60 },
  cancelText: {
    fontSize: uberTypography.bodyMd.fontSize, color: uberColors.ink, fontWeight: "500",
    fontFamily: uberTypography.bodyMd.fontFamily,
  },
  title: {
    fontSize: uberTypography.bodyMdStrong.fontSize,
    fontWeight: uberTypography.bodyMdStrong.fontWeight,
    color: uberColors.ink, textAlign: "center", flex: 1,
    fontFamily: uberTypography.bodyMdStrong.fontFamily,
  },
  headerSpacer: { minWidth: 60 },
  list: { padding: uberSpacing.lg, gap: uberSpacing.sm },
  item: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    padding: uberSpacing.lg, backgroundColor: uberColors.canvasSoft,
    borderRadius: uberRounded.lg, marginBottom: uberSpacing.sm,
  },
  itemPressed: { opacity: 0.7 },
  itemSelected: {
    backgroundColor: uberColors.primary,
  },
  itemContent: { flex: 1, gap: 2 },
  itemLabel: {
    fontSize: uberTypography.bodyMd.fontSize, color: uberColors.ink,
    fontWeight: "500", fontFamily: uberTypography.bodyMd.fontFamily,
  },
  itemSubtitle: {
    fontSize: uberTypography.bodySm.fontSize, color: uberColors.body,
    fontFamily: uberTypography.bodySm.fontFamily, marginTop: 2,
  },
  checkmark: { fontSize: 18, color: uberColors.onPrimary, fontWeight: "700", marginLeft: uberSpacing.md },
  empty: { paddingVertical: 60, alignItems: "center" },
  emptyText: { fontSize: uberTypography.bodySm.fontSize, color: uberColors.mute, fontFamily: uberTypography.bodySm.fontFamily },
});
