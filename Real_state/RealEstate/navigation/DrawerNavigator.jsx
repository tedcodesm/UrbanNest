import React, { useContext } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createDrawerNavigator, DrawerItemList } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import BottomNavigator from "./BottomNavigator";
import PaymentHistoryScreen from "../screens/PaymentHistoryScreen";
import TenantProfileSreen from "../screens/TenantProfileSreen";
import TenantBookingsScreen from "../screens/TenantBookingsScreen";
import PropertyScreen from "../screens/PropertyScreen";
import IncomeReportScreen from "../screens/IncomeReportScreen";
import CreatePropertyScreen from "../screens/CreatePropertyScreen";
import LandlordProfileScreen from "../screens/LandlordProfileScreen.jsx";
import LandlordBookingsScreen from "../screens/LandlordBookingScreen.jsx";

import { AuthContext } from "../context/AuthContext.jsx";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { role, loading, name } = useContext(AuthContext);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#14213D" />
        <Text className="mt-2 text-gray-600 text-lg">Loading user info...</Text>
      </View>
    );
  }

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
          {/* Drawer Header */}
          <View className="bg-[#14213D] px-5 pt-8 pb-6 rounded-b-[24px] mb-2">
            <View className="flex-row items-center">
              <View className="w-14 h-14 rounded-full bg-white/20 border-2 border-[#FCA311] items-center justify-center">
                <Text className="text-white text-xl font-black">
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </Text>
              </View>
              <View className="ml-4">
                <Text className="text-white text-lg font-black">
                  {name || "User"}
                </Text>
                <View className="bg-[#FCA311]/20 px-3 py-0.5 rounded-full self-start mt-1">
                  <Text className="text-[#FCA311] text-xs font-bold capitalize">
                    {role || "Guest"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <DrawerItemList {...props} />
        </SafeAreaView>
      )}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: "#14213D",
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#374151",
        drawerLabelStyle: { marginLeft: -8, fontSize: 14, fontWeight: "600" },
        drawerItemStyle: {
          borderRadius: 14,
          marginHorizontal: 10,
          paddingVertical: 2,
        },
      }}
    >
      <Drawer.Screen
        name="bottom"
        component={BottomNavigator}
        options={{
          drawerLabel: "Home",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />

      {role === "landlord" && (
        <>
          <Drawer.Screen
            name="createproperty"
            component={CreatePropertyScreen}
            options={{
              drawerLabel: "Create Property",
              drawerIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="plus-circle-outline"
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          <Drawer.Screen
            name="prop"
            component={PropertyScreen}
            options={{
              drawerLabel: "My Properties",
              drawerIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="home-city"
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          <Drawer.Screen
            name="inc"
            component={IncomeReportScreen}
            options={{
              drawerLabel: "Income Report",
              drawerIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="chart-line"
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          <Drawer.Screen
            name="bookings"
            component={LandlordBookingsScreen}
            options={{
              drawerLabel: "Bookings",
              drawerIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="calendar-check"
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          <Drawer.Screen
            name="landi"
            component={LandlordProfileScreen}
            options={{
              drawerLabel: "My Profile",
              drawerIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="account"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        </>
      )}

      {role === "tenant" && (
        <>
          <Drawer.Screen
            name="mybookings"
            component={TenantBookingsScreen}
            options={{
              drawerLabel: "My Bookings",
              drawerIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="calendar-check"
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          <Drawer.Screen
            name="hist"
            component={PaymentHistoryScreen}
            options={{
              drawerLabel: "Payment History",
              drawerIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="history"
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          <Drawer.Screen
            name="ten"
            component={TenantProfileSreen}
            options={{
              drawerLabel: "My Profile",
              drawerIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="account"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        </>
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;