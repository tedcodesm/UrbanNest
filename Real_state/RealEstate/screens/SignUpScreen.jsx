import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { BASE_URL } from "../config/Ip";

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("tenant");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    if (!username || !email || !password || !phone) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/auth/register`, {
        username,
        email,
        password,
        phone,
        role,
      });
      navigation.navigate("otp", { email });
    } catch (error) {
      Alert.alert("Registration Failed", error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const renderRadioOption = (label, value, icon) => {
    const selected = role === value;
    return (
      <TouchableOpacity
        onPress={() => setRole(value)}
        className={`flex-row items-center px-4 py-3.5 rounded-2xl border-2 flex-1 ${
          selected ? "bg-[#14213D] border-[#14213D]" : "bg-white border-gray-100"
        }`}
      >
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={selected ? "#FCA311" : "#94A3B8"}
        />
        <Text className={`ml-3 font-black ${selected ? "text-white" : "text-gray-400"}`}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-[#14213D]">
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="px-8 pt-8 pb-12">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-12 h-12 bg-white/10 rounded-full items-center justify-center mb-6"
          >
            <MaterialCommunityIcons name="chevron-left" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-4xl font-black">Create Account</Text>
          <Text className="text-gray-400 font-bold mt-2">Join EstateFlow to start your journey</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1 bg-white rounded-t-[40px] px-8 py-10"
            contentContainerStyle={{ paddingBottom: 60 }}
          >
            <Text className="text-[#14213D] font-black text-xs uppercase mb-3 ml-1">Select Your Role</Text>
            <View className="flex-row gap-4 mb-8">
              {renderRadioOption("Tenant", "tenant", "account-group")}
              {renderRadioOption("Landlord", "landlord", "home-account")}
            </View>

            {/* Inputs */}
            <View className="space-y-4">
              <View className="mb-4">
                <Text className="text-[#14213D] font-black text-xs uppercase mb-2 ml-1">Full Name</Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4 py-1">
                  <MaterialCommunityIcons name="account-outline" size={20} color="#94A3B8" />
                  <TextInput
                    placeholder="username"
                    placeholderTextColor="#94A3B8"
                    value={username}
                    onChangeText={setUsername}
                    className="flex-1 px-3 py-3 text-[#14213D] font-bold"
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-[#14213D] font-black text-xs uppercase mb-2 ml-1">Email Address</Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4 py-1">
                  <MaterialCommunityIcons name="email-outline" size={20} color="#94A3B8" />
                  <TextInput
                    placeholder="name@email.com"
                    placeholderTextColor="#94A3B8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="flex-1 px-3 py-3 text-[#14213D] font-bold"
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-[#14213D] font-black text-xs uppercase mb-2 ml-1">Phone Number</Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4 py-1">
                  <MaterialCommunityIcons name="phone-outline" size={20} color="#94A3B8" />
                  <TextInput
                    placeholder="+254 700 000 000"
                    placeholderTextColor="#94A3B8"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    className="flex-1 px-3 py-3 text-[#14213D] font-bold"
                  />
                </View>
              </View>

              <View className="mb-8">
                <Text className="text-[#14213D] font-black text-xs uppercase mb-2 ml-1">Password</Text>
                <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4 py-1">
                  <MaterialCommunityIcons name="lock-outline" size={20} color="#94A3B8" />
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    className="flex-1 px-3 py-3 text-[#14213D] font-bold"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialCommunityIcons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#94A3B8" 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading}
              className="bg-[#14213D] py-5 rounded-[24px] items-center shadow-xl shadow-blue-900/30"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-black text-lg">Create {role} Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate("login")}
              className="mt-6 items-center"
            >
              <Text className="text-gray-400 font-bold">
                Already have an account?{" "}
                <Text className="text-[#FCA311] font-black">Login</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}