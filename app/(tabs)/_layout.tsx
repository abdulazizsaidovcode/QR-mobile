import { Tabs } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { AntDesign } from "@expo/vector-icons";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Terminal from "./Terminal";
import PaymentQr from "./PayMent";
import HomeScreen from "./home";
import UserTerminal from "./UserTerminal";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [active, setActive] = useState<boolean>(false);

  
const Tab = createBottomTabNavigator();

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].primary,
          tabBarInactiveTintColor: "gray",
          headerShown: false,
          tabBarStyle: {
            height: 60,
            backgroundColor: "#f8f9fa",
            borderTopWidth: 0,
            position: "absolute",
            bottom: 16,
            left: 16,
            right: 16,
            borderRadius: 30,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            paddingBottom: 10,
          },
        })}
      >
        <Tab.Screen
          name="home"
          component={HomeScreen}
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={(e) => {
                  setActive(false); // Reset active state
                  props.onPress?.(e); // Use optional chaining
                }}
              />
            ),
          }}
        />

        <Tab.Screen
          name="PayMent"
          component={PaymentQr}
          options={{
            title: "Payment",
            tabBarIcon: ({ color, focused }) => (
              <AntDesign
                name="qrcode"
                size={34}
                style={{ marginBottom: -10 }}
                color={color}
              />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity
                activeOpacity={0.8}
                {...props}
                
                onPress={(e) => {
                  setActive(true);
                  if (props && props.onPress) {
                    props.onPress?.(e); // Use optional chaining
                  }
                }}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Terminal"
          component={Terminal}
          options={{
            title: "Terminal",
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome5 name="calculator" size={24} color={color} />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={(e) => {
                  setActive(false); // Reset active state
                  props.onPress?.(e); // Use optional chaining
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Terminal users"
          component={UserTerminal}
          options={{
            title: "Terminal users",
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome5 name="users" size={24} color={color} />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={(e) => {
                  setActive(false); // Reset active state
                  props.onPress?.(e); // Use optional chaining
                }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}
