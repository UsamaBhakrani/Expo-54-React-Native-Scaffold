import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { uberColors, uberRounded, uberSpacing, uberTypography } from "@/constants/theme";

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
      if (!username || !password || !confirmPassword) { setError("Please complete all fields."); return; }
      if (password !== confirmPassword) { setError("Passwords do not match."); return; }
      router.replace("/");
      return;
    }
    if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) { router.replace("/"); return; }
    setError("Invalid login credentials. Use the default values shown below.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
        <ThemedView style={styles.screen}>
          <ThemedText type="displayLg" style={styles.title}>
            {isSignup ? "Create an account" : "Login"}
          </ThemedText>
          <ThemedText type="bodyMd" style={styles.subtitle}>
            {isSignup ? "Sign up to access the app." : "Use the default username and password to sign in for testing."}
          </ThemedText>
          {!isSignup && (
            <View style={styles.defaultCredentials}>
              <ThemedText type="bodyMdStrong">Default login:</ThemedText>
              <ThemedText type="bodySm">Username: {DEFAULT_USERNAME}</ThemedText>
              <ThemedText type="bodySm">Password: {DEFAULT_PASSWORD}</ThemedText>
            </View>
          )}
          <View style={styles.form}>
            <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Email" placeholderTextColor={uberColors.mute} autoCapitalize="none" keyboardType="email-address" />
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor={uberColors.mute} secureTextEntry />
            {isSignup && (
              <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm password" placeholderTextColor={uberColors.mute} secureTextEntry />
            )}
            {error ? <ThemedText type="bodySm" style={styles.error}>{error}</ThemedText> : null}
          </View>
          <Pressable
            onPress={handleAuth}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <ThemedText type="buttonMd" style={styles.buttonText}>
              {isSignup ? "Sign Up" : "Login"}
            </ThemedText>
          </Pressable>
          <Pressable onPress={() => setIsSignup((prev) => !prev)}>
            <ThemedText type="bodyMd" style={styles.toggleText}>
              {isSignup ? "Already have an account? Login" : "Don't have an account? Sign up"}
            </ThemedText>
          </Pressable>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  screen: { flex: 1, justifyContent: "center", padding: 24 },
  title: { marginBottom: uberSpacing.sm },
  subtitle: { marginBottom: uberSpacing.xl, color: uberColors.body },
  defaultCredentials: {
    gap: uberSpacing.xs, padding: uberSpacing.lg,
    borderRadius: uberRounded.xl, backgroundColor: uberColors.canvasSoft, marginBottom: uberSpacing.xl,
  },
  form: { gap: uberSpacing.md },
  input: {
    height: 52, backgroundColor: uberColors.canvasSoft, borderRadius: uberRounded.pill,
    paddingHorizontal: uberSpacing.lg, fontSize: uberTypography.bodyMd.fontSize,
    color: uberColors.ink, fontFamily: uberTypography.bodyMd.fontFamily,
  },
  error: { color: "#dc2626", marginTop: uberSpacing.xxs },
  button: {
    alignItems: "center", justifyContent: "center",
    paddingVertical: uberSpacing.lg, borderRadius: uberRounded.pill,
    backgroundColor: uberColors.primary, marginTop: uberSpacing.md,
  },
  buttonPressed: { opacity: 0.85 },
  buttonText: { color: uberColors.onPrimary },
  toggleText: { textAlign: "center", marginTop: uberSpacing.md, color: uberColors.body },
});
