import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../config/Ip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { optimizeImage } from "../utils/imageHandler";

const PropertyScreen = () => {
  const navigation = useNavigation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProperties = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `${BASE_URL}/property/landlord/myproperty`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProperties(res.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, [])
  );

  const filteredProperties = properties.filter((property) =>
    property.title.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("details", { propertyId: item._id })
      }
      className="bg-white rounded-[20px] mb-4 overflow-hidden border border-gray-100"
      style={{
        shadowColor: "#14213D",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <Image
        className="h-44 w-full"
        source={
          item.images?.[0]
            ? { uri: optimizeImage(item.images[0], 600) }
            : require("../assets/apartment.jpg")
        }
        resizeMode="cover"
      />

      {/* Badges */}
      <View className="absolute top-3 left-3 flex-row items-center gap-2">
        <View
          className={`px-3 py-1 rounded-full ${
            item.available ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <Text className="text-white text-[10px] font-black uppercase">
            {item.available ? "Active" : "Occupied"}
          </Text>
        </View>
        <View className="bg-white/90 px-3 py-1 rounded-full">
          <Text className="text-gray-800 text-[10px] font-black uppercase">
            {item.propertytype}
          </Text>
        </View>
      </View>

      <View className="p-4">
        <Text className="text-lg font-black text-[#14213D]" numberOfLines={1}>
          {item.title}
        </Text>

        <View className="flex-row items-center mt-1">
          <MaterialCommunityIcons
            name="map-marker"
            size={14}
            color="#9CA3AF"
          />
          <Text className="text-gray-500 text-sm ml-1" numberOfLines={1}>
            {item.address}
          </Text>
        </View>

        <View className="flex-row justify-between items-center mt-3">
          <Text className="text-xl font-black text-[#FCA311]">
            KSh {Number(item.price).toLocaleString()}
            {item.propertytype?.toLowerCase() === "rent" && (
              <Text className="text-sm text-gray-400 font-medium"> /month</Text>
            )}
          </Text>

          <View className="bg-gray-100 px-2.5 py-1 rounded-lg">
            <Text className="text-gray-600 text-xs font-bold">
              {item.category}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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
          <Text className="text-white text-xl font-black">My Properties</Text>
          <View style={{ width: 40 }} />
        </View>

        <Text className="text-gray-300 text-center text-sm mb-4">
          {properties.length} Properties Listed
        </Text>

        {/* Search */}
        <View className="flex-row items-center bg-white/15 rounded-2xl px-4 py-3 border border-white/15">
          <MaterialCommunityIcons name="magnify" size={22} color="#E5E7EB" />
          <TextInput
            placeholder="Search properties..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            className="flex-1 ml-3 text-white"
          />
        </View>
      </View>

      {/* Property List */}
      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingTop: 16,
          paddingBottom: 100,
        }}
        ListEmptyComponent={
          <View className="items-center mt-20">
            <MaterialCommunityIcons
              name="home-city-outline"
              size={60}
              color="#D1D5DB"
            />
            <Text className="text-gray-400 mt-4 text-lg font-bold">
              No properties found
            </Text>
            <Text className="text-gray-400 mt-1 text-sm">
              Tap the + button to add your first listing
            </Text>
          </View>
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("createproperty")}
        className="absolute bottom-8 right-6 bg-[#FCA311] h-16 w-16 rounded-full justify-center items-center"
        style={{
          shadowColor: "#FCA311",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <MaterialCommunityIcons name="plus" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PropertyScreen;
