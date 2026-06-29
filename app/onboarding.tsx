import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const steps = [
  {
    icon: "wallet-outline",
    color: "#2563eb",
    bgColor: "#eff6ff",
    title: "Welcome to MyApp",
    description:
      "Your personal accounting companion. Manage ledgers, track suppliers, and stay on top of your finances.",
  },
  {
    icon: "book-outline",
    color: "#7c3aed",
    bgColor: "#f5f3ff",
    title: "Organize Your Ledger",
    description:
      "Keep your financial entries tidy and easy to review with a clean, intuitive ledger experience.",
  },
  {
    icon: "people-outline",
    color: "#0f766e",
    bgColor: "#f0fdf4",
    title: "Manage Everything",
    description:
      "Track supplier relationships, create invoices, record expenses, and manage products — all in one place.",
  },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const isLastStep = step === steps.length - 1;

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateTo = useCallback(
    (direction: 1 | -1) => {
      // Fade out and slide current
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: direction * -30,
          duration: 120,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setStep((current) => current + direction);
        slideAnim.setValue(direction * 30);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 180,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      });
    },
    [fadeAnim, slideAnim],
  );

  const handleNext = () => {
    if (isLastStep) {
      router.replace("/auth");
      return;
    }
    animateTo(1);
  };

  const handleSkip = () => {
    router.replace("/auth");
  };

  const current = steps[step];

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip button */}
      {!isLastStep && (
        <Pressable onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      )}

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: current.bgColor }]}>
          <Ionicons name={current.icon as any} size={48} color={current.color} />
        </View>

        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.description}>{current.description}</Text>
      </Animated.View>

      {/* Bottom section */}
      <View style={styles.bottom}>
        {/* Dot indicators */}
        <View style={styles.indicatorRow}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === step
                  ? [styles.indicatorActive, { backgroundColor: current.color }]
                  : styles.indicatorInactive,
              ]}
            />
          ))}
        </View>

        {/* Next / Get Started button */}
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: current.color },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>
            {isLastStep ? "Get Started" : "Next"}
          </Text>
          <Ionicons
            name={isLastStep ? "checkmark-circle" : "arrow-forward"}
            size={20}
            color="#fff"
            style={styles.buttonIcon}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  skipButton: {
    position: "absolute",
    top: 16,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 15,
    color: "#94a3b8",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
    gap: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    lineHeight: 38,
  },
  description: {
    fontSize: 17,
    lineHeight: 26,
    color: "#475569",
    textAlign: "center",
    paddingHorizontal: 8,
  },
  bottom: {
    paddingHorizontal: 28,
    paddingBottom: 40,
    gap: 28,
    alignItems: "center",
  },
  indicatorRow: {
    flexDirection: "row",
    gap: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  indicatorActive: {
    width: 28,
    borderRadius: 5,
  },
  indicatorInactive: {
    backgroundColor: "#cbd5e1",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  buttonIcon: {
    marginTop: 1,
  },
});
