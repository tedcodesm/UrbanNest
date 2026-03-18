import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../config/Ip"; // your backend base URL
import { optimizeImage } from "../utils/imageHandler";

export default function DiscoverScreen() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // rent, sale, all
  const navigation = useNavigation();

 
const fetchProperties = async () => {
  try {
    setLoading(true);
    const res = await axios.get(`${BASE_URL}/property`);
    setProperties(res.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

useFocusEffect(
  useCallback(() => {
    fetchProperties();
  }, [])
);

  // Filtered list
  const filteredProperties = properties.filter(
    (property) =>
      (filter === "all" || property.propertytype.toLowerCase() === filter) &&
      property.title.toLowerCase().includes(search.toLowerCase())
  );

  const renderPropertyCard = ({ item }) => (
    <TouchableOpacity
      className="bg-white rounded-[24px] mb-6 overflow-hidden border border-gray-100"
      style={{
        shadowColor: "#14213D",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
      }}
      onPress={() =>
        navigation.navigate("details", {
          propertyId: item._id,
        })
      }
    >
      <View className="relative">
        <Image
          source={{
            uri: optimizeImage(
              item.images && item.images.length > 0
                ? item.images[0]
                : "https://via.placeholder.com/400",
              600
            ),
          }}
          style={{ width: "100%", height: 220 }}
          resizeMode="cover"
        />
        {/* Floating Property Type Badge */}
        <View className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-full flex-row items-center shadow-sm">
          <View
            className={`w-2 h-2 rounded-full mr-2 ${
              item.propertytype.toLowerCase() === "rent"
                ? "bg-blue-500"
                : "bg-green-500"
            }`}
          />
          <Text className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            For {item.propertytype}
          </Text>
        </View>

        {/* Favorite Button Overlay */}
        <TouchableOpacity className="absolute top-4 right-4 bg-white/95 p-2 rounded-full shadow-sm">
          <MaterialCommunityIcons name="heart-outline" size={20} color="#FCA311" />
        </TouchableOpacity>
      </View>

      <View className="p-5">
        <View className="flex-row justify-between items-start mb-2">
          <Text
            className="text-[20px] font-extrabold text-[#14213D] flex-1 mr-3"
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text className="text-[18px] font-black text-[#FCA311]">
            KSh {item.price}
            {item.propertytype.toLowerCase() === "rent" && (
              <Text className="text-xs text-gray-500 font-medium tracking-tighter">
                /mo
              </Text>
            )}
          </Text>
        </View>

        <View className="flex-row items-center mt-1">
          <MaterialCommunityIcons name="map-marker" size={18} color="#9CA3AF" />
          <Text
            className="text-gray-500 font-medium ml-1 text-[14px] flex-1"
            numberOfLines={1}
          >
            {item.address}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      {/* Search & Filters Header */}
      <View className="bg-[#14213D] pt-14 pb-6 px-5 rounded-b-[32px] shadow-lg z-10">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white text-4xl font-black tracking-tight">
            Explore
          </Text>
          <TouchableOpacity className="p-2.5 bg-white/10 rounded-full border border-white/5">
            <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Glassmorphic Search Bar */}
        <View className="flex-row bg-white/15 rounded-2xl items-center px-4 py-3.5 border border-white/20 shadow-sm">
          <MaterialCommunityIcons name="magnify" size={24} color="#E5E7EB" />
          <TextInput
            placeholder="Search for dream homes..."
            placeholderTextColor="#D1D5DB"
            value={search}
            onChangeText={setSearch}
            className="ml-3 flex-1 text-white font-semibold text-base"
          />
        </View>

        {/* Pills */}
        <View className="flex-row mt-6 gap-x-3">
          {["all", "rent", "sale"].map((type) => {
            const isActive = filter === type;
            return (
              <TouchableOpacity
                key={type}
                onPress={() => setFilter(type)}
                className={`px-5 py-2.5 rounded-full border ${
                  isActive
                    ? "bg-[#FCA311] border-[#FCA311]"
                    : "bg-white/10 border-white/20"
                }`}
              >
                <Text
                  className={`text-sm tracking-wide ${
                    isActive ? "text-white font-extrabold" : "text-gray-200 font-semibold"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Property List */}
      <View className="flex-1 -mt-4 pt-4">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#FCA311" />
          </View>
        ) : (
          <FlatList
            data={filteredProperties}
            keyExtractor={(item) => item._id}
            renderItem={renderPropertyCard}
            contentContainerStyle={{ padding: 20, paddingTop: 10, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
