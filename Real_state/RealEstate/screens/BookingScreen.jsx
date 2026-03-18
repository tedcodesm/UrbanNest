import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../config/Ip";

const BookingScreen = ({ route, navigation }) => {
  const { propertyId, propertyTitle } = route.params;

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === "set" && selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(date.getHours());
      newDate.setMinutes(date.getMinutes());
      setDate(newDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (event.type === "set" && selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const handleBooking = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      await axios.post(
        `${BASE_URL}/booking/`,
        {
          propertyId,
          viewingDate: date.toISOString(),
          message,
          time: date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", "Viewing booked successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Booking failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
          <Text className="text-white text-xl font-black">Book Viewing</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Property Info */}
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
          <View className="flex-row items-center">
            <View className="bg-[#14213D]/10 w-12 h-12 rounded-xl items-center justify-center">
              <MaterialCommunityIcons
                name="home"
                size={24}
                color="#14213D"
              />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-gray-400 text-xs font-medium">
                Property
              </Text>
              <Text className="text-[#14213D] font-black text-base" numberOfLines={1}>
                {propertyTitle || "Property Viewing"}
              </Text>
            </View>
          </View>
        </View>

        {/* Date & Time Selection */}
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
          <Text className="text-[#14213D] font-black text-lg mb-4">
            Select Date & Time
          </Text>

          {/* Date Picker */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="flex-row items-center justify-between bg-gray-50 p-4 rounded-2xl mb-3 border border-gray-100"
          >
            <View className="flex-row items-center">
              <View className="bg-blue-50 p-2.5 rounded-xl">
                <MaterialCommunityIcons
                  name="calendar"
                  size={22}
                  color="#3B82F6"
                />
              </View>
              <View className="ml-3">
                <Text className="text-gray-400 text-xs font-medium">Date</Text>
                <Text className="text-[#14213D] font-bold text-base">
                  {date.toLocaleDateString([], {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#D1D5DB"
            />
          </TouchableOpacity>

          {/* Time Picker */}
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            className="flex-row items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100"
          >
            <View className="flex-row items-center">
              <View className="bg-purple-50 p-2.5 rounded-xl">
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={22}
                  color="#8B5CF6"
                />
              </View>
              <View className="ml-3">
                <Text className="text-gray-400 text-xs font-medium">Time</Text>
                <Text className="text-[#14213D] font-bold text-base">
                  {date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#D1D5DB"
            />
          </TouchableOpacity>

          {/* Hint */}
          <View className="flex-row items-center mt-3 bg-yellow-50 p-3 rounded-xl">
            <MaterialCommunityIcons
              name="information"
              size={16}
              color="#CA8A04"
            />
            <Text className="text-yellow-700 text-xs ml-2 flex-1">
              Viewings available between 8:00 AM and 4:00 PM
            </Text>
          </View>
        </View>

        {/* Message */}
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
          <Text className="text-[#14213D] font-black text-lg mb-3">
            Message
            <Text className="text-gray-400 text-sm font-medium">
              {" "}
              (optional)
            </Text>
          </Text>
          <TextInput
            placeholder="I'm interested in viewing this property..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={message}
            onChangeText={setMessage}
            className="bg-gray-50 p-4 rounded-2xl text-base text-gray-800 border border-gray-100"
            style={{ textAlignVertical: "top", minHeight: 100 }}
          />
        </View>

        {/* Book Button */}
        <TouchableOpacity
          onPress={handleBooking}
          disabled={loading}
          className={`py-5 rounded-2xl flex-row justify-center items-center ${
            loading ? "bg-gray-400" : "bg-[#14213D]"
          }`}
          style={{
            shadowColor: "#14213D",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <MaterialCommunityIcons
            name="calendar-check"
            size={22}
            color="white"
          />
          <Text className="text-white font-black text-lg ml-2">
            {loading ? "Booking..." : "Confirm Booking"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          minimumDate={new Date()}
          onChange={onDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onTimeChange}
        />
      )}
    </SafeAreaView>
  );
};

export default BookingScreen;