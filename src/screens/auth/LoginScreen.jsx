import React, { useState,useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

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
  Modal,
  Animated
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Expo users ke liye default hai
import { loginApi } from "../../services/api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);


  const { login } = useContext(AuthContext);

  // Custom Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    status: "error", // 'success' or 'error'
  });

  const triggerAlert = (title, message, status = "error") => {
    setAlertConfig({ title, message, status });
    setModalVisible(true);
  };

  const handleLogin = async () => {
    const formattedEmail = email.trim().toLowerCase();
    console.info("login aaya hai....f")
    //navigation.replace("MainTabs");

    // 1. Domain Check (@mitmeerut.ac.in)
    // if (!formattedEmail.endsWith("@mitmeerut.ac.in")) {
    //   triggerAlert("Invalid Domain", "Please use your official college email (@mitmeerut.ac.in).", "error");
    //   return;
    // }

    if (password.length < 6) {
      triggerAlert("Security Issue", "Password must be at least 6 characters.", "error");
      return;
    }

    try {
      setLoading(true);
      
          const data = await loginApi(email, password);

          console.log("LOGIN RESPONSE", data);

    // token store
         await login(data);
         await AsyncStorage.setItem("token", data.token);
        

      // 2. Success Scenario
      //triggerAlert("Welcome!", "Login Successful. Redirecting...", "success");
      navigation.replace("MainTabs");

    } catch (err) {
      triggerAlert("Login Failed", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F1E6]">
      <StatusBar barStyle="dark-content" />

      {/* --- CUSTOM POPUP MODAL --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="items-center justify-center flex-1 px-6 bg-black/40">
          <View className="bg-white w-full max-w-sm p-6 rounded-[30px] items-center shadow-2xl">
            <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${alertConfig.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
              <Ionicons 
                name={alertConfig.status === 'success' ? "checkmark-circle" : "alert-circle"} 
                size={50} 
                color={alertConfig.status === 'success' ? "#10b981" : "#ef4444"} 
              />
            </View>
            
            <Text className="text-2xl font-bold text-[#1A1A1A] mb-2">{alertConfig.title}</Text>
            <Text className="text-[#6B6B6B] text-center text-base mb-8 px-2">
              {alertConfig.message}
            </Text>

            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              className={`w-full py-4 rounded-2xl items-center ${alertConfig.status === 'success' ? 'bg-[#10b981]' : 'bg-[#E2B35E]'}`}
            >
              <Text className="text-lg font-bold text-white">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="items-center flex-1 px-8 pt-10 pb-10">
            
            {/* Branding */}
            <Image
              source={require("../../../assets/icon.png")} 
              className="mb-0 h-60 w-60"
              resizeMode="contain"
            />

            {/* Title Area */}
            <View className="w-full mb-8">
              <Text className="text-5xl font-extrabold text-[#1A1A1A] tracking-tighter">
                Welcome Back
              </Text>
              <Text className="text-[#6B6B6B] text-lg mt-1">Log in to continue your journey</Text>
            </View>

            {/* Inputs */}
            <View className="w-full space-y-4">
              <View>
                <Text className="text-[#333] font-semibold mb-2 ml-1">Email Address</Text>
                <TextInput
                  placeholder="e.g. name@mitmeerut.ac.in"
                  placeholderTextColor="#A0A0A0"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="w-full bg-white px-5 py-4 rounded-2xl text-[#333] shadow-sm border border-[#E5E5E5]"
                />
              </View>

              <View>
                <Text className="text-[#333] font-semibold mb-2 ml-1">Password</Text>
                <View className="flex-row items-center bg-white rounded-2xl shadow-sm border border-[#E5E5E5]">
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#A0A0A0"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                    className="flex-1 px-5 py-4 text-[#333]"
                  />
                  <TouchableOpacity 
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="pr-5"
                  >
                    <Ionicons 
                      name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="#A0A0A0" 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Forgot Pass */}
            <TouchableOpacity 
              onPress={() => navigation.navigate("ForgotPassword")}
              className="self-end px-1 mt-4"
            >
              <Text className="text-[#4A90E2] font-bold text-sm">Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={loading}
              className={`w-full py-5 rounded-2xl mt-10 items-center shadow-lg ${
                loading ? "bg-[#D4A650]" : "bg-[#E2B35E]"
              }`}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-xl font-bold text-white">Sign In</Text>}
            </TouchableOpacity>

            {/* Footer */}
            <View className="items-center pt-10 mt-auto">
              <Text className="text-[#9E9E9E] text-[11px] font-bold tracking-[3px] uppercase">
                Eduproject
              </Text>
              <Text className="text-[#BDBDBD] text-[10px] mt-1">v1.0.0.0</Text>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}