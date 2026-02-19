import React, { useState, useRef } from "react";
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
import { verifyOtpApi } from "../../services/api";

export default function VerifyOtpScreen({ navigation, route }) {
  // Navigation se email get karein (optional)
  const userEmail = route.params?.email || "your email";
  
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: "", message: "", status: "error" });

  const triggerAlert = (title, message, status = "error") => {
    setAlertConfig({ title, message, status });
    setModalVisible(true);
  };

  // OTP Input Handler
  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Backspace handling to go to previous box
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    navigation.navigate("ChangePassword", { email: userEmail });
    
    if (otpValue.length < 4) {
      triggerAlert("Incomplete OTP", "Please enter the full 4-digit code.", "error");
      return;
    }

    try {
      setLoading(true);
      
      
      // Backend Call
     await verifyOtpApi(userEmail, otpValue);

      triggerAlert("Verified", "OTP verified successfully!", "success");
      
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate("ChangePassword", { email: userEmail });
      }, 1500);

    } catch (err) {
      triggerAlert("Verification Failed", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F1E6]">
      <StatusBar barStyle="dark-content" />

      {/* Modern Modal */}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View className="items-center justify-center flex-1 px-6 bg-black/40">
          <View className="bg-white w-full max-w-sm p-6 rounded-[30px] items-center shadow-2xl">
            <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${alertConfig.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
              <Ionicons name={alertConfig.status === 'success' ? "shield-checkmark" : "warning"} size={40} color={alertConfig.status === 'success' ? "#10b981" : "#ef4444"} />
            </View>
            <Text className="text-xl font-bold text-[#1A1A1A] mb-2">{alertConfig.title}</Text>
            <Text className="text-[#6B6B6B] text-center mb-6">{alertConfig.message}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-[#E2B35E] w-full py-3 rounded-xl items-center">
              <Text className="font-bold text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="items-center flex-1 px-8 pt-10 pb-6">
            
            <Image source={require("../../../assets/icon.png")} className="mb-4 h-60 w-60" resizeMode="contain" />

            <View className="w-full mb-8">
              <Text className="text-5xl font-extrabold text-[#1A1A1A] tracking-tighter">Verify Your OTP</Text>
              <Text className="text-[#6B6B6B] text-lg mt-2 font-medium">Enter the 4-digit code sent to your email</Text>
            </View>

            {/* OTP Box Container */}
            <View className="flex-row justify-between w-full mb-8">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(el) => (inputs.current[index] = el)}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  maxLength={1}
                  keyboardType="numeric"
                  className="w-[70px] h-[75px] bg-white border border-[#E5E5E5] rounded-2xl text-center text-3xl font-bold text-[#333] shadow-sm"
                />
              ))}
            </View>

            <TouchableOpacity onPress={handleVerify} disabled={loading} className={`w-full py-5 rounded-2xl items-center shadow-lg ${loading ? "bg-[#D4A650]" : "bg-[#E2B35E]"}`}>
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-xl font-bold text-white">Verify</Text>}
            </TouchableOpacity>


            <TouchableOpacity onPress={() => navigation.navigate("Login")} className="mt-8">
              <Text className="text-[#4A90E2] font-medium">Back To Login</Text>
            </TouchableOpacity>

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