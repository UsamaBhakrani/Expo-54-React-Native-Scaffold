import { useIsFocused } from "@react-navigation/native";
import { AnimatePresence, MotiView } from "moti";
import React from "react";
import type { ViewStyle } from "react-native";
import { useTabDirection } from "./tab-direction";

export function TabAnimatedView({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}) {
  const isFocused = useIsFocused();
  const { direction } = useTabDirection();

  return (
    <AnimatePresence>
      {isFocused && (
        <MotiView
          style={style}
          from={{ opacity: 0, translateX: 20 * direction }}
          animate={{ opacity: 1, translateX: 0 }}
          exit={{ opacity: 0, translateX: -20 * direction }}
          transition={{ type: "timing", duration: 280 }}
        >
          {children}
        </MotiView>
      )}
    </AnimatePresence>
  );
}

export default TabAnimatedView;
