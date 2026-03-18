import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { BASE_URL } from "../config/Ip.jsx";

export default function VerifyOTP({ route, navigation }) {
  const email = route?.params?.email || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (!/^[0-9]?$/.test(text)) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleBackspace = (key, index) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      Alert.alert("Invalid code", "Please enter the full 6-digit code.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/auth/verify`, {
        email,
        otp: otpCode,
      });
      Alert.alert("Success", "Account verified successfully!");
      navigation.navigate("login");
    } catch (error) {
      Alert.alert("Verification Failed", error?.response?.data?.message || "Invalid OTP code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#14213D]">
      <SafeAreaView className="flex-1">
        <View className="px-8 pt-10 pb-12">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-12 h-12 bg-white/10 rounded-full items-center justify-center mb-6"
          >
            <MaterialCommunityIcons name="chevron-left" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-4xl font-black">Verify Email</Text>
          <Text className="text-gray-400 font-bold mt-2">
            Enter the 6-digit code sent to your email
          </Text>
          <Text className="text-[#FCA311] font-black mt-1">{email}</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 bg-white rounded-t-[40px] px-8 py-12">
              <View className="items-center mb-10">
                <View className="bg-blue-50 w-20 h-20 rounded-full items-center justify-center mb-4">
                  <MaterialCommunityIcons name="email-check-outline" size={40} color="#14213D" />
                </View>
              </View>

              {/* OTP Input Row */}
              <View className="flex-row justify-between mb-10">
                {otp.map((digit, index) => (
                  <View 
                    key={index} 
                    className={`w-[14%] aspect-square border-2 rounded-2xl items-center justify-center ${
                      digit ? "border-[#14213D] bg-gray-50" : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <TextInput
                      ref={(ref) => (inputs.current[index] = ref)}
                      value={digit}
                      onChangeText={(text) => handleChange(text, index)}
                      onKeyPress={({ nativeEvent }) => handleBackspace(nativeEvent.key, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      className="w-full text-center text-2xl font-black text-[#14213D]"
                      selectionColor="#14213D"
                    />
                  </View>
                ))}
              </View>

              <TouchableOpacity
                onPress={handleVerify}
                disabled={loading}
                className="w-full bg-[#14213D] py-5 rounded-[24px] items-center mb-6 shadow-xl shadow-blue-900/40"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-black text-lg uppercase tracking-widest">Verify Code</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity className="items-center">
                <Text className="text-gray-400 font-extrabold">
                  Didn't receive a code?{" "}
                  <Text className="text-[#FCA311]">Resend</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
