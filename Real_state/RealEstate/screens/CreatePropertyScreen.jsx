import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  FlatList,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import axios from "axios";
import { BASE_URL } from "../config/Ip";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreatePropertyScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [address, setAddress] = useState("");
  const [propertyType, setPropertyType] = useState("Rent");
  const [category, setCategory] = useState("Apartment");
  const [amenities, setAmenities] = useState([]);
  const [amenityInput, setAmenityInput] = useState("");
  const [images, setImages] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [securityScore, setSecurityScore] = useState("5");
  const [securityDetails, setSecurityDetails] = useState([]);
  const [securityInput, setSecurityInput] = useState("");
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Please allow access to your media library.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsMultipleSelection: true,
        selectionLimit: 10 - images.length,
      });

      if (!result.canceled) {
        const newImages = result.assets.map(asset => asset.uri);
        setImages(prev => [...prev, ...newImages].slice(0, 10));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addAmenity = () => {
    if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
      setAmenities([...amenities, amenityInput.trim()]);
      setAmenityInput("");
    }
  };

  const removeAmenity = (item) => {
    setAmenities(amenities.filter((a) => a !== item));
  };

  const addSecurityDetail = () => {
    if (securityInput.trim() && !securityDetails.includes(securityInput.trim())) {
      setSecurityDetails([...securityDetails, securityInput.trim()]);
      setSecurityInput("");
    }
  };

  const removeSecurityDetail = (item) => {
    setSecurityDetails(securityDetails.filter((s) => s !== item));
  };

  const handleCreateProperty = async () => {
    if (!title || !description || !price || !size || !address || !propertyType || !category || coordinates.lat === 0) {
      Alert.alert("Error", "Please fill all required fields and select location.");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("size", size);
      formData.append("address", address);
      formData.append("propertytype", propertyType);
      formData.append("category", category);
      formData.append("amenities", JSON.stringify(amenities));
      formData.append("coordinates", JSON.stringify(coordinates));
      formData.append("securityScore", securityScore);
      formData.append("securityDetails", JSON.stringify(securityDetails));

      images.forEach((uri, idx) => {
        formData.append("images", {
          uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
          name: `prop_${idx}.jpg`,
          type: "image/jpeg",
        });
      });

      await axios.post(`${BASE_URL}/property`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });

      Alert.alert("Success", "Property listed successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error?.response?.data?.message || "Failed to list property.");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, icon, ...props }) => (
    <View className="mb-4">
      <Text className="text-[#14213D] font-black text-xs uppercase mb-2 ml-1">{label}</Text>
      <View className="flex-row items-center bg-white rounded-2xl border border-gray-100 px-4 py-1 shadow-sm">
        <MaterialCommunityIcons name={icon} size={20} color="#94A3B8" />
        <TextInput
          placeholderTextColor="#94A3B8"
          className="flex-1 px-3 py-3 text-[#14213D] font-bold"
          {...props}
        />
      </View>
    </View>
  );

  const ChoiceButton = ({ label, value, selected, onSelect, icon }) => (
    <TouchableOpacity
      onPress={() => onSelect(value)}
      className={`flex-row items-center px-4 py-3 rounded-2xl border-2 flex-1 ${
        selected === value ? "bg-[#14213D] border-[#14213D]" : "bg-white border-gray-50"
      }`}
    >
      <MaterialCommunityIcons name={icon} size={18} color={selected === value ? "#FCA311" : "#94A3B8"} />
      <Text className={`ml-2 font-black text-xs ${selected === value ? "text-white" : "text-gray-400"}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="bg-[#14213D] px-6 pt-4 pb-8 rounded-b-[30px] flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-white/10 rounded-full">
            <MaterialCommunityIcons name="chevron-left" size={26} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-black">List Property</Text>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAwareScrollView
          className="flex-1 px-6 pt-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          {/* Images Section */}
          <Text className="text-[#14213D] font-black text-xs uppercase mb-3 ml-1">Property Media ({images.length}/10)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 h-[110px]">
            {images.map((uri, idx) => (
              <View key={idx} className="relative mr-3 shadow-md">
                <Image source={{ uri }} className="w-24 h-24 rounded-2xl" />
                <TouchableOpacity
                  onPress={() => removeImage(idx)}
                  className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 border-2 border-white"
                >
                  <MaterialCommunityIcons name="close" size={14} color="white" />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 10 && (
              <TouchableOpacity
                onPress={pickImage}
                className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 bg-white items-center justify-center"
              >
                <MaterialCommunityIcons name="camera-plus-outline" size={32} color="#94A3B8" />
                <Text className="text-[10px] font-bold text-gray-400 mt-1">Add Image</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Basic Details */}
          <InputField label="Property Title" icon="format-title" value={title} onChangeText={setTitle} placeholder="Modern Luxury Villa" />
          <InputField label="Description" icon="text-subject" value={description} onChangeText={setDescription} placeholder="Tell us about your property..." multiline style={{ height: 100, textAlignVertical: 'top' }} />

          <View className="flex-row gap-4">
            <View className="flex-1">
              <InputField label="Price (KSh)" icon="currency-usd" value={price} onChangeText={setPrice} placeholder="50,000" keyboardType="numeric" />
            </View>
            <View className="flex-1">
              <InputField label="Size (sqft)" icon="ruler-square" value={size} onChangeText={setSize} placeholder="1,200" keyboardType="numeric" />
            </View>
          </View>

          <InputField label="Address" icon="map-marker-outline" value={address} onChangeText={setAddress} placeholder="Nairobi West, South C" />

          {/* Type & Category */}
          <Text className="text-[#14213D] font-black text-xs uppercase mb-3 ml-1">Offer Type</Text>
          <View className="flex-row gap-3 mb-6">
            <ChoiceButton label="For Rent" value="Rent" selected={propertyType} onSelect={setPropertyType} icon="key-variant" />
            <ChoiceButton label="For Sale" value="Sale" selected={propertyType} onSelect={setPropertyType} icon="hand-coin-outline" />
          </View>

          <Text className="text-[#14213D] font-black text-xs uppercase mb-3 ml-1">Category</Text>
          <View className="flex-row gap-2 mb-6">
            {["Apartment", "House", "Studio"].map(cat => (
              <ChoiceButton key={cat} label={cat} value={cat} selected={category} onSelect={setCategory} icon={cat === "Apartment" ? "office-building" : cat === "House" ? "home" : "door-open"} />
            ))}
          </View>

          {/* Amenities */}
          <Text className="text-[#14213D] font-black text-xs uppercase mb-2 ml-1">Amenities</Text>
          <View className="flex-row bg-white rounded-2xl border border-gray-100 p-2 mb-3 shadow-sm">
            <TextInput
              placeholder="Add amenity (e.g. WiFi)"
              className="flex-1 px-3 py-2 font-bold text-[#14213D]"
              value={amenityInput}
              onChangeText={setAmenityInput}
              onSubmitEditing={addAmenity}
            />
            <TouchableOpacity onPress={addAmenity} className="bg-[#14213D] px-5 py-2 rounded-xl justify-center">
              <Text className="text-white font-black text-xs uppercase">Add</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap mb-6">
            {amenities.map(a => (
              <View key={a} className="bg-blue-50 px-4 py-2 rounded-full mr-2 mb-2 flex-row items-center">
                <Text className="text-[#14213D] font-bold text-xs">{a}</Text>
                <TouchableOpacity onPress={() => removeAmenity(a)} className="ml-2">
                  <MaterialCommunityIcons name="close-circle" size={16} color="#14213D" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Security details section */}
          <Text className="text-[#14213D] font-black text-xs uppercase mb-2 ml-1">Security Details</Text>
          <InputField label="Security Score (1-10)" icon="shield-check" value={securityScore} onChangeText={setSecurityScore} placeholder="Score from 1 to 10" keyboardType="numeric" />
          
          <View className="flex-row bg-white rounded-2xl border border-gray-100 p-2 mb-3 shadow-sm">
            <TextInput
              placeholder="Add security feature (e.g. CCTV)"
              className="flex-1 px-3 py-2 font-bold text-[#14213D]"
              value={securityInput}
              onChangeText={setSecurityInput}
              onSubmitEditing={addSecurityDetail}
            />
            <TouchableOpacity onPress={addSecurityDetail} className="bg-[#14213D] px-5 py-2 rounded-xl justify-center">
              <Text className="text-white font-black text-xs uppercase">Add</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap mb-6">
            {securityDetails.map(s => (
              <View key={s} className="bg-red-50 px-4 py-2 rounded-full mr-2 mb-2 flex-row items-center">
                <Text className="text-[#14213D] font-bold text-xs">{s}</Text>
                <TouchableOpacity onPress={() => removeSecurityDetail(s)} className="ml-2">
                  <MaterialCommunityIcons name="close-circle" size={16} color="#14213D" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Map Section */}
          <Text className="text-[#14213D] font-black text-xs uppercase mb-3 ml-1">Property Location</Text>
          <View className="h-56 rounded-[28px] overflow-hidden border-4 border-white shadow-lg mb-8">
            <MapView
              provider={PROVIDER_GOOGLE}
              style={StyleSheet.absoluteFillObject}
              mapType="satellite"
              initialRegion={{
                latitude: -1.2921,
                longitude: 36.8219,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              onPress={(e) => setCoordinates({ lat: e.nativeEvent.coordinate.latitude, lng: e.nativeEvent.coordinate.longitude })}
            >
              {coordinates.lat !== 0 && (
                <Marker coordinate={{ latitude: coordinates.lat, longitude: coordinates.lng }} />
              )}
            </MapView>
            <View className="absolute bottom-4 left-4 right-4 bg-white/90 p-3 rounded-2xl items-center shadow-lg">
              <Text className="text-[#14213D] font-black text-[10px] uppercase">
                {coordinates.lat === 0 ? "Tap the map to set location" : "LOCATION SET ✅"}
              </Text>
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleCreateProperty}
            disabled={loading}
            className={`py-5 rounded-[24px] shadow-xl ${loading ? 'bg-gray-400' : 'bg-[#14213D] shadow-blue-900/40'}`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-black text-lg text-center uppercase tracking-widest">List Property</Text>
            )}
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  );
}
