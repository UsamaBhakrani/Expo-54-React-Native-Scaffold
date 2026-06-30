import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TabAnimatedView from "@/components/ui/tab-animated-view";
import { useTabDirection } from "@/components/ui/tab-direction";
import { getAllProducts, type Product } from "@/db/index";

export default function ProductsScreen() {
  const isFocused = useIsFocused();
  const { setIndex } = useTabDirection();
  const [productList, setProductList] = useState<Product[]>([]);

  const loadData = useCallback(() => {
    getAllProducts().then(setProductList);
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused, loadData]);

  useEffect(() => {
    if (isFocused) setIndex(5);
  }, [isFocused, setIndex]);

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.productAvatar}>
        <Ionicons name="cube-outline" size={22} color="#f97316" />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        {item.sku ? (
          <Text style={styles.productDetail}>SKU: {item.sku}</Text>
        ) : null}
      </View>
      <View style={styles.productMeta}>
        {item.price ? (
          <Text style={styles.productPrice}>
            ${item.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </Text>
        ) : null}
        {item.stock !== null && item.stock !== undefined ? (
          <Text
            style={[
              styles.stockBadge,
              item.stock > 0 ? styles.stockIn : styles.stockOut,
            ]}
          >
            {item.stock} units
          </Text>
        ) : null}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Ionicons name="cube-outline" size={48} color="#94a3b8" />
      <ThemedText style={styles.emptyTitle}>No products yet</ThemedText>
      <ThemedText style={styles.emptyText}>
        Tap the + button on the home screen to add your first product.
      </ThemedText>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TabAnimatedView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ThemedText type="title">Products</ThemedText>

          <FlatList
            data={productList}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderProduct}
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
  productCard: {
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
  productAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: { flex: 1, gap: 2 },
  productName: { fontSize: 16, fontWeight: "600", color: "#0f172a" },
  productDetail: { fontSize: 12, color: "#64748b", marginTop: 1 },
  productMeta: { alignItems: "flex-end", gap: 4 },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  stockBadge: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  stockIn: { backgroundColor: "#f0fdf4", color: "#16a34a" },
  stockOut: { backgroundColor: "#fef2f2", color: "#dc2626" },
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
