import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/Ip";

const IncomeReportScreen = () => {
  const navigation = useNavigation();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${BASE_URL}/analytics/landlord`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(res.data);
    } catch (error) {
      console.log("Analytics error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const totalProperties = analytics?.totalProperties || 0;
  const available = analytics?.availableProperties || 0;
  const occupied = analytics?.occupiedProperties || 0;
  const expectedIncome = analytics?.totalExpectedIncome || 0;
  const occupancyRate =
    totalProperties > 0
      ? Math.round((occupied / totalProperties) * 100)
      : 0;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#F9FAFB]">
        <ActivityIndicator size="large" color="#FCA311" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      {/* Header */}
      <View className="bg-[#14213D] px-5 pt-4 pb-6 rounded-b-[28px]">
        <View className="flex-row items-center justify-between">
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
          <Text className="text-white text-xl font-black">Income Report</Text>
          <TouchableOpacity
            className="p-2 bg-white/10 rounded-full"
            onPress={fetchAnalytics}
          >
            <MaterialCommunityIcons name="refresh" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Total Income Card */}
        <View
          className="bg-[#14213D] rounded-[24px] p-6 mb-5"
          style={{
            shadowColor: "#14213D",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View className="flex-row items-center mb-2">
            <MaterialCommunityIcons
              name="chart-line"
              size={20}
              color="#FCA311"
            />
            <Text className="text-gray-300 text-sm ml-2 font-medium">
              Expected Monthly Income
            </Text>
          </View>
          <Text className="text-white text-4xl font-black">
            KSh {expectedIncome.toLocaleString()}
          </Text>

          {/* Occupancy Progress */}
          <View className="mt-5">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-300 text-sm font-medium">
                Occupancy Rate
              </Text>
              <Text className="text-[#FCA311] font-black text-sm">
                {occupancyRate}%
              </Text>
            </View>
            <View className="h-3 bg-gray-600 rounded-full overflow-hidden">
              <View
                style={{ width: `${occupancyRate}%` }}
                className="h-full bg-[#FCA311] rounded-full"
              />
            </View>
            <Text className="text-gray-400 text-xs mt-2">
              {occupied} of {totalProperties} properties occupied
            </Text>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View className="flex-row mb-5 gap-4">
          <View
            className="flex-1 bg-white rounded-[20px] p-5 border border-gray-100"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <View className="bg-blue-50 w-12 h-12 rounded-xl items-center justify-center mb-3">
              <MaterialCommunityIcons
                name="home-city"
                size={24}
                color="#3B82F6"
              />
            </View>
            <Text className="text-3xl font-black text-[#14213D]">
              {totalProperties}
            </Text>
            <Text className="text-gray-400 text-xs mt-1 font-medium">
              Total Properties
            </Text>
          </View>

          <View
            className="flex-1 bg-white rounded-[20px] p-5 border border-gray-100"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <View className="bg-green-50 w-12 h-12 rounded-xl items-center justify-center mb-3">
              <MaterialCommunityIcons
                name="check-circle"
                size={24}
                color="#22C55E"
              />
            </View>
            <Text className="text-3xl font-black text-[#14213D]">
              {available}
            </Text>
            <Text className="text-gray-400 text-xs mt-1 font-medium">
              Available
            </Text>
          </View>
        </View>

        {/* Occupied Properties Card */}
        <View
          className="bg-white rounded-[20px] p-5 mb-5 border border-gray-100"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Text className="text-lg font-black text-[#14213D] mb-4">
            Property Status
          </Text>

          {/* Occupied */}
          <View className="flex-row justify-between items-center py-3">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-[#FCA311] mr-3" />
              <Text className="text-gray-700 font-semibold">
                Occupied Units
              </Text>
            </View>
            <Text className="text-[#14213D] font-black text-lg">
              {occupied}
            </Text>
          </View>

          <View className="h-[1px] bg-gray-100" />

          {/* Available */}
          <View className="flex-row justify-between items-center py-3">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-green-500 mr-3" />
              <Text className="text-gray-700 font-semibold">
                Available Units
              </Text>
            </View>
            <Text className="text-[#14213D] font-black text-lg">
              {available}
            </Text>
          </View>

          <View className="h-[1px] bg-gray-100" />

          {/* Total */}
          <View className="flex-row justify-between items-center py-3">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-[#14213D] mr-3" />
              <Text className="text-gray-700 font-semibold">
                Total Properties
              </Text>
            </View>
            <Text className="text-[#14213D] font-black text-lg">
              {totalProperties}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="flex-row gap-4">
          <TouchableOpacity
            className="flex-1 bg-[#14213D] py-4 rounded-2xl items-center flex-row justify-center"
            onPress={() => navigation.navigate("prop")}
          >
            <MaterialCommunityIcons name="home-city" size={20} color="white" />
            <Text className="text-white font-bold text-sm ml-2">
              Properties
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-[#FCA311] py-4 rounded-2xl items-center flex-row justify-center"
            onPress={() => navigation.navigate("bookings")}
          >
            <MaterialCommunityIcons
              name="calendar-check"
              size={20}
              color="white"
            />
            <Text className="text-white font-bold text-sm ml-2">
              Bookings
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default IncomeReportScreen;
