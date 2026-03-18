import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { MaterialIcons, Feather, AntDesign } from "@expo/vector-icons";
import { properties } from "../data/properties";

export default function PropertyDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { propertyId } = route.params;

  const { width } = Dimensions.get("window");

  const property = properties.find((item) => item.id === propertyId);

  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  if (!property) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">Property not found</Text>
      </View>
    );
  }

  const openModal = (index) => {
    setModalIndex(index);
    setModalVisible(true);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView>
        {/* Hero Carousel */}
        <View className="relative">
          <FlatList
            data={property.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width,
              );
              setActiveIndex(index);
            }}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => openModal(index)}>
                <Image
                  source={item}
                  style={{ width, height: 250 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
          />

          {/* Dots */}
          <View className="absolute bottom-4 w-full flex-row justify-center">
            {property.images.map((_, i) => (
              <View
                key={i}
                className={`mx-1 h-2 w-2 rounded-full ${
                  i === activeIndex ? "bg-white" : "bg-gray-400"
                }`}
              />
            ))}
          </View>

          {/* Badge */}
          <View className="absolute top-4 right-4 bg-[#14213D] px-3 py-1 rounded-full">
            <Text className="text-white font-semibold">
              {property.propertytype === "sale" ? "For Sale" : "For Rent"}
            </Text>
          </View>
        </View>

        {/* Property Info */}
        <View className="p-4">
          {/* Title & Price */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-2xl font-bold text-gray-800 flex-1">
              {property.title}
            </Text>
            <Text className="text-xl font-bold text-blue-600">
              ${property.price}
            </Text>
          </View>

          {/* Address */}
          <View className="flex-row items-center mb-3">
            <MaterialIcons name="location-on" size={20} color="gray" />
            <Text className="text-gray-600 ml-1">{property.address}</Text>
          </View>

          {/* Description */}
          <View className="bg-white p-4 rounded-lg mb-4 shadow-sm">
            <Text className="text-lg font-semibold mb-2">Description</Text>
            <Text className="text-gray-600 leading-6">
              {property.description}
            </Text>
          </View>

          {/* Property Info */}
          <View className="bg-white p-4 rounded-lg mb-4 shadow-sm">
            <Text className="text-lg font-semibold mb-3">Property Info</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500">Type</Text>
              <Text className="font-semibold">{property.propertytype}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500">Latitude</Text>
              <Text>{property.coordinates.latitude}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Longitude</Text>
              <Text>{property.coordinates.longitude}</Text>
            </View>
          </View>

          {/* Landlord Info */}
          <View className="bg-white p-4 rounded-lg mb-6 shadow-sm">
            <Text className="text-lg font-semibold mb-3">Landlord</Text>
            <View className="flex-row items-center mb-2">
              <Feather name="user" size={18} color="gray" />
              <Text className="ml-2 text-gray-700">
                {property.landlord.name}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="phone" size={18} color="gray" />
              <Text className="ml-2 text-gray-700">
                {property.landlord.contact}
              </Text>
            </View>
          </View>

          {/* Book Viewing Button */}
          <TouchableOpacity
            className="bg-[#14213D] py-4 rounded-lg items-center mb-10"
            onPress={() =>
              console.log("Book viewing for property ID:", property.id)
            }
          >
            <Text className="text-white font-bold text-lg">Book Viewing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-[#14213D] py-4 rounded-lg items-center mb-10"
            onPress={() =>
              navigation.navigate("bookvisitwithid", { property })
            }
          >
            <Text className="text-white font-bold text-lg">visitor Viewing</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Fullscreen Image Modal */}
      <Modal visible={modalVisible} transparent={true}>
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
                source={item}
                style={{ width, height: "100%" }}
                resizeMode="contain"
              />
            )}
          />

          {/* Close Button */}
          <Pressable
            className="absolute top-12 right-5 p-2 bg-gray-700 rounded-full"
            onPress={() => setModalVisible(false)}
          >
            <AntDesign name="close" size={24} color="white" />
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
