import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/Ip";

const TenantBookingsScreen = () => {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchBookings = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const { data } = await axios.get(`${BASE_URL}/booking/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const getStatusConfig = (status) => {
    switch (status) {
      case "confirmed":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-700",
          icon: "check-circle",
          iconColor: "#15803D",
        };
      case "rejected":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          icon: "close-circle",
          iconColor: "#B91C1C",
        };
      case "cancelled":
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          icon: "cancel",
          iconColor: "#4B5563",
        };
      default:
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-700",
          icon: "clock-outline",
          iconColor: "#A16207",
        };
    }
  };

  const filteredBookings =
    activeFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === activeFilter);

  const filters = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Rejected", value: "rejected" },
  ];

  const renderBooking = ({ item }) => {
    const config = getStatusConfig(item.status);
    const dateStr = new Date(item.viewingDate).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return (
      <View
        className="bg-white rounded-[20px] mb-4 overflow-hidden border border-gray-100"
        style={{
          shadowColor: "#14213D",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View className="p-5">
          {/* Title + Status */}
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1 mr-3">
              <Text
                className="text-base font-black text-[#14213D]"
                numberOfLines={1}
              >
                {item.property?.title || "Property"}
              </Text>
              {item.property?.address && (
                <View className="flex-row items-center mt-1">
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={14}
                    color="#9CA3AF"
                  />
                  <Text className="text-gray-400 text-xs ml-1" numberOfLines={1}>
                    {item.property.address}
                  </Text>
                </View>
              )}
            </View>
            <View
              className={`px-3 py-1.5 rounded-full flex-row items-center ${config.bg} border ${config.border}`}
            >
              <MaterialCommunityIcons
                name={config.icon}
                size={14}
                color={config.iconColor}
              />
              <Text className={`ml-1 text-xs font-bold capitalize ${config.text}`}>
                {item.status}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View className="h-[1px] bg-gray-100 mb-3" />

          {/* Date + Time + Landlord */}
          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="calendar"
                size={16}
                color="#6B7280"
              />
              <Text className="text-gray-600 text-sm ml-1.5 font-medium">
                {dateStr}
              </Text>
            </View>
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color="#6B7280"
              />
              <Text className="text-gray-600 text-sm ml-1.5 font-medium">
                {item.time}
              </Text>
            </View>
          </View>

          {/* Landlord name */}
          {item.landlord?.username && (
            <View className="flex-row items-center mt-2.5">
              <MaterialCommunityIcons
                name="account-outline"
                size={16}
                color="#9CA3AF"
              />
              <Text className="text-gray-500 text-sm ml-1.5">
                Landlord: {item.landlord.username}
              </Text>
            </View>
          )}

          {/* Message */}
          {item.message && (
            <View className="bg-gray-50 rounded-xl p-3 mt-3">
              <Text className="text-gray-600 text-sm italic">
                "{item.message}"
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      {/* Header */}
      <View className="bg-[#14213D] px-5 pt-4 pb-6 rounded-b-[28px]">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            className="p-2 bg-white/10 rounded-full"
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color="white"
            />
          </TouchableOpacity>
          <Text className="text-white text-xl font-black">My Bookings</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Filters */}
        <View className="flex-row gap-2">
          {filters.map((f) => {
            const isActive = activeFilter === f.value;
            return (
              <TouchableOpacity
                key={f.value}
                onPress={() => setActiveFilter(f.value)}
                className={`px-4 py-2 rounded-full border ${
                  isActive
                    ? "bg-[#FCA311] border-[#FCA311]"
                    : "bg-white/10 border-white/20"
                }`}
              >
                <Text
                  className={`text-sm font-bold ${
                    isActive ? "text-white" : "text-gray-300"
                  }`}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Bookings List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FCA311" />
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item._id}
          renderItem={renderBooking}
          contentContainerStyle={{
            padding: 20,
            paddingTop: 16,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <MaterialCommunityIcons
                name="calendar-blank"
                size={60}
                color="#D1D5DB"
              />
              <Text className="text-gray-400 mt-4 text-lg font-bold">
                No bookings found
              </Text>
              <Text className="text-gray-400 mt-1 text-center text-sm">
                Book a property viewing to see it here
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default TenantBookingsScreen;
