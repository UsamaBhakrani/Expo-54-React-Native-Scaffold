import { createEvolu, SimpleName } from "@evolu/common";
import { createUseEvolu, EvoluProvider } from "@evolu/react";
import { evoluReactNativeDeps } from "@evolu/react-native/expo-sqlite";
import { type ReactNode } from "react";

import { Schema } from "./evolu-schema";

// Create Evolu instance
export const evolu = createEvolu(evoluReactNativeDeps)(Schema, {
  name: SimpleName.orThrow("my-app"),
});

// Typed useEvolu hook for mutations
export const useAppEvolu = createUseEvolu(evolu);

// Query helpers
export const createQuery = evolu.createQuery;

// Wrapper for app
export function EvoluAppProvider({ children }: { children: ReactNode }) {
  return <EvoluProvider value={evolu}>{children}</EvoluProvider>;
}
