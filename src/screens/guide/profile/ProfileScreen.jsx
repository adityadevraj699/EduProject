import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../../context/AuthContext";
import { getMyProfileApi } from "../../../services/profileApi";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getMyProfileApi(user.token);
      if (res.success) {
        setProfile(res.data);
      }
    } catch (err) {
      console.log("Profile error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-[#F5F1E6]">
        <ActivityIndicator size="large" color="#E2B35E" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#F5F1E6]" contentContainerStyle={{ padding: 24 }}>
      
      {/* HEADER */}
      <View className="items-center mt-8">
        <View className="items-center justify-center w-24 h-24 mb-4 bg-white rounded-full shadow">
          <Ionicons name="person" size={40} color="#E2B35E" />
        </View>

        <Text className="text-xl font-black text-[#1A1A1A]">
          {profile?.name || "Guide"}
        </Text>

        <Text className="text-[#777] mt-1">
          {profile?.role}
        </Text>
      </View>

      {/* GUIDE CARD */}
      <View className="p-6 mt-8 bg-white rounded-3xl border border-[#E5E5E5]">
        
        <Item label="Email" value={profile?.email} />
        <Item label="Contact" value={profile?.contact_no} />

      </View>

      {/* LOGOUT */}
      <TouchableOpacity
        onPress={handleLogout}
        activeOpacity={0.8}
        className="mt-10 bg-[#1A1A1A] p-5 rounded-3xl items-center"
      >
        <Text className="font-black tracking-widest text-white uppercase">
          Logout
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

/* ---------- reusable row ---------- */
function Item({ label, value }) {
  return (
    <View className="mb-4">
      <Text className="text-[#777] text-xs uppercase">{label}</Text>
      <Text className="text-[#1A1A1A] font-bold mt-1">
        {value || "-"}
      </Text>
    </View>
  );
}