import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { BASE_URL } from "../config/Ip";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BookVisitWithIDScreen = ({ route, navigation }) => {
  const { property } = route.params;
  const [visitDate, setVisitDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [idNumber, setIdNumber] = useState("");
  const [idImage, setIdImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickIDImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setIdImage(result.assets[0]);
    }
  };

  const takeSelfie = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Camera permission required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelfieImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!idNumber || !idImage) {
      Alert.alert("Error", "ID number and ID image are required.");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();
      formData.append("propertyId", property?._id);
      formData.append("visitDate", visitDate.toISOString());
      formData.append("idNumber", idNumber);

      formData.append("idImage", {
        uri:
          Platform.OS === "android"
            ? idImage.uri
            : idImage.uri.replace("file://", ""),
        name: "id.jpg",
        type: "image/jpeg",
      });

      if (selfieImage) {
        formData.append("selfieImage", {
          uri:
            Platform.OS === "android"
              ? selfieImage.uri
              : selfieImage.uri.replace("file://", ""),
          name: "selfie.jpg",
          type: "image/jpeg",
        });
      }

      await axios.post(`${BASE_URL}/visitors/book`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", "Visit booked successfully.");
      navigation.goBack();
    } catch (error) {
      console.log(error?.response?.data || error.message);
      Alert.alert("Error", error?.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-2xl font-bold mb-2">Verify Identity</Text>
        <Text className="text-gray-500 mb-5">
          Provide identification before booking a viewing.
        </Text>

<Text className="font-semibold mb-2">Visit Date & Time</Text>

<View className="bg-white p-4 rounded-xl mb-4">
  <Text className="text-gray-700">
    {new Date().toLocaleString()}
  </Text>
</View>
        {/* <Text className="font-semibold mb-2">Visit Date & Time</Text>

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="bg-white p-4 rounded-xl mb-4"
        >
          <Text>{visitDate.toLocaleString()}</Text>
        </TouchableOpacity>

        {/* DATE PICKER */}
        {showDatePicker && (
          <DateTimePicker
            value={visitDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setVisitDate(selectedDate);
                setShowTimePicker(true); // open time picker next
              }
            }}
          />
        )} */

        {showTimePicker && (
          <DateTimePicker
            value={visitDate}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) {
                const updatedDate = new Date(visitDate);
                updatedDate.setHours(selectedTime.getHours());
                updatedDate.setMinutes(selectedTime.getMinutes());
                setVisitDate(updatedDate);
              }
            }}
          />
        )}

        <Text className="font-semibold mb-2">National ID Number *</Text>
        <TextInput
          placeholder="Enter ID number"
          value={idNumber}
          onChangeText={setIdNumber}
          className="bg-white p-4 rounded-xl mb-4"
        />

        <Text className="font-semibold mb-2">Upload ID Card *</Text>
        <TouchableOpacity
          onPress={pickIDImage}
          className="bg-white p-5 rounded-xl items-center mb-2"
        >
          <Text>Tap to Upload ID</Text>
        </TouchableOpacity>

        {idImage && (
          <Image
            source={{ uri: idImage.uri }}
            className="h-36 rounded-xl mb-4"
          />
        )}

        <Text className="font-semibold mb-2">Take Selfie </Text>
        <TouchableOpacity
          onPress={takeSelfie}
          className="bg-white p-5 rounded-xl items-center mb-2"
        >
          <Text>Capture Selfie</Text>
        </TouchableOpacity>

        {selfieImage && (
          <Image
            source={{ uri: selfieImage.uri }}
            className="h-36 rounded-xl mb-5"
          />
        )}

        <View className="bg-gray-200 p-3 rounded-lg mb-5">
          <Text className="text-xs text-gray-700">
            Your identification is securely stored and only accessible to the
            property owner and administrators.
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className={`p-4 rounded-xl items-center ${loading ? "bg-gray-600" : "bg-[#14213D]"} mb-10`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold">
              Verify & Book Visit
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookVisitWithIDScreen;
