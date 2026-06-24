import CashflowModule from "@/components/modules/CashflowModule";
import ExpensesModule from "@/components/modules/ExpensesModule";
import PaymentsModule from "@/components/modules/PaymentsModule";
import StockModule from "@/components/modules/StockModule";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const TABS = ["Expenses", "Cashflow", "Payments", "Stock"] as const;

export default function HomeTabs() {
  const [tab, setTab] = React.useState<number>(0);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        {TABS.map((t, i) => (
          <Pressable
            key={t}
            onPress={() => setTab(i)}
            style={[styles.tabButton, tab === i && styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, tab === i && styles.tabTextActive]}>
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.content}>
        {tab === 0 && <ExpensesModule />}
        {tab === 1 && <CashflowModule />}
        {tab === 2 && <PaymentsModule />}
        {tab === 3 && <StockModule />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", padding: 8, backgroundColor: "#f5f5f5" },
  tabButton: { flex: 1, padding: 12, alignItems: "center" },
  tabButtonActive: { borderBottomWidth: 3, borderBottomColor: "#2563eb" },
  tabText: { fontSize: 16, color: "#333" },
  tabTextActive: { color: "#2563eb", fontWeight: "600" },
  content: { flex: 1 },
});
