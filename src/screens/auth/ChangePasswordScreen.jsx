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

export default function ChangePasswordScreen({ navigation, route }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Custom Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: "", message: "", status: "error" });

  const triggerAlert = (title, message, status = "error") => {
    setAlertConfig({ title, message, status });
    setModalVisible(true);
  };

  const handleChangePassword = async () => {
    // Basic Validations
    if (!password || !confirm) {
      triggerAlert("Empty Fields", "Please fill both password fields.", "error");
      return;
    }

    if (password !== confirm) {
      triggerAlert("Mismatch", "Passwords do not match. Please check again.", "error");
      return;
    }

    if (password.length < 6) {
      triggerAlert("Too Short", "Password must be at least 6 characters.", "error");
      return;
    }

    try {
      setLoading(true);
      
      // Backend Call (Assuming you have this endpoint)
      // const response = await fetch("https://your-api.com/auth/reset-password", { ... });

      // Simulating Success for Design
      setTimeout(() => {
        setLoading(false);
        triggerAlert("Success", "Your password has been reset successfully!", "success");
        
        setTimeout(() => {
          setModalVisible(false);
          navigation.replace("Login");
        }, 2000);
      }, 1500);

    } catch (err) {
      setLoading(false);
      triggerAlert("Error", err.message, "error");
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
                name={alertConfig.status === 'success' ? "key" : "alert-circle"} 
                size={45} 
                color={alertConfig.status === 'success' ? "#10b981" : "#ef4444"} 
              />
            </View>
            <Text className="text-2xl font-bold text-[#1A1A1A] mb-2">{alertConfig.title}</Text>
            <Text className="text-[#6B6B6B] text-center text-base mb-8 px-2">{alertConfig.message}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-[#E2B35E] w-full py-4 rounded-2xl items-center">
              <Text className="text-lg font-bold text-white">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} bounces={false}>
          <View className="items-center flex-1 px-8 pt-10 pb-6">
            
            {/* Logo */}
            <Image
              source={require("../../../assets/icon.png")} 
              className="mb-4 w-60 h-60"
              resizeMode="contain"
            />

            {/* Header Text */}
            <View className="w-full mb-8">
              <Text className="text-4xl font-extrabold text-[#000000] tracking-tighter">
                Set New Password
              </Text>
              <Text className="text-[#6B6B6B] text-lg mt-2 font-medium">
                Create a strong password to protect your account
              </Text>
            </View>

            {/* Input Section */}
            <View className="w-full gap-4 space-y-4">
              {/* New Password */}
              <View className="flex-row items-center bg-white rounded-2xl shadow-sm border border-[#E5E5E5]">
                <TextInput
                  placeholder="New Password"
                  placeholderTextColor="#A0A0A0"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                  className="flex-1 px-5 py-4 text-[#333]"
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} className="pr-5">
                  <Ionicons name={showPass ? "eye-outline" : "eye-off-outline"} size={20} color="#A0A0A0" />
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <View className="flex-row items-center bg-white rounded-2xl shadow-sm border border-[#E5E5E5]">
                <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor="#A0A0A0"
                  value={confirm}
                  onChangeText={setConfirm}
                  secureTextEntry={!showConfirm}
                  className="flex-1 px-5 py-4 text-[#333]"
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} className="pr-5">
                  <Ionicons name={showConfirm ? "eye-outline" : "eye-off-outline"} size={20} color="#A0A0A0" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Change Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleChangePassword}
              disabled={loading}
              className={`w-full py-5 rounded-2xl mt-10 items-center shadow-lg ${loading ? "bg-[#D4A650]" : "bg-[#E2B35E]"}`}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-xl font-bold text-white">Update Password</Text>
              )}
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity onPress={() => navigation.navigate("Login")} className="mt-8">
              <Text className="text-[#4A90E2] font-bold text-base">Back To Login</Text>
            </TouchableOpacity>

            {/* Footer Version */}
            <View className="items-center pt-10 mt-auto">
              <Text className="text-[#9E9E9E] text-[11px] font-bold tracking-[3px] uppercase">
                Eduproject
              </Text>
              <Text className="text-[#BDBDBD] text-[10px] mt-1">
                v1.0.0.0
              </Text>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}