import React, { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../config/Ip";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    (async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      const storedPassword = await AsyncStorage.getItem("password");
      if (storedEmail && storedPassword) {
        setEmail(storedEmail);
        setPassword(storedPassword);
      }
    })();
  }, []);

  const handleLogin = async (userEmail = email, userPassword = password) => {
    if (!userEmail || !userPassword) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email: userEmail,
        password: userPassword,
      });

      const data = response.data;

      if (data?.token && data?.user) {
        await AsyncStorage.setItem("email", userEmail);
        await AsyncStorage.setItem("password", userPassword);
        await login(data.user, data.token);
        navigation.replace("drawer");
      }
    } catch (error) {
      Alert.alert("Login Failed", error?.response?.data?.message || "Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleFingerprintLogin = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const savedBiometrics = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !savedBiometrics) {
        Alert.alert("Biometrics Not Available", "Please set up fingerprint or face ID on your device first.");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login to EstateFlow",
        cancelLabel: "Cancel",
      });

      if (result.success) {
        const storedEmail = await AsyncStorage.getItem("email");
        const storedPassword = await AsyncStorage.getItem("password");

        if (storedEmail && storedPassword) {
          handleLogin(storedEmail, storedPassword);
        } else {
          Alert.alert("Manual Login Required", "Please login with your password once before using biometrics.");
        }
      }
    } catch (error) {
      Alert.alert("Authentication Error", "Could not complete biometric login.");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      {/* Curved Navy Header */}
      <View className="bg-[#14213D] h-[35%] w-full rounded-b-[40px] justify-center items-center px-8">
        <View className="bg-[#FCA311] w-20 h-20 rounded-2xl items-center justify-center rotate-12 shadow-2xl">
          <MaterialCommunityIcons name="home-city" size={48} color="white" className="-rotate-12" />
        </View>
        <Text className="text-white text-4xl font-black mt-6 tracking-tighter">EstateFlow</Text>
        <Text className="text-blue-200 text-sm font-bold uppercase tracking-[4px] mt-1">Premium Living</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 -mt-10"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="bg-white mx-6 rounded-[32px] p-8 shadow-2xl shadow-slate-900/50">
            <Text className="text-[#14213D] text-2xl font-black mb-1">Welcome Back</Text>
            <Text className="text-gray-400 font-bold mb-8">Sign in to continue your journey</Text>

            {/* Email Input */}
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

            {/* Password Input */}
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

            {/* Actions Row */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => handleLogin()}
                disabled={loading}
                className="flex-1 bg-[#14213D] py-5 rounded-2xl items-center shadow-xl shadow-blue-900/40"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-black text-lg">Log In</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleFingerprintLogin}
                className="w-16 h-16 bg-[#FCA311] rounded-2xl items-center justify-center shadow-xl shadow-orange-500/40"
              >
                <MaterialCommunityIcons name="fingerprint" size={36} color="white" />
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <TouchableOpacity
              onPress={() => navigation.navigate("signup")}
              className="mt-8 items-center"
            >
              <Text className="text-gray-400 font-bold">
                New to EstateFlow?{" "}
                <Text className="text-[#FCA311] font-black">Create Account</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}