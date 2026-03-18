import React, { useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

const TenantProfileScreen = () => {
  const navigation = useNavigation();
  const { name, phone, email, logout, user, role } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          navigation.replace("login");
        },
      },
    ]);
  };

  const menuItems = [
    {
      icon: "history",
      label: "Payment History",
      subtitle: "View all your transactions",
      color: "#3B82F6",
      onPress: () => navigation.navigate("hist"),
    },
    {
      icon: "calendar-check",
      label: "My Bookings",
      subtitle: "Track your viewing requests",
      color: "#8B5CF6",
      onPress: () => navigation.navigate("mybookings"),
    },
    {
      icon: "wrench",
      label: "Maintenance Request",
      subtitle: "Report issues to your landlord",
      color: "#F59E0B",
      onPress: () =>
        navigation.navigate("messaging", {
          propertyId: user?._id,
        }),
    },
    {
      icon: "headset",
      label: "Support",
      subtitle: "Get help from our team",
      color: "#10B981",
      onPress: () => navigation.navigate("chat"),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile Header */}
        <View className="bg-[#14213D] pt-6 pb-16 px-5 rounded-b-[32px]">
          <Text className="text-white text-xl font-black text-center mb-6">
            My Profile
          </Text>

          <View className="items-center">
            {/* Avatar */}
            <View className="w-24 h-24 rounded-full bg-white/15 border-4 border-[#FCA311] items-center justify-center mb-4">
              <Text className="text-white text-3xl font-black">
                {name ? name.charAt(0).toUpperCase() : "T"}
              </Text>
            </View>

            <Text className="text-white text-2xl font-black">
              {name || "Tenant"}
            </Text>
            <View className="bg-white/15 px-4 py-1.5 rounded-full mt-2 flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-green-400 mr-2" />
              <Text className="text-gray-200 text-sm font-semibold capitalize">
                {role || "tenant"}
              </Text>
            </View>
          </View>
        </View>

        {/* Info Card (overlapping header) */}
        <View
          className="bg-white mx-5 -mt-10 rounded-[20px] p-5 border border-gray-100"
          style={{
            shadowColor: "#14213D",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-50 p-2.5 rounded-xl">
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color="#3B82F6"
              />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-gray-400 text-xs font-medium">Email</Text>
              <Text className="text-[#14213D] font-bold text-base">
                {email || "Not provided"}
              </Text>
            </View>
          </View>

          <View className="h-[1px] bg-gray-100 mb-4" />

          <View className="flex-row items-center">
            <View className="bg-green-50 p-2.5 rounded-xl">
              <MaterialCommunityIcons
                name="phone-outline"
                size={20}
                color="#10B981"
              />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-gray-400 text-xs font-medium">Phone</Text>
              <Text className="text-[#14213D] font-bold text-base">
                {phone || "Not provided"}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View className="mx-5 mt-6">
          <Text className="text-[#14213D] text-lg font-black mb-3">
            Quick Actions
          </Text>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={item.onPress}
              className="bg-white rounded-[18px] p-4 mb-3 flex-row items-center border border-gray-100"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <View
                className="w-12 h-12 rounded-xl items-center justify-center"
                style={{ backgroundColor: item.color + "15" }}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color={item.color}
                />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-[#14213D] font-bold text-base">
                  {item.label}
                </Text>
                <Text className="text-gray-400 text-xs mt-0.5">
                  {item.subtitle}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color="#D1D5DB"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View className="mx-5 mt-4">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-50 border border-red-200 py-4 rounded-2xl flex-row items-center justify-center"
          >
            <MaterialCommunityIcons name="logout" size={22} color="#EF4444" />
            <Text className="text-red-500 font-black text-base ml-2">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TenantProfileScreen;
