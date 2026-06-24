import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveList<T>(key: string, list: T[]) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(list));
  } catch (e) {
    console.warn("saveList error", e);
  }
}

export async function loadList<T>(key: string): Promise<T[]> {
  try {
    const s = await AsyncStorage.getItem(key);
    return s ? JSON.parse(s) : [];
  } catch (e) {
    console.warn("loadList error", e);
    return [];
  }
}
