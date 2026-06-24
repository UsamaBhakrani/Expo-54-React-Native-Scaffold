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

type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
};

const STORAGE_KEY = "expenses_v1";
const PAYABLES_KEY = "payables_v1";

export default function ExpensesModule() {
  const [list, setList] = useState<Expense[]>([]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [payables, setPayables] = useState<Expense[]>([]);
  const [pdesc, setPDesc] = useState("");
  const [pamount, setPAmount] = useState("");

  useEffect(() => {
    (async () => setList(await loadList<Expense>(STORAGE_KEY)))();
    (async () => setPayables(await loadList<Expense>(PAYABLES_KEY)))();
  }, []);

  const add = async () => {
    const value = parseFloat(amount) || 0;
    const item: Expense = {
      id: String(Date.now()),
      description: desc,
      amount: value,
      date: new Date().toISOString(),
    };
    const next = [item, ...list];
    setList(next);
    setDesc("");
    setAmount("");
    await saveList(STORAGE_KEY, next);
  };

  const addPayable = async () => {
    const value = parseFloat(pamount) || 0;
    const item: Expense = {
      id: String(Date.now()),
      description: pdesc,
      amount: value,
      date: new Date().toISOString(),
    };
    const next = [item, ...payables];
    setPayables(next);
    setPDesc("");
    setPAmount("");
    await saveList(PAYABLES_KEY, next);
  };

  const markPayablePaid = async (id: string) => {
    const pay = payables.find((p) => p.id === id);
    if (!pay) return;
    const remaining = payables.filter((p) => p.id !== id);
    const nextExpenses = [
      { ...pay, id: String(Date.now()), date: new Date().toISOString() },
      ...list,
    ];
    setPayables(remaining);
    setList(nextExpenses);
    await saveList(PAYABLES_KEY, remaining);
    await saveList(STORAGE_KEY, nextExpenses);
  };

  const max = Math.max(1, ...list.map((l) => l.amount));

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Expenses</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Description"
          value={desc}
          onChangeText={setDesc}
          style={styles.input}
        />
        <TextInput
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button title="Add Expense" onPress={add} />
      </View>

      <View style={styles.chart}>
        {list.slice(0, 6).map((it) => (
          <View key={it.id} style={styles.row}>
            <Text style={styles.label}>{it.description || "—"}</Text>
            <View style={styles.barWrap}>
              <View
                style={[styles.bar, { width: `${(it.amount / max) * 100}%` }]}
              />
            </View>
            <Text style={styles.amount}>${it.amount.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={list}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.description}</Text>
            <Text style={styles.itemText}>${item.amount.toFixed(2)}</Text>
          </View>
        )}
      />

      <View style={{ marginTop: 16 }}>
        <Text style={[styles.heading, { marginTop: 8 }]}>Payables (Owed)</Text>
        <View style={styles.form}>
          <TextInput
            placeholder="Description"
            value={pdesc}
            onChangeText={setPDesc}
            style={styles.input}
          />
          <TextInput
            placeholder="Amount"
            value={pamount}
            onChangeText={setPAmount}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button title="Add Payable" onPress={addPayable} />
        </View>

        <FlatList
          data={payables}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.description}</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Text style={styles.itemText}>${item.amount.toFixed(2)}</Text>
                <Button
                  title="Mark Paid"
                  onPress={() => markPayablePaid(item.id)}
                />
              </View>
            </View>
          )}
        />
      </View>
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
  bar: { height: 12, backgroundColor: "#2563eb", borderRadius: 6 },
  amount: { width: 80, textAlign: "right" },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemText: { fontSize: 16 },
});
