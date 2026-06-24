import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

const steps = [
  {
    title: "Welcome to MyApp",
    description:
      "Start with a quick tour to learn how to manage your ledgers, suppliers, and expenses.",
  },
  {
    title: "Organize Your Ledger",
    description:
      "Keep your financial entries tidy and easy to review with a clean ledger experience.",
  },
  {
    title: "Manage Suppliers & Expenses",
    description:
      "Track supplier relationships and expenses in one place so you stay in control.",
  },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      router.replace("/auth");
      return;
    }

    setStep((current) => current + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedText type="title" style={styles.title}>
          {steps[step].title}
        </ThemedText>
        <ThemedText style={styles.description}>
          {steps[step].description}
        </ThemedText>
        <View style={styles.indicatorRow}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === step
                  ? styles.indicatorActive
                  : styles.indicatorInactive,
              ]}
            />
          ))}
        </View>
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            {isLastStep ? "Get Started" : "Next"}
          </ThemedText>
        </Pressable>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    borderRadius: 24,
    padding: 28,
    gap: 24,
    backgroundColor: "rgba(255,255,255,0.92)",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
  },
  description: {
    fontSize: 18,
    lineHeight: 28,
  },
  indicatorRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  indicatorActive: {
    backgroundColor: "#2563eb",
  },
  indicatorInactive: {
    backgroundColor: "#cbd5e1",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: "#2563eb",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});
