import React, { createContext, useContext, useState } from "react";

type TabDirectionContextType = {
  index: number;
  direction: number; // 1 = forward/right, -1 = back/left
  setIndex: (next: number) => void;
};

const TabDirectionContext = createContext<TabDirectionContextType | null>(null);

export function TabDirectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [index, setIndexState] = useState(0);
  const [direction, setDirection] = useState(1);

  const setIndex = (next: number) => {
    if (next === index) return;
    setDirection(next > index ? 1 : -1);
    setIndexState(next);
  };

  return (
    <TabDirectionContext.Provider value={{ index, direction, setIndex }}>
      {children}
    </TabDirectionContext.Provider>
  );
}

export function useTabDirection() {
  const ctx = useContext(TabDirectionContext);
  if (!ctx)
    throw new Error("useTabDirection must be used inside TabDirectionProvider");
  return ctx;
}

export default TabDirectionProvider;
