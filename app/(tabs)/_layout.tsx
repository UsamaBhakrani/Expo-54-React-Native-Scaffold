import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { TabDirectionProvider } from "@/components/ui/tab-direction";
import { uberColors } from "@/constants/theme";

export default function TabLayout() {
  return (
    <TabDirectionProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarActiveTintColor: uberColors.primary,
          tabBarInactiveTintColor: uberColors.body,
          tabBarStyle: {
            backgroundColor: uberColors.canvas,
            borderTopColor: uberColors.canvasSoft,
            borderTopWidth: 1,
            paddingBottom: 8,
            height: 60,
          },
          tabBarLabelStyle: {
            fontFamily: "UberMoveText, system-ui, sans-serif",
            fontSize: 12,
            fontWeight: "500",
            paddingBottom: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={26} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="suppliers"
          options={{
            title: "Suppliers",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={26} name="person.2.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="expenses"
          options={{
            title: "Expenses",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={26} name="dollarsign.circle.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="customers"
          options={{
            title: "Customers",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={26} name="person.crop.circle.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="products"
          options={{
            title: "Products",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={26} name="shippingbox.fill" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </TabDirectionProvider>
  );
}
