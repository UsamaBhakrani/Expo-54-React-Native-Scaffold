import { loadList } from "@/utils/storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CashflowModule() {
  const [expenses, setExpenses] = useState<{ amount: number }[]>([]);
  const [payments, setPayments] = useState<{ amount: number }[]>([]);

  useEffect(() => {
    (async () => {
      const e = await loadList<any>("expenses_v1");
      const p = await loadList<any>("payments_v1");
      setExpenses(e || []);
      setPayments(p || []);
    })();
  }, []);

  const totalExpenses = expenses.reduce((s, i) => s + (i.amount || 0), 0);
  const totalPayments = payments.reduce((s, i) => s + (i.amount || 0), 0);
  const net = totalPayments - totalExpenses;

  // simple visualization: two bars for payments vs expenses
  const max = Math.max(1, totalExpenses, totalPayments);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Cashflow</Text>
      <View style={styles.summaryRow}>
        <Text>Payments</Text>
        <Text style={styles.amount}>${totalPayments.toFixed(2)}</Text>
      </View>
      <View style={styles.barWrap}>
        <View
          style={[
            styles.barPayments,
            { width: `${(totalPayments / max) * 100}%` },
          ]}
        />
      </View>

      <View style={styles.summaryRow}>
        <Text>Expenses</Text>
        <Text style={styles.amount}>${totalExpenses.toFixed(2)}</Text>
      </View>
      <View style={styles.barWrap}>
        <View
          style={[
            styles.barExpenses,
            { width: `${(totalExpenses / max) * 100}%` },
          ]}
        />
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: "700" }}>Net: ${net.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  amount: { fontWeight: "700" },
  barWrap: {
    height: 12,
    backgroundColor: "#f3f3f3",
    borderRadius: 6,
    marginTop: 6,
    marginBottom: 6,
  },
  barPayments: { height: 12, backgroundColor: "#10b981", borderRadius: 6 },
  barExpenses: { height: 12, backgroundColor: "#ef4444", borderRadius: 6 },
});
