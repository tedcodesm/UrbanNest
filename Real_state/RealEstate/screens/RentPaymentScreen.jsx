import React, { useContext, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import { BASE_URL } from "../config/Ip";
import { optimizeImage } from "../utils/imageHandler";

const RentPaymentScreen = ({ route }) => {
  const navigation = useNavigation();
  const { name } = useContext(AuthContext);
  const { price, property } = route.params;
  const [paying, setPaying] = useState(false);

  const handleProceedToPayment = async () => {
    try {
      setPaying(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const res = await axios.post(
        `${BASE_URL}/payment/create`,
        { propertyId: property._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { redirectUrl } = res.data;

      if (!redirectUrl) {
        alert("Payment failed to start");
        return;
      }

      await WebBrowser.openBrowserAsync(redirectUrl);
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to initiate payment");
    } finally {
      setPaying(false);
    }
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
          <Text className="text-white text-xl font-black">
            Payment
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <Text className="text-gray-300 text-sm text-center">
          Hi, {name}! Complete your payment below.
        </Text>
      </View>

      <View className="flex-1 px-5 pt-5">
        {/* Property Card */}
        <View
          className="bg-white rounded-[20px] overflow-hidden border border-gray-100 mb-5"
          style={{
            shadowColor: "#14213D",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          {property?.images?.[0] && (
            <Image
              source={{ uri: optimizeImage(property.images[0], 600) }}
              style={{ width: "100%", height: 160 }}
              resizeMode="cover"
            />
          )}
          <View className="p-5">
            <Text className="text-lg font-black text-[#14213D]">
              {property?.title}
            </Text>
            <View className="flex-row items-center mt-1">
              <MaterialCommunityIcons
                name="map-marker"
                size={14}
                color="#9CA3AF"
              />
              <Text className="text-gray-500 text-sm ml-1">
                {property?.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Amount Card */}
        <View
          className="bg-[#14213D] rounded-[20px] p-6 mb-5"
          style={{
            shadowColor: "#14213D",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Text className="text-gray-300 text-sm font-medium">
            Amount Due
          </Text>
          <Text className="text-white text-4xl font-black mt-1">
            KSH {Number(price).toLocaleString()}
          </Text>
          <View className="h-[1px] bg-white/15 my-4" />
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-300 text-sm font-medium">
              Payment Method
            </Text>
            <View className="flex-row items-center bg-white/10 px-3 py-1.5 rounded-full">
              <MaterialCommunityIcons
                name="credit-card-outline"
                size={16}
                color="white"
              />
              <Text className="text-white text-sm font-bold ml-1.5">
                Card / M-Pesa
              </Text>
            </View>
          </View>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          className={`py-5 rounded-2xl items-center flex-row justify-center ${
            paying ? "bg-gray-400" : "bg-[#FCA311]"
          }`}
          style={{
            shadowColor: "#FCA311",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
          onPress={handleProceedToPayment}
          disabled={paying}
        >
          {paying ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <MaterialCommunityIcons
                name="shield-check"
                size={22}
                color="white"
              />
              <Text className="text-white text-lg font-black ml-2">
                Pay Now — KSH {Number(price).toLocaleString()}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Secondary Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("hist")}
          className="mt-3 py-4 rounded-2xl items-center flex-row justify-center bg-white border border-gray-200"
        >
          <MaterialCommunityIcons
            name="history"
            size={20}
            color="#14213D"
          />
          <Text className="text-[#14213D] font-bold text-base ml-2">
            View Payment History
          </Text>
        </TouchableOpacity>

        {/* Security Note */}
        <View className="flex-row items-center justify-center mt-6">
          <MaterialCommunityIcons
            name="lock-outline"
            size={14}
            color="#9CA3AF"
          />
          <Text className="text-gray-400 text-xs ml-1 font-medium">
            Secured by Stripe. Your payment is encrypted.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RentPaymentScreen;
