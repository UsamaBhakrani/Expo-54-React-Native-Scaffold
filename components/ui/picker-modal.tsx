import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export type PickerItem = {
  id: string;
  label: string;
  subtitle?: string;
};

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
  visible,
  data,
  selectedId,
  onSelect,
  onClose,
  title,
  emptyText = "No items found.",
}: PickerModalProps) {
  if (!visible) return null;

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
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
              style={({ pressed }) => [
                styles.item,
                pressed && styles.itemPressed,
                isSelected && styles.itemSelected,
              ]}
              onPress={() => onSelect(item)}
            >
              <View style={styles.itemContent}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                {item.subtitle ? (
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                ) : null}
              </View>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#f8fafc",
    zIndex: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  cancelButton: {
    minWidth: 60,
  },
  cancelText: {
    fontSize: 16,
    color: "#2563eb",
    fontWeight: "600",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    flex: 1,
  },
  headerSpacer: {
    minWidth: 60,
  },
  list: {
    padding: 16,
    gap: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  itemPressed: {
    opacity: 0.7,
  },
  itemSelected: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#22c55e",
  },
  itemContent: {
    flex: 1,
    gap: 2,
  },
  itemLabel: {
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "500",
  },
  itemSubtitle: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  checkmark: {
    fontSize: 18,
    color: "#22c55e",
    fontWeight: "700",
    marginLeft: 12,
  },
  empty: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#94a3b8",
  },
});
