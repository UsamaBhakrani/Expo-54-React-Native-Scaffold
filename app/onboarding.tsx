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

import {
  uberColors,
  uberRounded,
  uberSpacing,
  uberTypography,
} from "@/constants/theme";

const { width } = Dimensions.get("window");

const steps = [
  {
    icon: "wallet-outline",
    color: uberColors.primary,
    bgColor: uberColors.canvas,
    title: "Welcome to Accounts",
    description:
      "Your personal accounting companion. Manage ledgers, track suppliers, and stay on top of your finances.",
  },
  {
    icon: "book-outline",
    color: uberColors.primary,
    bgColor: uberColors.canvas,
    title: "Organize your ledger",
    description:
      "Keep your financial entries tidy and easy to review with a clean, intuitive ledger experience.",
  },
  {
    icon: "people-outline",
    color: uberColors.primary,
    bgColor: uberColors.canvas,
    title: "Manage everything",
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

  const handleSkip = () => router.replace("/auth");

  const current = steps[step];

  return (
    <SafeAreaView style={styles.container}>
      {!isLastStep && (
        <Pressable onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      )}

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={current.icon as any}
            size={48}
            color={uberColors.primary}
          />
        </View>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.description}>{current.description}</Text>
      </Animated.View>

      <View style={styles.bottom}>
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
          <Text style={styles.buttonText}>
            {isLastStep ? "Get Started" : "Next"}
          </Text>
          <Ionicons
            name={isLastStep ? "checkmark-circle" : "arrow-forward"}
            size={20}
            color={uberColors.onPrimary}
            style={{ marginTop: 1 }}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: uberColors.canvas },
  skipButton: {
    position: "absolute",
    top: 16,
    right: 20,
    zIndex: 10,
    paddingHorizontal: uberSpacing.lg,
    paddingVertical: uberSpacing.sm,
  },
  skipText: {
    fontSize: uberTypography.bodyMd.fontSize,
    color: uberColors.body,
    fontWeight: "500",
    fontFamily: uberTypography.bodyMd.fontFamily,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
    gap: uberSpacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: uberColors.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: uberSpacing.sm,
  },
  title: {
    fontSize: uberTypography.displayXl.fontSize,
    fontWeight: uberTypography.displayXl.fontWeight,
    color: uberColors.ink,
    textAlign: "center",
    lineHeight: uberTypography.displayXl.lineHeight,
    fontFamily: uberTypography.displayXl.fontFamily,
  },
  description: {
    fontSize: uberTypography.bodyLg.fontSize,
    lineHeight: uberTypography.bodyLg.lineHeight,
    color: uberColors.body,
    textAlign: "center",
    paddingHorizontal: uberSpacing.sm,
    fontFamily: uberTypography.bodyLg.fontFamily,
  },
  bottom: {
    paddingHorizontal: 28,
    paddingBottom: 40,
    gap: 28,
    alignItems: "center",
  },
  indicatorRow: { flexDirection: "row", gap: 10 },
  indicator: { width: 10, height: 10, borderRadius: 5 },
  indicatorActive: {
    width: 28,
    borderRadius: 5,
    backgroundColor: uberColors.primary,
  },
  indicatorInactive: { backgroundColor: uberColors.canvasSoft },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: uberSpacing.lg,
    borderRadius: uberRounded.xl,
    backgroundColor: uberColors.primary,
    gap: uberSpacing.sm,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  buttonPressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  buttonText: {
    color: uberColors.onDark,
    fontSize: uberTypography.buttonLarge.fontSize,
    fontWeight: uberTypography.buttonLarge.fontWeight,
    fontFamily: uberTypography.buttonLarge.fontFamily,
  },
});
