import { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  FlatList,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { GEMINI_API_KEY } from "../config/Ip";

const initialMessages = [
  { sender: "ML", message: "Hello! 👋 I'm EchoFlow, your real estate assistant. Ask me anything about current listings, virtual viewings, or pricing!" },
];

function ChatMessage({ item }) {
  const isYou = item.sender === "you";

  return (
    <View className={`max-w-[85%] mb-5 ${isYou ? "self-end" : "self-start"}`}>
      {!isYou && (
        <View className="flex-row items-center mb-1.5 ml-1">
          <View className="bg-[#14213D] w-6 h-6 rounded-full items-center justify-center">
            <MaterialCommunityIcons name="robot" size={14} color="#FCA311" />
          </View>
          <Text className="text-gray-500 text-[10px] font-black ml-2 uppercase tracking-tighter">
            EchoFlow AI
          </Text>
        </View>
      )}
      <View
        className={`px-4 py-3.5 ${
          isYou
            ? "bg-[#14213D] rounded-[24px] rounded-tr-none"
            : "bg-white rounded-[24px] rounded-tl-none border border-gray-100"
        }`}
        style={!isYou ? { elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } } : {}}
      >
        <Text
          className={`text-[15px] leading-[22px] font-medium ${
            isYou ? "text-white" : "text-[#14213D]"
          }`}
        >
          {item.message}
        </Text>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef();
  const insets = useSafeAreaInsets();

  // Tab bar is roughly 75px + 15px bottom = 90px
  const TAB_BAR_HEIGHT = 95;

  useEffect(() => {
    if (showChat) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 150);
    }
  }, [messages, showChat]);

  const makeAiInference = async (prompt) => {
    try {
      console.log("Preparing Gemini Request with prompt:", prompt);
      
      const history = messages.slice(-10).map((msg) => ({
        role: msg.sender === "you" ? "user" : "model",
        parts: [{ text: msg.message }],
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: "Context: You are EchoFlow, a helpful real estate assistant. Be professional, friendly, and concise. Only answer real estate related questions." }]
              },
              {
                role: "model",
                parts: [{ text: "Understood. I am EchoFlow. How can I assist you with real estate today?" }]
              },
              ...history,
              { role: "user", parts: [{ text: prompt }] }
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          }),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Gemini API Error Status:", response.status);
        console.error("Gemini API Error Data:", JSON.stringify(data));
        throw new Error(data.error?.message || "API Error");
      }

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!reply) {
        setMessages((prev) => [...prev, { sender: "ML", message: "I couldn't generate a response. Please try asking something else." }]);
      } else {
        setMessages((prev) => [...prev, { sender: "ML", message: reply }]);
      }
    } catch (error) {
      console.error("Chat Inference Exception:", error);
      const userFriendlyError = error.message?.includes("not found") 
        ? "The AI model is currently updating. Please try again in 30 seconds." 
        : "Error: " + (error.message || "Connection failed");
      
      setMessages((prev) => [...prev, { sender: "ML", message: userFriendlyError }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const msg = inputText.trim();
    setMessages((prev) => [...prev, { sender: "you", message: msg }]);
    setInputText("");
    setLoading(true);
    makeAiInference(msg);
  };

  if (!showChat) {
    return (
      <View className="flex-1 bg-[#14213D]">
        <SafeAreaView className="flex-1 px-8 justify-center items-center">
          <View className="bg-[#FCA311] w-24 h-24 rounded-full items-center justify-center mb-8 shadow-2xl">
            <MaterialCommunityIcons name="robot" size={54} color="white" />
          </View>
          <Text className="text-white text-4xl font-black text-center mb-4">
            Hi, I'm EchoFlow
          </Text>
          <Text className="text-blue-200 text-lg text-center mb-12 leading-7">
            Your personal AI assistant for everything EstateFlow. Ready to find your dream home?
          </Text>
          
          <TouchableOpacity
            onPress={() => setShowChat(true)}
            className="bg-[#FCA311] w-full py-5 rounded-[24px] flex-row items-center justify-center"
          >
            <Text className="text-white font-black text-xl mr-3">Start Chatting</Text>
            <MaterialCommunityIcons name="arrow-right" size={24} color="white" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
          {/* Header */}
          <View className="bg-[#14213D] px-6 py-5 flex-row items-center justify-between rounded-b-[30px]">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => setShowChat(false)}
                className="w-10 h-10 bg-white/10 rounded-full items-center justify-center mr-4"
              >
                <MaterialCommunityIcons name="chevron-left" size={28} color="white" />
              </TouchableOpacity>
              <View>
                <Text className="text-white text-xl font-black">EchoFlow AI</Text>
                <View className="flex-row items-center mt-0.5">
                  <View className="w-2 h-2 rounded-full bg-green-400 mr-2" />
                  <Text className="text-green-400 text-[10px] font-black uppercase tracking-widest">Active Now</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => <ChatMessage item={item} />}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ padding: 20, paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
          />

          {loading && (
            <View className="flex-row items-center px-8 mb-4">
              <ActivityIndicator size="small" color="#FCA311" />
              <Text className="text-gray-400 ml-3 text-xs font-bold italic">Typing...</Text>
            </View>
          )}

          {/* Input Bar — adjusted for floating tab bar */}
          <View style={{ marginBottom: TAB_BAR_HEIGHT }}>
            <View className="mx-4 mb-4 bg-white rounded-[30px] p-2 flex-row items-center border border-gray-100 shadow-sm">
              <TextInput
                className="flex-1 px-5 py-3 text-[#14213D] text-[16px]"
                placeholder="Message EchoFlow..."
                placeholderTextColor="#94A3B8"
                value={inputText}
                onChangeText={setInputText}
                multiline
                style={{ maxHeight: 100 }}
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={loading || !inputText.trim()}
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  loading || !inputText.trim() ? "bg-gray-100" : "bg-[#FCA311]"
                }`}
              >
                <MaterialCommunityIcons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}
