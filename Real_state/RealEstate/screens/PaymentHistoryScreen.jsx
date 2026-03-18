import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/Ip";

const PaymentHistoryScreen = () => {
  const navigation = useNavigation();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${BASE_URL}/payment/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data || []);
    } catch (error) {
      console.log("Payment history error:", error.response?.data || error.message);
      // If endpoint doesn't exist yet, show empty
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "completed":
        return {
          color: "text-green-600",
          bg: "bg-green-50",
          borderColor: "border-green-200",
          icon: "check-circle",
          iconColor: "#16A34A",
          label: "Paid",
        };
      case "pending":
        return {
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          borderColor: "border-yellow-200",
          icon: "clock-outline",
          iconColor: "#CA8A04",
          label: "Pending",
        };
      case "failed":
        return {
          color: "text-red-600",
          bg: "bg-red-50",
          borderColor: "border-red-200",
          icon: "close-circle",
          iconColor: "#DC2626",
          label: "Failed",
        };
      default:
        return {
          color: "text-gray-600",
          bg: "bg-gray-50",
          borderColor: "border-gray-200",
          icon: "help-circle",
          iconColor: "#6B7280",
          label: status || "Unknown",
        };
    }
  };

  const renderPaymentCard = ({ item }) => {
    const statusConfig = getStatusConfig(item.status);
    const date = item.paidAt
      ? new Date(item.paidAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : new Date(item.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

    return (
      <View
        className={`bg-white rounded-[20px] mb-4 overflow-hidden border border-gray-100`}
        style={{
          shadowColor: "#14213D",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View className="p-5">
          {/* Top row */}
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1 mr-3">
              <Text className="text-base font-black text-[#14213D]" numberOfLines={1}>
                {item.property?.title || "Property Payment"}
              </Text>
              <Text className="text-gray-400 text-xs mt-1 font-medium">
                {date}
              </Text>
            </View>
            <View
              className={`px-3 py-1.5 rounded-full flex-row items-center ${statusConfig.bg} border ${statusConfig.borderColor}`}
            >
              <MaterialCommunityIcons
                name={statusConfig.icon}
                size={14}
                color={statusConfig.iconColor}
              />
              <Text
                className={`ml-1 text-xs font-bold ${statusConfig.color}`}
              >
                {statusConfig.label}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View className="h-[1px] bg-gray-100 mb-3" />

          {/* Bottom row */}
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="credit-card-outline"
                size={18}
                color="#9CA3AF"
              />
              <Text className="text-gray-500 text-sm ml-2 font-medium">
                {item.paymentMethod || "Card"}
              </Text>
            </View>
            <Text className="text-xl font-black text-[#14213D]">
              KSh {Number(item.amount || 0).toLocaleString()}
            </Text>
          </View>

          {/* Reference */}
          {item.merchantReference && (
            <Text className="text-gray-400 text-[11px] mt-2 font-medium">
              Ref: {item.merchantReference}
            </Text>
          )}
        </View>
      </View>
    );
  };

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
          <Text className="text-white text-xl font-black">
            Payment History
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Summary */}
        {payments.length > 0 && (
          <View className="mt-4 bg-white/10 rounded-2xl p-4 border border-white/10">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-gray-300 text-sm font-medium">
                  Total Payments
                </Text>
                <Text className="text-white text-2xl font-black mt-1">
                  {payments.length}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-300 text-sm font-medium">
                  Total Paid
                </Text>
                <Text className="text-[#FCA311] text-2xl font-black mt-1">
                  KSh{" "}
                  {payments
                    .filter((p) => p.status === "completed")
                    .reduce((sum, p) => sum + (p.amount || 0), 0)
                    .toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Payment List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FCA311" />
        </View>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item._id || item.merchantReference}
          renderItem={renderPaymentCard}
          contentContainerStyle={{ padding: 20, paddingTop: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <MaterialCommunityIcons
                name="receipt"
                size={60}
                color="#D1D5DB"
              />
              <Text className="text-gray-400 mt-4 text-lg font-bold">
                No payments yet
              </Text>
              <Text className="text-gray-400 mt-1 text-center text-sm">
                Your payment history will appear here
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default PaymentHistoryScreen;
