import { Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { AntDesign } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: '#f8f9fa',
          borderTopWidth: 0,
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          borderRadius: 30,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          paddingBottom: 10,
        },
      })}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="PayMent"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="qrcode" size={34} style={{ marginBottom: -10 }} color={color == '#ff5e2c' ? "white" : color} />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={{
                top: -30, // Slightly raise the Home tab
                justifyContent: 'flex-end',
                alignItems: 'center',
                backgroundColor: '#FF5A3A', // Change background color on focus
                height: 70,
                width: 70,
                borderRadius: 40,
                shadowColor: '#000',
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                paddingBottom: -10,

              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Terminal"
        options={{
          title: 'Terminal',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 name="calculator" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
