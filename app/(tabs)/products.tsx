import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TabAnimatedView from "@/components/ui/tab-animated-view";
import { useTabDirection } from "@/components/ui/tab-direction";
import { SkeletonCard } from "@/components/ui/uber-skeleton";
import { getAllProducts, type Product } from "@/db/index";
import { uberColors, uberRounded, uberSpacing, uberTypography } from "@/constants/theme";
import { UberEmptyState } from "@/components/ui/uber-empty-state";

export default function ProductsScreen() {
  const isFocused = useIsFocused();
  const { setIndex } = useTabDirection();
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
    getAllProducts().then((data) => {
      setProductList(data);
      setLoading(false);
    });
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
      <View style={styles.productIcon}>
        <Ionicons name="cube-outline" size={20} color={uberColors.ink} />
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <TabAnimatedView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ThemedText type="displayLg">Products</ThemedText>

          {loading ? (
            <SkeletonCard variant="list" />
          ) : (
            <FlatList
              data={productList}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderProduct}
              ListEmptyComponent={
                <UberEmptyState
                  icon="cube-outline"
                  title="No products yet"
                  description="Tap the + button on the home screen to add your first product."
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
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: uberColors.canvasSoft,
    borderRadius: uberRounded.lg,
    padding: uberSpacing.lg,
    gap: uberSpacing.md,
  },
  productIcon: {
    width: 40,
    height: 40,
    borderRadius: uberRounded.full,
    backgroundColor: uberColors.canvas,
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: { flex: 1, gap: 2 },
  productName: {
    fontSize: uberTypography.bodyMd.fontSize,
    fontWeight: "600",
    color: uberColors.ink,
    fontFamily: uberTypography.bodyMd.fontFamily,
  },
  productDetail: {
    fontSize: uberTypography.caption.fontSize,
    color: uberColors.body,
    fontFamily: uberTypography.caption.fontFamily,
    marginTop: 1,
  },
  productMeta: { alignItems: "flex-end", gap: 2 },
  productPrice: {
    fontSize: uberTypography.bodyMdStrong.fontSize,
    fontWeight: "700",
    color: uberColors.ink,
    fontFamily: uberTypography.bodyMdStrong.fontFamily,
  },
  stockBadge: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: uberSpacing.sm,
    paddingVertical: 2,
    borderRadius: uberRounded.pill,
    overflow: "hidden",
    fontFamily: uberTypography.caption.fontFamily,
  },
  stockIn: { backgroundColor: uberColors.canvas, color: uberColors.ink },
  stockOut: { backgroundColor: uberColors.canvasSoft, color: uberColors.body },
});
