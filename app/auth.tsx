import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { runMigrations } from "@/db/config";

const DEFAULT_USERNAME = "user@example.com";
const DEFAULT_PASSWORD = "Password123";

export default function AuthScreen() {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [confirmPassword, setConfirmPassword] = useState(DEFAULT_PASSWORD);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAuth = () => {
    setError("");

    if (isSignup) {
      if (!username || !password || !confirmPassword) {
        setError("Please complete all fields.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      router.replace("/");
      return;
    }

    if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
      router.replace("/");
      return;
    }

    setError("Invalid login credentials. Use the default values shown below.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.safeArea}
      >
        <ThemedView style={styles.screen}>
          <ThemedText type="title" style={styles.title}>
            {isSignup ? "Create an account" : "Login"}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {isSignup
              ? "Sign up to access the app."
              : "Use the default username and password to sign in for testing."}
          </ThemedText>
          {!isSignup && (
            <ThemedView style={styles.defaultCredentials}>
              <ThemedText type="defaultSemiBold">Default login:</ThemedText>
              <ThemedText>Username: {DEFAULT_USERNAME}</ThemedText>
              <ThemedText>Password: {DEFAULT_PASSWORD}</ThemedText>
            </ThemedView>
          )}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Email"
              placeholderTextColor="#888"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
            />
            {isSignup && (
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                placeholderTextColor="#888"
                secureTextEntry
              />
            )}
            {error ? (
              <ThemedText style={styles.error}>{error}</ThemedText>
            ) : null}
          </View>
          <Pressable
            onPress={handleAuth}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              {isSignup ? "Sign Up" : "Login"}
            </ThemedText>
          </Pressable>
          <Pressable onPress={() => setIsSignup((prev) => !prev)}>
            <ThemedText type="link" style={styles.toggleText}>
              {isSignup
                ? "Already have an account? Login"
                : "Don’t have an account? Sign up"}
            </ThemedText>
          </Pressable>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  content: {
    gap: 20,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultCredentials: {
    gap: 6,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(37,99,235,0.08)",
  },
  form: {
    gap: 14,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  error: {
    color: "#dc2626",
    marginTop: 4,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: "#2563eb",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  toggleText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
  },
});
