import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { logoutApi } from "../../services/api";

export default function ProfileScreen() {
  const { logout } = useAuth();

const handleLogout = async () => {
  console.log("logout......");

  await logout();   // ⭐ only this

  console.log("logout done");
};


  return (
    <View className="items-center justify-center flex-1 bg-white">
      <Text className="mb-6 text-xl">ProfileScreen</Text>

      <TouchableOpacity
        onPress={handleLogout}
        className="px-6 py-3 bg-red-500 rounded-xl"
      >
        <Text className="font-bold text-white">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
