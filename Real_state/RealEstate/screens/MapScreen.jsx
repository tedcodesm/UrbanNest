import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { BASE_URL } from "../config/Ip";

const { width } = Dimensions.get("window");

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState(null);
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const mapRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "We need location access to show nearby properties.");
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  const fetchNearbyHouses = async () => {
    if (!userLocation) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await axios.get(`${BASE_URL}/property/nearby`, {
        params: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
      });

      setHouses(res.data);
      if (res.data.length === 0) {
        Alert.alert(
          "No Properties Found",
          "There are no houses available within a 10km radius of your current location."
        );
      }
    } catch (error) {
      console.log("Error fetching houses:", error.message);
      Alert.alert("Connection Error", "Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(userLocation, 1000);
    }
  };

  if (!userLocation) {
    return (
      <View className="flex-1 bg-[#14213D] justify-center items-center">
        <ActivityIndicator size="large" color="#FCA311" />
        <Text className="text-white mt-4 font-black">Finding your location...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <MapView
        ref={mapRef}
        provider="google"
        mapType="satellite"
        style={StyleSheet.absoluteFillObject}
        initialRegion={userLocation}
        showsUserLocation
        showsMyLocationButton={false}
        className="flex-1"
      >
        {houses.map((house) => (
          <Marker
            key={house._id}
            coordinate={{
              latitude: house.coordinates.lat,
              longitude: house.coordinates.lng,
            }}
          >
            <View className="bg-white px-2 py-1 rounded-full border-2 border-[#14213D] flex-row items-center shadow-md">
              <MaterialCommunityIcons name="home-variant" size={16} color="#FCA311" />
              <Text className="text-[#14213D] font-black text-[10px] ml-1">
                KSh {Number(house.price).toLocaleString()}
              </Text>
            </View>
            <Callout
              onPress={() => navigation.navigate("details", { propertyId: house._id })}
              tooltip
            >
              <View className="bg-white p-3 rounded-2xl w-[200px] border border-gray-100 shadow-xl">
                <Text className="font-black text-[#14213D] text-sm" numberOfLines={1}>{house.title}</Text>
                <Text className="text-gray-500 text-xs mt-1" numberOfLines={2}>{house.address}</Text>
                <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-gray-50">
                  <Text className="text-[#FCA311] font-black">KSh {Number(house.price).toLocaleString()}</Text>
                  <Text className="text-[#14213D] font-bold text-[10px] uppercase">Details →</Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Floating UI Elements */}
      <SafeAreaView className="absolute top-0 left-0 right-0 pointer-events-none">
        <View className="px-5 mt-4">
          <View className="bg-[#14213D]/90 p-4 rounded-[24px] flex-row items-center border border-white/10 shadow-lg">
            <TouchableOpacity 
              onPress={() => navigation.openDrawer()}
              className="w-10 h-10 bg-white/10 rounded-full items-center justify-center"
            >
              <MaterialCommunityIcons name="menu" size={24} color="white" />
            </TouchableOpacity>
            <View className="flex-1 ml-4">
              <Text className="text-white font-black text-lg">Nearby Finder</Text>
              <Text className="text-gray-300 text-xs">Explore properties across the city</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Bottom Controls */}
      <View className="absolute bottom-24 left-0 right-0 px-6">
        <View className="flex-row justify-between items-end">
          <TouchableOpacity
            onPress={centerOnUser}
            className="bg-white w-14 h-14 rounded-full items-center justify-center shadow-2xl border border-gray-100"
          >
            <MaterialCommunityIcons name="crosshairs-gps" size={26} color="#14213D" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={fetchNearbyHouses}
            disabled={loading}
            className="bg-[#14213D] h-14 px-8 rounded-full flex-row items-center shadow-2xl"
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="radar" size={20} color="#FCA311" className="mr-2" />
                <Text className="text-white font-black ml-2 uppercase tracking-widest text-[12px]">Search 10km Area</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {searched && houses.length === 0 && !loading && (
        <View className="absolute bottom-40 self-center bg-red-500/90 px-5 py-2 rounded-full border border-white/20">
          <Text className="text-white font-bold text-xs">No houses found within 10km</Text>
        </View>
      )}
    </View>
  );
}
