import React, { useEffect, useState, useContext } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "../config/Ip";
import { useSocket } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const MessagingScreen = ({ route }) => {
  const propertyId = route?.params?.propertyId;
  const { socket } = useSocket();
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  if (!propertyId) {
    return (
      <SafeAreaView className="flex-1 bg-[#F9FAFB] justify-center items-center">
        <MaterialCommunityIcons
          name="chat-alert"
          size={50}
          color="#D1D5DB"
        />
        <Text className="text-gray-400 mt-3 text-lg font-bold">
          No conversation selected
        </Text>
      </SafeAreaView>
    );
  }

  useEffect(() => {
    const fetchMessages = async () => {
      const token = await AsyncStorage.getItem("token");
      try {
        const res = await axios.get(
          `${BASE_URL}/messages/property/${propertyId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(res.data.messages || []);
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    };
    fetchMessages();
  }, [propertyId]);

  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    return () => socket.off("newMessage");
  }, [socket]);

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/messages/send/property/${propertyId}`,
        { content: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender?._id === user?._id || item.sender === user?._id;

    return (
      <View
        className={`max-w-[78%] mb-3 ${isMe ? "self-end" : "self-start"}`}
      >
        {/* Sender name (for others) */}
        {!isMe && item.sender?.username && (
          <Text className="text-gray-400 text-[11px] font-semibold mb-1 ml-3">
            {item.sender.username}
          </Text>
        )}

        <View
          className={`px-4 py-3 rounded-[20px] ${
            isMe
              ? "bg-[#14213D] rounded-tr-md"
              : "bg-white rounded-tl-md border border-gray-100"
          }`}
          style={
            !isMe
              ? {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.04,
                  shadowRadius: 4,
                  elevation: 1,
                }
              : {}
          }
        >
          <Text
            className={`text-[15px] leading-[22px] ${
              isMe ? "text-white" : "text-gray-800"
            }`}
          >
            {item.content}
          </Text>
        </View>

        {/* Timestamp */}
        <Text
          className={`text-[10px] mt-1 text-gray-400 ${
            isMe ? "text-right mr-2" : "ml-3"
          }`}
        >
          {item.createdAt
            ? new Date(item.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      {/* Header */}
      <View className="bg-[#14213D] px-5 py-4 flex-row items-center rounded-b-[24px]">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 bg-white/10 rounded-full mr-3"
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-white text-lg font-black">Messages</Text>
          <Text className="text-gray-300 text-xs font-medium">
            Property conversation
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        {/* Messages List */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id || Math.random().toString()}
          renderItem={renderMessage}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 10,
            flexGrow: 1,
            justifyContent: messages.length === 0 ? "center" : "flex-end",
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center">
              <MaterialCommunityIcons
                name="chat-processing-outline"
                size={40}
                color="#D1D5DB"
              />
              <Text className="text-gray-400 mt-2 font-medium">
                No messages yet. Start the conversation!
              </Text>
            </View>
          }
        />

        {/* Input */}
        <View className="px-4 py-3 bg-white border-t border-gray-100">
          <View className="flex-row items-center">
            <View className="flex-1 bg-gray-100 rounded-2xl flex-row items-center px-4 py-2">
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Type a message..."
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-gray-800 text-base"
                multiline
                style={{ maxHeight: 100 }}
              />
            </View>
            <TouchableOpacity
              onPress={handleSend}
              className="ml-3 bg-[#14213D] w-12 h-12 rounded-full items-center justify-center"
              style={{
                shadowColor: "#14213D",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 4,
              }}
            >
              <MaterialCommunityIcons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessagingScreen;