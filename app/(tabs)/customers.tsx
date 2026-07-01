import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TabAnimatedView from "@/components/ui/tab-animated-view";
import { useTabDirection } from "@/components/ui/tab-direction";
import { SkeletonCard } from "@/components/ui/uber-skeleton";
import { getAllCustomers, type Customer } from "@/db/index";
import { uberColors, uberRounded, uberSpacing, uberTypography } from "@/constants/theme";
import { UberEmptyState } from "@/components/ui/uber-empty-state";

export default function CustomersScreen() {
  const isFocused = useIsFocused();
  const { setIndex } = useTabDirection();
  const router = useRouter();
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
    getAllCustomers().then((data) => {
      setCustomerList(data);
      setLoading(false);
    });
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
    <Pressable
      style={({ pressed }) => [styles.customerCard, pressed && styles.customerCardPressed]}
      onPress={() => router.push(`/customer-ledger?id=${item.id}` as any)}
    >
      <View style={styles.customerIcon}>
        <Ionicons name="people-outline" size={20} color={uberColors.ink} />
      </View>
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.name}</Text>
        {item.email ? (
          <Text style={styles.customerDetail}>{item.email}</Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={16} color={uberColors.mute} />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TabAnimatedView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ThemedText type="displayLg">Customers</ThemedText>

          {loading ? (
            <SkeletonCard variant="list" />
          ) : (
            <FlatList
              data={customerList}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderCustomer}
              ListEmptyComponent={
                <UberEmptyState
                  icon="people-outline"
                  title="No customers yet"
                  description="Tap the + button on the home screen to add your first customer."
                />
              }
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </ThemedView>
      </TabAnimatedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: uberSpacing.lg, gap: uberSpacing.md },
  listContent: { flexGrow: 1, gap: uberSpacing.sm, paddingBottom: 24 },
  customerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: uberColors.canvasSoft,
    borderRadius: uberRounded.lg,
    padding: uberSpacing.lg,
    gap: uberSpacing.md,
  },
  customerCardPressed: { opacity: 0.7 },
  customerIcon: {
    width: 40,
    height: 40,
    borderRadius: uberRounded.full,
    backgroundColor: uberColors.canvas,
    alignItems: "center",
    justifyContent: "center",
  },
  customerInfo: { flex: 1, gap: 2 },
  customerName: {
    fontSize: uberTypography.bodyMd.fontSize,
    fontWeight: "600",
    color: uberColors.ink,
    fontFamily: uberTypography.bodyMd.fontFamily,
  },
  customerDetail: {
    fontSize: uberTypography.bodySm.fontSize,
    color: uberColors.body,
    fontFamily: uberTypography.bodySm.fontFamily,
  },
});
