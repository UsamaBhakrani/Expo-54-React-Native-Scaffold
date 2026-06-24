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

type Payment = {
  id: string;
  description: string;
  amount: number;
  date: string;
};

const STORAGE_KEY = "payments_v1";
const PENDING_KEY = "pending_v1";

export default function PaymentsModule() {
  const [list, setList] = useState<Payment[]>([]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [pending, setPending] = useState<Payment[]>([]);
  const [pdesc, setPDesc] = useState("");
  const [pamount, setPAmount] = useState("");

  useEffect(() => {
    (async () => setList(await loadList<Payment>(STORAGE_KEY)))();
    (async () => setPending(await loadList<Payment>(PENDING_KEY)))();
  }, []);

  const add = async () => {
    const value = parseFloat(amount) || 0;
    const item: Payment = {
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

  const addPending = async () => {
    const value = parseFloat(pamount) || 0;
    const item: Payment = {
      id: String(Date.now()),
      description: pdesc,
      amount: value,
      date: new Date().toISOString(),
    };
    const next = [item, ...pending];
    setPending(next);
    setPDesc("");
    setPAmount("");
    await saveList(PENDING_KEY, next);
  };

  const markReceived = async (id: string) => {
    const found = pending.find((p) => p.id === id);
    if (!found) return;
    const remaining = pending.filter((p) => p.id !== id);
    const nextPayments = [
      { ...found, id: String(Date.now()), date: new Date().toISOString() },
      ...list,
    ];
    setPending(remaining);
    setList(nextPayments);
    await saveList(PENDING_KEY, remaining);
    await saveList(STORAGE_KEY, nextPayments);
  };

  const max = Math.max(1, ...list.map((l) => l.amount));

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Payments Received</Text>
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
        <Button title="Add Payment" onPress={add} />
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
        <Text style={[styles.heading, { marginTop: 8 }]}>Pending Payments</Text>
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
          <Button title="Add Pending" onPress={addPending} />
        </View>

        <FlatList
          data={pending}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.description}</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Text style={styles.itemText}>${item.amount.toFixed(2)}</Text>
                <Button
                  title="Mark Received"
                  onPress={() => markReceived(item.id)}
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
  bar: { height: 12, backgroundColor: "#10b981", borderRadius: 6 },
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
