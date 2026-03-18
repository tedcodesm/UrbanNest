import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "../config/Ip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { optimizeImage } from "../utils/imageHandler";

const { width } = Dimensions.get("window");

export default function DetailScreen({ route, navigation }) {
  const { propertyId } = route.params;
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleBookViewing = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setShowLoginModal(true);
      } else {
        navigation.navigate("booking", {
          propertyId,
          propertyTitle: property?.title,
        });
      }
    } catch (error) {
      console.error("Error checking login:", error.message);
    }
  };

  const handleProceedToPayment = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    navigation.navigate("rent", {
      propertyId: property._id,
      price: property.price,
      property: property,
    });
  };

  const fetchProperty = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/property/${propertyId}`);
      setProperty(res.data);
    } catch (error) {
      console.error("Error fetching property:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9FAFB]">
        <ActivityIndicator size="large" color="#FCA311" />
      </View>
    );
  }

  if (!property) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9FAFB]">
        <MaterialCommunityIcons
          name="home-alert"
          size={50}
          color="#D1D5DB"
        />
        <Text className="text-gray-400 text-lg mt-3">Property not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View className="relative">
          <FlatList
            data={property.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setActiveIndex(index);
            }}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={() => {
                  setModalIndex(index);
                  setImageModalVisible(true);
                }}
              >
                <Image
                  source={{ uri: optimizeImage(item, 800) }}
                  style={{ width, height: 300 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
          />

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-14 left-5 bg-black/40 p-2.5 rounded-full"
          >
            <MaterialIcons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>

          {/* Image Counter */}
          <View className="absolute bottom-4 left-5 bg-black/50 px-3 py-1.5 rounded-full">
            <Text className="text-white text-xs font-bold">
              {activeIndex + 1} / {property.images?.length || 0}
            </Text>
          </View>

          {/* Property Type Badge */}
          <View
            className={`absolute top-14 right-5 px-4 py-2 rounded-full ${
              property.propertytype?.toLowerCase() === "rent"
                ? "bg-blue-500"
                : "bg-green-500"
            }`}
          >
            <Text className="text-white font-black text-xs uppercase tracking-wider">
              For {property.propertytype}
            </Text>
          </View>

          {/* Dots indicator  */}
          <View className="absolute bottom-4 right-5 flex-row">
            {property.images?.map((_, i) => (
              <View
                key={i}
                className={`w-2 h-2 rounded-full mx-0.5 ${
                  i === activeIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </View>
        </View>

        {/* Content */}
        <View className="px-5 -mt-6">
          {/* Main Info Card */}
          <View
            className="bg-white rounded-[24px] p-5 border border-gray-100"
            style={{
              shadowColor: "#14213D",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1 mr-3">
                <Text className="text-2xl font-black text-[#14213D]">
                  {property.title}
                </Text>
                <View className="flex-row items-center mt-2">
                  <MaterialIcons name="location-on" size={16} color="#FCA311" />
                  <Text className="text-gray-500 ml-1 font-medium text-sm flex-1">
                    {property.address}
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-2xl font-black text-[#FCA311]">
                  KSh {Number(property.price).toLocaleString()}
                </Text>
                {property.propertytype?.toLowerCase() === "rent" && (
                  <Text className="text-gray-400 text-xs font-medium">
                    per month
                  </Text>
                )}
              </View>
            </View>

            {/* Quick Stats */}
            <View className="flex-row mt-5 bg-gray-50 rounded-2xl p-4 justify-around">
              <View className="items-center">
                <MaterialCommunityIcons
                  name="ruler-square"
                  size={22}
                  color="#14213D"
                />
                <Text className="text-[#14213D] font-bold mt-1">
                  {property.size} sqft
                </Text>
                <Text className="text-gray-400 text-xs">Size</Text>
              </View>
              <View className="w-[1px] bg-gray-200" />
              <View className="items-center">
                <MaterialCommunityIcons
                  name="tag"
                  size={22}
                  color="#14213D"
                />
                <Text className="text-[#14213D] font-bold mt-1">
                  {property.category}
                </Text>
                <Text className="text-gray-400 text-xs">Type</Text>
              </View>
              <View className="w-[1px] bg-gray-200" />
              <View className="items-center">
                <MaterialCommunityIcons
                  name={property.available ? "check-circle" : "close-circle"}
                  size={22}
                  color={property.available ? "#22C55E" : "#EF4444"}
                />
                <Text className="text-[#14213D] font-bold mt-1">
                  {property.available ? "Yes" : "No"}
                </Text>
                <Text className="text-gray-400 text-xs">Available</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View className="bg-white rounded-[20px] p-5 mt-4 border border-gray-100">
            <Text className="text-lg font-black text-[#14213D] mb-3">
              Description
            </Text>
            <Text className="text-gray-600 leading-6 text-[15px]">
              {property.description}
            </Text>
          </View>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <View className="bg-white rounded-[20px] p-5 mt-4 border border-gray-100">
              <Text className="text-lg font-black text-[#14213D] mb-3">
                Amenities
              </Text>
              <View className="flex-row flex-wrap">
                {property.amenities.map((amenity, i) => (
                  <View
                    key={i}
                    className="bg-[#14213D]/5 px-4 py-2 rounded-full mr-2 mb-2 flex-row items-center"
                  >
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={14}
                      color="#14213D"
                    />
                    <Text className="text-[#14213D] font-semibold text-sm ml-1.5">
                      {amenity}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {/* Security Details */}
          <View className="bg-white rounded-[20px] p-5 mt-4 border border-gray-100">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-black text-[#14213D]">
                Security Overview
              </Text>
              <View className="bg-green-100 px-3 py-1 rounded-full flex-row items-center">
                <MaterialCommunityIcons name="shield-check" size={16} color="#16A34A" />
                <Text className="text-[#16A34A] font-black ml-1">
                  {property.securityScore || 5}/10
                </Text>
              </View>
            </View>

            {/* Score Bar */}
            <View className="h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
              <View 
                className="h-full bg-[#FCA311]" 
                style={{ width: `${(property.securityScore || 5) * 10}%` }}
              />
            </View>

            {property.securityDetails && property.securityDetails.length > 0 ? (
              <View className="flex-row flex-wrap">
                {property.securityDetails.map((detail, i) => (
                  <View
                    key={i}
                    className="bg-red-50 px-4 py-2 rounded-full mr-2 mb-2 flex-row items-center border border-red-100"
                  >
                    <MaterialCommunityIcons
                      name="shield-lock"
                      size={14}
                      color="#EF4444"
                    />
                    <Text className="text-[#14213D] font-semibold text-sm ml-1.5">
                      {detail}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-gray-400 italic text-sm">
                Specific security details not provided for this area.
              </Text>
            )}
          </View>

          {/* Landlord Info */}
          <View className="bg-white rounded-[20px] p-5 mt-4 border border-gray-100">
            <Text className="text-lg font-black text-[#14213D] mb-3">
              Listed By
            </Text>
            <View className="flex-row items-center">
              <View className="w-14 h-14 bg-[#14213D] rounded-full items-center justify-center">
                <MaterialCommunityIcons
                  name="account"
                  size={28}
                  color="white"
                />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-[#14213D] font-bold text-base">
                  {property.landlord?.username || "Property Owner"}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Feather name="phone" size={14} color="#9CA3AF" />
                  <Text className="text-gray-500 ml-1.5 text-sm">
                    {property.landlord?.phone || "Not available"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity className="bg-[#14213D]/10 p-3 rounded-xl">
                <Feather name="phone" size={20} color="#14213D" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="mt-5 mb-10">
            {/* Primary: Book Viewing */}
            <TouchableOpacity
              className="bg-[#14213D] py-4.5 rounded-2xl items-center flex-row justify-center"
              style={{ paddingVertical: 18 }}
              onPress={handleBookViewing}
            >
              <MaterialCommunityIcons
                name="calendar-check"
                size={22}
                color="white"
              />
              <Text className="text-white font-black text-lg ml-2">
                Book Viewing
              </Text>
            </TouchableOpacity>

            {/* Secondary Actions Row */}
            <View className="flex-row mt-3 gap-3">
              <TouchableOpacity
                className="flex-1 bg-[#FCA311] py-4 rounded-2xl items-center flex-row justify-center"
                onPress={handleProceedToPayment}
              >
                <MaterialCommunityIcons
                  name="credit-card-outline"
                  size={20}
                  color="white"
                />
                <Text className="text-white font-bold text-sm ml-2">
                  Pay Now
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-white py-4 rounded-2xl items-center flex-row justify-center border border-gray-200"
                onPress={() =>
                  navigation.navigate("bookvisitwithid", { property })
                }
              >
                <MaterialCommunityIcons
                  name="shield-check"
                  size={20}
                  color="#14213D"
                />
                <Text className="text-[#14213D] font-bold text-sm ml-2">
                  Verify ID
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Login Required Modal */}
      <Modal
        visible={showLoginModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLoginModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View className="bg-[#14213D]/10 p-4 rounded-full mb-4">
              <MaterialCommunityIcons
                name="lock-outline"
                size={32}
                color="#14213D"
              />
            </View>
            <Text style={styles.modalTitle}>Login Required</Text>
            <Text style={styles.modalMessage}>
              You need to log in to proceed with this action.
            </Text>

            <View className="flex-row w-full mt-2">
              <TouchableOpacity
                className="flex-1 mr-2 bg-gray-100 py-3.5 rounded-xl items-center"
                onPress={() => setShowLoginModal(false)}
              >
                <Text className="text-gray-600 font-bold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 ml-2 bg-[#FCA311] py-3.5 rounded-xl items-center"
                onPress={() => {
                  setShowLoginModal(false);
                  navigation.navigate("login");
                }}
              >
                <Text className="text-white font-bold">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Full-Screen Image Modal */}
      <Modal visible={imageModalVisible} transparent={true}>
        <View className="flex-1 bg-black">
          <FlatList
            data={property.images}
            horizontal
            pagingEnabled
            initialScrollIndex={modalIndex}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={{ width, height: "100%" }}
                resizeMode="contain"
              />
            )}
          />

          <TouchableOpacity
            className="absolute top-14 right-5 bg-white/20 p-3 rounded-full"
            onPress={() => setImageModalVisible(false)}
          >
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#14213D",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
});
