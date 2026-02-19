import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { forgotPasswordApi } from "../../services/api";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Custom Alert State
  const [modalVisible, setModalVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: "", message: "", status: "error" });

  const triggerAlert = (title, message, status = "error") => {
    setAlertConfig({ title, message, status });
    setModalVisible(true);
  };

  const handleForgotPassword = async () => {
    const formattedEmail = email.trim().toLowerCase();
    //navigation.navigate("VerifyOtp", { email: formattedEmail });

    // Domain Validation
    if (!formattedEmail.endsWith("@mitmeerut.ac.in")) {
      triggerAlert("Invalid Email", "Please enter your official college email ID.", "error");
      return;
    }

    try {
      setLoading(true);
      
      // Backend API Call for OTP
      await forgotPasswordApi(formattedEmail);

      // Success Scenario
      triggerAlert("OTP Sent", "A verification code has been sent to your college email.", "success");
      
      // Delay navigation to let user read success message
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate("VerifyOtp", { email: formattedEmail });
      }, 2000);

    } catch (err) {
      triggerAlert("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F1E6]">
      <StatusBar barStyle="dark-content" />

      {/* --- CUSTOM ALERT MODAL --- */}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View className="items-center justify-center flex-1 px-6 bg-black/40">
          <View className="bg-white w-full max-w-sm p-6 rounded-[30px] items-center shadow-2xl">
            <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${alertConfig.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
              <Ionicons 
                name={alertConfig.status === 'success' ? "mail-unread" : "alert-circle"} 
                size={45} 
                color={alertConfig.status === 'success' ? "#10b981" : "#ef4444"} 
              />
            </View>
            <Text className="text-2xl font-bold text-[#1A1A1A] mb-2">{alertConfig.title}</Text>
            <Text className="text-[#6B6B6B] text-center text-base mb-8 px-2">{alertConfig.message}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-[#E2B35E] w-full py-4 rounded-2xl items-center">
              <Text className="text-lg font-bold text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} bounces={false}>
          <View className="items-center flex-1 px-8 pt-10 pb-10">
            
            {/* Logo */}
            <Image
              source={require("../../../assets/icon.png")} 
              className="mb-2 h-60 w-60"
              resizeMode="contain"
            />

            {/* Header Text */}
            <View className="w-full mb-8">
              <Text className="text-4xl font-extrabold text-[#1A1A1A] tracking-tighter">
                Reset Your Password
              </Text>
              <Text className="text-[#6B6B6B] text-lg mt-2 font-medium">
                Enter the email associated with your account
              </Text>
            </View>

            {/* Input Field */}
            <View className="w-full">
              <Text className="text-[#333] font-semibold mb-2 ml-1">College Email</Text>
              <TextInput
                placeholder="name@mitmeerut.ac.in"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="w-full bg-white px-5 py-4 rounded-2xl text-[#333] shadow-sm border border-[#E5E5E5]"
              />
            </View>

            {/* Forgot (Send OTP) Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleForgotPassword}
              disabled={loading}
              className={`w-full py-5 rounded-2xl mt-10 items-center shadow-lg ${loading ? "bg-[#D4A650]" : "bg-[#E2B35E]"}`}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-xl font-bold text-white">Forgot</Text>
              )}
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity onPress={() => navigation.goBack()} className="mt-8">
              <Text className="text-[#4A90E2] font-bold text-base">Back To Login</Text>
            </TouchableOpacity>

            {/* Footer Version */}
            <View className="items-center pt-10 mt-auto">
              <Text className="text-[#9E9E9E] text-[11px] font-bold tracking-[3px] uppercase">Eduproject</Text>
              <Text className="text-[#BDBDBD] text-[10px] mt-1">v1.0.0.0</Text>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}