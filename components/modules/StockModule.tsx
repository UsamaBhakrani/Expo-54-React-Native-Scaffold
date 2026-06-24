import { loadList, saveList } from "@/utils/storage";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Stock = { id: string; sku: string; qty: number; date: string };

const STORAGE_KEY = "stock_v1";

export default function StockModule() {
  const [list, setList] = useState<Stock[]>([]);
  const [sku, setSku] = useState("");
  const [qty, setQty] = useState("");

  useEffect(() => {
    (async () => setList(await loadList<Stock>(STORAGE_KEY)))();
  }, []);

  const add = async () => {
    const value = parseInt(qty, 10) || 0;
    const item: Stock = {
      id: String(Date.now()),
      sku,
      qty: value,
      date: new Date().toISOString(),
    };
    const next = [item, ...list];
    setList(next);
    setSku("");
    setQty("");
    await saveList(STORAGE_KEY, next);
  };

  const max = Math.max(1, ...list.map((l) => l.qty));

  const totals = list.reduce<Record<string, number>>((acc, it) => {
    acc[it.sku] = (acc[it.sku] || 0) + (it.qty || 0);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Stock Received</Text>
      <View style={{ marginBottom: 8 }}>
        <Text style={{ fontWeight: "700" }}>Current Stock</Text>
        {Object.keys(totals).length === 0 && (
          <Text style={{ color: "#666" }}>No stock recorded</Text>
        )}
        {Object.entries(totals).map(([k, v]) => (
          <Text key={k}>
            {k}: {v}
          </Text>
        ))}
      </View>
      <View style={styles.form}>
        <TextInput
          placeholder="SKU"
          value={sku}
          onChangeText={setSku}
          style={styles.input}
        />
        <TextInput
          placeholder="Quantity"
          value={qty}
          onChangeText={setQty}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button title="Add Stock" onPress={add} />
      </View>

      <View style={styles.chart}>
        {list.slice(0, 6).map((it) => (
          <View key={it.id} style={styles.row}>
            <Text style={styles.label}>{it.sku || "—"}</Text>
            <View style={styles.barWrap}>
              <View
                style={[styles.bar, { width: `${(it.qty / max) * 100}%` }]}
              />
            </View>
            <Text style={styles.amount}>{it.qty}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={list}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.sku}</Text>
            <Text style={styles.itemText}>{item.qty}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  form: { marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    marginBottom: 8,
    borderRadius: 6,
  },
  chart: { paddingVertical: 8 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  label: { flex: 1 },
  barWrap: {
    flex: 3,
    backgroundColor: "#f3f3f3",
    height: 12,
    marginHorizontal: 8,
    borderRadius: 6,
  },
  bar: { height: 12, backgroundColor: "#f97316", borderRadius: 6 },
  amount: { width: 60, textAlign: "right" },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemText: { fontSize: 16 },
});
