import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerActions, useNavigation, useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../config/Ip";
import { optimizeImage } from "../utils/imageHandler";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.72;

const categories = [
  { label: "All", icon: "apps", value: "all" },
  { label: "Apartment", icon: "office-building", value: "Apartment" },
  { label: "House", icon: "home", value: "House" },
  { label: "Studio", icon: "door", value: "Studio" },
];

const HomeScreen = () => {
  const { name, authenticated, loading: authLoading } = useContext(AuthContext);
  const navigation = useNavigation();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Apartment");

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/property`);
      setProperties(res.data);
    } catch (error) {
      console.log("Error fetching properties:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, [])
  );

  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F9FAFB]">
        <ActivityIndicator size="large" color="#14213D" />
      </View>
    );
  }

  const filteredProperties =
    activeCategory === "all"
      ? properties
      : properties.filter(
          (p) => p.category?.toLowerCase() === activeCategory.toLowerCase()
        );

  const featuredProperties = properties.slice(0, 6);

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB] relative">
      <StatusBar barStyle="light-content" backgroundColor="#14213D" />

      {/* Header */}
      <View className="bg-[#14213D] px-5 pt-4 pb-8 rounded-b-[32px]">
        <View className="flex-row justify-between items-center mb-5">
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            className="p-2 bg-white/10 rounded-full"
          >
            <MaterialCommunityIcons name="menu" size={26} color="white" />
          </TouchableOpacity>

          <View className="items-center flex-1 mx-4">
            <Text className="text-gray-300 text-sm font-medium">
              Welcome back
            </Text>
            <Text className="text-white text-xl font-black tracking-tight">
              {name ? name : "Guest"}
            </Text>
          </View>

          <TouchableOpacity className="p-2 bg-white/10 rounded-full border border-white/10">
            <MaterialCommunityIcons
              name="bell-outline"
              size={22}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        {authenticated ? (
          <TouchableOpacity
            onPress={() => navigation.navigate("disc")}
            className="flex-row bg-white/15 rounded-2xl items-center px-4 py-3.5 border border-white/20"
          >
            <MaterialCommunityIcons name="magnify" size={24} color="#E5E7EB" />
            <Text className="ml-3 text-gray-300 font-medium text-base">
              Search for dream homes...
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <View className="flex-row items-center">
              <View className="bg-[#FCA311]/20 p-3 rounded-xl">
                <MaterialCommunityIcons
                  name="heart-outline"
                  size={22}
                  color="#FCA311"
                />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-white text-base font-bold">
                  Save your favorite homes
                </Text>
                <Text className="text-gray-300 text-sm mt-0.5">
                  Login to save & compare listings
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className="bg-white mt-4 rounded-xl py-3 flex-row justify-center items-center"
              onPress={() => navigation.navigate("login")}
            >
              <MaterialCommunityIcons name="login" size={18} color="#14213D" />
              <Text className="text-[#14213D] font-bold text-sm ml-2">
                Login or Create Account
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Promo Banner */}
        <View className="mx-5 mt-5">
          <ImageBackground
            source={require("../assets/dark.jpg")}
            imageStyle={{ borderRadius: 20 }}
            className="overflow-hidden"
          >
            <View className="bg-black/40 px-5 py-5 rounded-[20px] flex-row justify-between items-center">
              <View className="flex-1 mr-4">
                <View className="bg-[#FCA311] self-start px-3 py-1 rounded-full mb-2">
                  <Text className="text-white text-xs font-black">
                    LIMITED OFFER
                  </Text>
                </View>
                <Text className="font-black text-white text-2xl">
                  Save 15%
                </Text>
                <Text className="text-gray-200 text-sm mt-1">
                  Sign up now for exclusive deals
                </Text>
              </View>

            </View>
          </ImageBackground>
        </View>

        {/* Categories */}
        <View className="mt-6 px-5">
          <Text className="text-[#14213D] text-xl font-black mb-4">
            Browse Categories
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-1"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <TouchableOpacity
                  key={cat.value}
                  onPress={() => setActiveCategory(cat.value)}
                  className={`mr-3 px-5 py-3 rounded-2xl flex-row items-center border ${
                    isActive
                      ? "bg-[#14213D] border-[#14213D]"
                      : "bg-white border-gray-200"
                  }`}
                  style={{
                    shadowColor: isActive ? "#14213D" : "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isActive ? 0.3 : 0.06,
                    shadowRadius: 6,
                    elevation: isActive ? 6 : 2,
                  }}
                >
                  <MaterialCommunityIcons
                    name={cat.icon}
                    size={20}
                    color={isActive ? "white" : "#6B7280"}
                  />
                  <Text
                    className={`ml-2 font-bold text-sm ${
                      isActive ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Nearby / Filtered Properties */}
        <View className="mt-6 px-5">
          <Text className="font-black text-xl text-[#14213D] mb-4">
            {activeCategory === "all"
              ? "All Properties"
              : `${activeCategory} Properties`}
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#FCA311" />
          ) : filteredProperties.length === 0 ? (
            <View className="items-center py-10">
              <MaterialCommunityIcons
                name="home-city-outline"
                size={50}
                color="#D1D5DB"
              />
              <Text className="text-gray-400 mt-3 text-base font-medium">
                No properties found
              </Text>
            </View>
          ) : (
            filteredProperties.slice(0, 8).map((property) => (
              <TouchableOpacity
                key={property._id}
                onPress={() =>
                  navigation.navigate("details", {
                    propertyId: property._id,
                  })
                }
                className="bg-white rounded-[20px] mb-4 flex-row overflow-hidden border border-gray-100"
                style={{
                  shadowColor: "#14213D",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Image
                  source={{
                    uri: optimizeImage(
                      property.images?.[0] ||
                      "https://via.placeholder.com/200",
                      400
                    ),
                  }}
                  style={{ width: 120, height: 120 }}
                  resizeMode="cover"
                />
                <View className="flex-1 p-4 justify-between">
                  <View>
                    <Text
                      className="text-base font-bold text-[#14213D]"
                      numberOfLines={1}
                    >
                      {property.title}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <MaterialCommunityIcons
                        name="map-marker"
                        size={14}
                        color="#9CA3AF"
                      />
                      <Text
                        className="text-gray-500 text-xs ml-1"
                        numberOfLines={1}
                      >
                        {property.address}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row justify-between items-center mt-2">
                    <Text className="text-[#FCA311] font-black text-base">
                      KSh {Number(property.price).toLocaleString()}
                      {property.propertytype?.toLowerCase() === "rent" && (
                        <Text className="text-gray-400 text-xs font-medium">
                          /mo
                        </Text>
                      )}
                    </Text>
                    <View className="flex-row items-center bg-gray-100 px-2 py-1 rounded-lg">
                      <View
                        className={`w-1.5 h-1.5 rounded-full mr-1 ${
                          property.propertytype?.toLowerCase() === "rent"
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }`}
                      />
                      <Text className="text-[10px] font-bold text-gray-600 uppercase">
                        {property.propertytype}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Featured Properties */}

        <View className="mt-6">
          <View className="flex-row justify-between items-center px-5 mb-4">
            <Text className="font-black text-xl text-[#14213D]">
              Featured Properties
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("disc")}>
              <Text className="font-bold text-[#FCA311] text-sm">See All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View className="h-48 justify-center items-center">
              <ActivityIndicator size="large" color="#FCA311" />
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
            >
              {featuredProperties.map((property) => (
                <TouchableOpacity
                  key={property._id}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate("details", {
                      propertyId: property._id,
                    })
                  }
                  className="bg-white rounded-[22px] mr-4 overflow-hidden border border-gray-100"
                  style={{
                    width: CARD_WIDTH,
                    shadowColor: "#14213D",
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    elevation: 6,
                  }}
                >
                  <View className="relative">
                    <Image
                      source={{
                        uri: optimizeImage(
                          property.images?.[0] ||
                          "https://via.placeholder.com/400",
                          600
                        ),
                      }}
                      style={{ width: CARD_WIDTH, height: 160 }}
                      resizeMode="cover"
                    />
                    <View className="absolute top-3 left-3 bg-white/95 px-3 py-1 rounded-full flex-row items-center">
                      <View
                        className={`w-2 h-2 rounded-full mr-1.5 ${
                          property.propertytype?.toLowerCase() === "rent"
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }`}
                      />
                      <Text className="text-[11px] font-black text-gray-800 uppercase">
                        For {property.propertytype}
                      </Text>
                    </View>
                    <TouchableOpacity className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full">
                      <MaterialCommunityIcons
                        name="heart-outline"
                        size={18}
                        color="#FCA311"
                      />
                    </TouchableOpacity>
                  </View>

                  <View className="px-4 py-3.5">
                    <Text
                      className="text-base font-black text-[#14213D]"
                      numberOfLines={1}
                    >
                      {property.title}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <MaterialCommunityIcons
                        name="map-marker"
                        size={14}
                        color="#9CA3AF"
                      />
                      <Text
                        className="text-gray-500 text-xs ml-1 font-medium"
                        numberOfLines={1}
                      >
                        {property.address}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center mt-2.5">
                      <Text className="text-[#FCA311] text-lg font-black">
                        KSh {Number(property.price).toLocaleString()}
                        {property.propertytype?.toLowerCase() === "rent" && (
                          <Text className="text-gray-400 text-xs font-medium">
                            /mo
                          </Text>
                        )}
                      </Text>
                      <View className="bg-gray-100 px-2.5 py-1 rounded-lg">
                        <Text className="text-gray-600 text-[11px] font-bold">
                          {property.category}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>


      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
