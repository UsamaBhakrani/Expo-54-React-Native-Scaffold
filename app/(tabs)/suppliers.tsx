import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SeedButton } from "@/db/seed-data";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TabAnimatedView from "@/components/ui/tab-animated-view";
import { useTabDirection } from "@/components/ui/tab-direction";
import { evolu } from "@/db/evolu-provider";

import * as Evolu from "@evolu/common";
import { useQuery } from "@evolu/react";

const allSuppliers = evolu.createQuery((db) =>
  db
    .selectFrom("supplier")
    .selectAll()
    .where("isDeleted", "is not", Evolu.sqliteTrue),
);

type SupplierRow = {
  id: string;
  companyName: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
};

export default function SuppliersScreen() {
  const isFocused = useIsFocused();
  const { setIndex } = useTabDirection();
  const router = useRouter();
  const supplierList = useQuery(allSuppliers);

  useEffect(() => {
    if (isFocused) setIndex(2);
  }, [isFocused, setIndex]);

  const openLedger = (supplier: SupplierRow) => {
    router.push(`/supplier-ledger?id=${supplier.id}` as any);
  };

  const renderSupplier = ({ item }: { item: SupplierRow }) => (
    <Pressable
      style={({ pressed }) => [
        styles.supplierCard,
        pressed && styles.supplierCardPressed,
      ]}
      onPress={() => openLedger(item)}
    >
      <View style={styles.supplierAvatar}>
        <Ionicons name="business-outline" size={22} color="#0f766e" />
      </View>
      <View style={styles.supplierInfo}>
        <Text style={styles.supplierName}>{item.companyName}</Text>
        {item.contactName ? (
          <Text style={styles.supplierDetail}>{item.contactName}</Text>
        ) : null}
        {item.email || item.phone ? (
          <Text style={styles.supplierSubDetail}>
            {[item.email, item.phone].filter(Boolean).join(" · ")}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
    </Pressable>
  );

  const renderEmpty = () => { return (
      <View style={styles.emptyState}>
        <Ionicons name="briefcase-outline" size={48} color="#94a3b8" />
        <ThemedText style={styles.emptyTitle}>No suppliers yet</ThemedText>
        <ThemedText style={styles.emptyText}>
          Tap the + button on the home screen to add your first supplier.
        </ThemedText>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TabAnimatedView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ThemedText type="title">Suppliers</ThemedText>
          <ThemedText style={styles.description}>
            Tap a supplier to open their ledger with transaction history.
          </ThemedText>

          <SeedButton />
          <FlatList
            data={supplierList as unknown as SupplierRow[]}
            keyExtractor={(item: any) => item.id}
            renderItem={renderSupplier}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </ThemedView>
      </TabAnimatedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16, gap: 12 },
  description: { fontSize: 15, lineHeight: 21, color: "#64748b", marginBottom: 4 },
  listContent: { flexGrow: 1, gap: 10, paddingBottom: 24 },
  supplierCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  supplierCardPressed: { opacity: 0.7, backgroundColor: "#f1f5f9" },
  supplierAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
  },
  supplierInfo: { flex: 1, gap: 2 },
  supplierName: { fontSize: 16, fontWeight: "600", color: "#0f172a" },
  supplierDetail: { fontSize: 13, color: "#475569" },
  supplierSubDetail: { fontSize: 12, color: "#94a3b8", marginTop: 1 },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 60 },
  emptyTitle: { fontSize: 17, fontWeight: "600", color: "#64748b", marginTop: 8 },
  emptyText: { fontSize: 14, color: "#94a3b8", textAlign: "center", paddingHorizontal: 40 },
});
