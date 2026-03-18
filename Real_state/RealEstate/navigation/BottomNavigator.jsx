import { View, Text, Platform } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DiscoverScreen from "../screens/DiscoverScreen";
import ChatScreen from "../screens/ChatScreen";
import MapScreen from "../screens/MapScreen";

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#FCA311",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          backgroundColor: "#14213D",
          borderRadius: 25,
          position: "absolute",
          left: 15,
          right: 15,
          bottom: 15,
          height: 75,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          borderTopWidth: 0,
          paddingBottom: 12,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "800",
          marginTop: 2,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? "home" : "home-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="disc"
        component={DiscoverScreen}
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? "compass" : "compass-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="chat"
        component={ChatScreen}
        options={{
          tabBarLabel: "AI Bot",
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? "chat-processing" : "chat-processing-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="map"
        component={MapScreen}
        options={{
          tabBarLabel: "Near Me",
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? "map-marker" : "map-marker-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
