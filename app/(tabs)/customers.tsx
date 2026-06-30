import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TabAnimatedView from "@/components/ui/tab-animated-view";
import { useTabDirection } from "@/components/ui/tab-direction";
import { getAllCustomers, type Customer } from "@/db/index";

export default function CustomersScreen() {
  const isFocused = useIsFocused();
  const { setIndex } = useTabDirection();
  const [customerList, setCustomerList] = useState<Customer[]>([]);

  const loadData = useCallback(() => {
    getAllCustomers().then(setCustomerList);
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused, loadData]);

  useEffect(() => {
    if (isFocused) setIndex(4);
  }, [isFocused, setIndex]);

  const renderCustomer = ({ item }: { item: Customer }) => (
    <View style={styles.customerCard}>
      <View style={styles.customerAvatar}>
        <Ionicons name="people-outline" size={22} color="#7c3aed" />
      </View>
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.name}</Text>
        {item.email ? (
          <Text style={styles.customerDetail}>{item.email}</Text>
        ) : null}
        {item.phone ? (
          <Text style={styles.customerSubDetail}>{item.phone}</Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Ionicons name="people-outline" size={48} color="#94a3b8" />
      <ThemedText style={styles.emptyTitle}>No customers yet</ThemedText>
      <ThemedText style={styles.emptyText}>
        Tap the + button on the home screen to add your first customer.
      </ThemedText>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TabAnimatedView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ThemedText type="title">Customers</ThemedText>

          <FlatList
            data={customerList}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderCustomer}
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
  listContent: { flexGrow: 1, gap: 10, paddingBottom: 24 },
  customerCard: {
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
  customerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f5f3ff",
    alignItems: "center",
    justifyContent: "center",
  },
  customerInfo: { flex: 1, gap: 2 },
  customerName: { fontSize: 16, fontWeight: "600", color: "#0f172a" },
  customerDetail: { fontSize: 13, color: "#475569" },
  customerSubDetail: { fontSize: 12, color: "#94a3b8", marginTop: 1 },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
