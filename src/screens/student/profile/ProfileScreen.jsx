import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons, FontAwesome5, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../../../context/AuthContext";
import { getMyProfileApi } from "../../../services/profileApi";
import { useNavigation } from "@react-navigation/native";

export default function StudentProfileScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-[#F5F1E6]">
        <ActivityIndicator size="large" color="#E2B35E" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F1E6" }}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* ROYAL HEADER SECTION */}
        <View className="bg-white px-6 pb-10 rounded-b-[50px] shadow-sm items-center" style={{ paddingTop: insets.top + 20 }}>
          <View className="relative">
             <View className="w-28 h-28 bg-[#F5F1E6] rounded-[40px] items-center justify-center border-4 border-white shadow-xl">
                <FontAwesome5 name="user-graduate" size={45} color="#E2B35E" />
             </View>
             <View className="absolute -bottom-2 -right-2 bg-[#1A1A1A] w-10 h-10 rounded-2xl items-center justify-center border-4 border-white">
                <Feather name="shield" size={16} color="#E2B35E" />
             </View>
          </View>

          <Text className="text-2xl font-black text-[#1A1A1A] mt-5">
            {profile?.name || "Scholar Student"}
          </Text>
          <View className="bg-[#E2B35E15] px-4 py-1.5 rounded-full mt-2">
            <Text className="text-[#E2B35E] text-[10px] font-black uppercase tracking-[2px]">
              {profile?.role || "Student"}
            </Text>
          </View>
        </View>

        <View className="px-6 -mt-8">
          {/* VIEW PUBLIC PROFILE BUTTON (The Masterpiece) */}
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => navigation.navigate("PublicProfile", { email: profile?.email })}
            className="bg-[#1A1A1A] p-6 rounded-[35px] flex-row items-center justify-between shadow-2xl overflow-hidden"
          >
             <View className="absolute -right-5 -top-5 w-20 h-20 bg-[#E2B35E] opacity-10 rounded-full" />
             <View className="flex-row items-center">
                <View className="w-12 h-12 bg-[#E2B35E] rounded-2xl items-center justify-center">
                   <Ionicons name="eye" size={22} color="white" />
                </View>
                <View className="ml-4">
                   <Text className="text-lg font-black text-white">Public Profile</Text>
                   <Text className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Share your portfolio</Text>
                </View>
             </View>
             <Feather name="arrow-up-right" size={24} color="#E2B35E" />
          </TouchableOpacity>

          {/* ACADEMIC DETAILS CARD */}
          <View className="bg-white p-7 rounded-[40px] mt-8 border border-[#E5E5E5] shadow-sm">
            <Text className="text-[#1A1A1A] font-black text-lg mb-6 tracking-tight">Academic Details</Text>
            
            <ProfileItem icon="mail" label="Institutional Email" value={profile?.email} />
            <ProfileItem icon="hash" label="Roll Number" value={profile?.roll_number} />
            <ProfileItem icon="phone" label="Contact No." value={profile?.contact_no} />
            <ProfileItem icon="git-branch" label="Branch" value={profile?.branch_name} />
            <ProfileItem icon="layers" label="Section" value={profile?.section_name} />
            <ProfileItem icon="calendar" label="Current Semester" value={profile?.semester_name} isLast />
          </View>

          {/* LOGOUT BUTTON */}
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            className="mt-8 flex-row items-center justify-center p-6 bg-red-50 rounded-[35px] border border-red-100"
          >
            <MaterialCommunityIcons name="logout-variant" size={20} color="#EF4444" />
            <Text className="font-black tracking-[3px] text-red-500 uppercase ml-3">
              Sign Out
            </Text>
          </TouchableOpacity>
          
          <Text className="text-center text-gray-400 text-[10px] mt-8 uppercase font-bold tracking-widest">
            EduProject Live • Version 2.0.1
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* HELPER COMPONENT FOR PROFILE ROWS */
function ProfileItem({ icon, label, value, isLast }) {
  return (
    <View className={`flex-row items-center ${isLast ? '' : 'mb-6'}`}>
      <View className="w-10 h-10 bg-[#F5F1E6] rounded-xl items-center justify-center">
        <Feather name={icon} size={16} color="#E2B35E" />
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">{label}</Text>
        <Text className="text-[#1A1A1A] font-black text-[14px] mt-0.5">{value || "Not Set"}</Text>
      </View>
    </View>
  );
}