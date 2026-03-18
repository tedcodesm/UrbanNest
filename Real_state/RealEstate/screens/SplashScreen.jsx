import { Text, View, StatusBar, ImageBackground } from "react-native";
import { useEffect } from "react";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("drawer"); 
    }, 2000); 

    return () => clearTimeout(timer); 
  }, [navigation]);

  return (
    <View className="flex-1 w-full relative">
      <StatusBar barStyle="light-content" backgroundColor="#14213D" />

      <ImageBackground
        source={require("../assets/apartment1.jpg")}
        className="flex-1 w-full justify-center items-center"
      >
        <View className="absolute inset-0 bg-black opacity-40" />

        <View className="absolute inset-0 justify-between px-4 pb-20">
          <View className="items-center mt-12">
            <Text className="text-white font-bold text-2xl font-serif">
              EstateFlow
            </Text>
          </View>

          <View className="gap-4">
            <Text className="text-white font-semibold text-5xl font-serif">
              All-in-one
            </Text>
            <Text className="text-white font-semibold text-5xl font-serif">
              Real Estate
            </Text>
            <Text className="text-white font-semibold text-5xl font-serif">
              Platform
            </Text>

            <Text className="text-white text-lg mt-4">
              Discover our exceptional properties crafted as masterpieces with
              lasting value for clients.
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default SplashScreen;
