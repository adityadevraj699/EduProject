import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../../context/AuthContext";
import { getMyProfileApi } from "../../../services/profileApi";
import { useNavigation } from "@react-navigation/native";

export default function StudentProfileScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getMyProfileApi(user.token);
      if (res.success) setProfile(res.data);
    } catch (err) {
      console.log("Student profile error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  /* ⭐ OPEN PUBLIC PROFILE */
  const openPublicProfile = () => {
    if (!profile?.email) return;

    navigation.navigate("PublicProfile", {
      email: profile.email
    });
  };

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-[#F5F1E6]">
        <ActivityIndicator size="large" color="#E2B35E" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-[#F5F1E6]"
      contentContainerStyle={{ padding: 24 }}
    >
      {/* HEADER */}
      <View className="items-center mt-8">
        <View className="items-center justify-center w-24 h-24 mb-4 bg-white rounded-full shadow">
          <Ionicons name="school" size={40} color="#E2B35E" />
        </View>

        <Text className="text-xl font-black text-[#1A1A1A]">
          {profile?.name || "Student"}
        </Text>

        <Text className="text-[#777] mt-1">{profile?.role}</Text>
      </View>

      {/* STUDENT CARD */}
      <View className="p-6 mt-8 bg-white rounded-3xl border border-[#E5E5E5]">

        {/* ⭐ EMAIL CLICKABLE */}
        <TouchableOpacity onPress={openPublicProfile} activeOpacity={0.7}>
          <Item label="Email (Public Profile)" value={profile?.email} clickable />
        </TouchableOpacity>

        <Item label="Roll Number" value={profile?.roll_number} />
        <Item label="Contact" value={profile?.contact_no} />
        <Item label="Branch" value={profile?.branch_name} />
        <Item label="Section" value={profile?.section_name} />
        <Item label="Semester" value={profile?.semester_name} />
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

/* reusable row */
function Item({ label, value, clickable }) {
  return (
    <View className="mb-4">
      <Text className="text-[#777] text-xs uppercase">{label}</Text>
      <Text
        className={`font-bold mt-1 ${
          clickable ? "text-[#E2B35E]" : "text-[#1A1A1A]"
        }`}
      >
        {value || "-"}
      </Text>
    </View>
  );
}