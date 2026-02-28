import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, ActivityIndicator, TextInput, 
  TouchableOpacity, Dimensions, StatusBar, Linking 
} from "react-native";
import { Ionicons, FontAwesome5, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getStudentPublicProfileApi } from "../../../services/publicProfileApi";

const { width } = Dimensions.get("window");

const PublicScreen = ({ route }) => {
  const insets = useSafeAreaInsets();
  const initialEmail = route?.params?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (initialEmail) fetchProfile(initialEmail);
  }, [initialEmail]);

  const fetchProfile = async (targetEmail = email) => {
    if (!targetEmail) return;
    try {
      setLoading(true);
      const res = await getStudentPublicProfileApi(targetEmail);
      if (res.success) setData(res.data);
    } catch (e) {
      console.log("public profile error", e.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const student = data?.student;
  const analytics = data?.analytics;

  // Contact Actions
  const makeCall = () => {
    if (student?.contact_no) Linking.openURL(`tel:${student.contact_no}`);
  };

  const openWhatsApp = () => {
    if (student?.contact_no) Linking.openURL(`whatsapp://send?phone=${student.contact_no}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F1E6" }}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* HEADER & SEARCH BAR */}
        <View style={{ paddingTop: insets.top + 20 }} className="px-6 pb-8 bg-white rounded-b-[50px] shadow-sm">
          <Text className="text-[#E2B35E] text-[10px] font-black uppercase tracking-[3px] mb-2 text-center">Scholar Verification</Text>
          <View className="flex-row items-center bg-[#F5F1E6] rounded-3xl px-5 py-2 border border-[#E5E5E5]">
            <Feather name="search" size={18} color="#A0A0A0" />
            <TextInput
              placeholder="Student email address..."
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              className="flex-1 ml-3 text-[#1A1A1A] font-bold text-sm h-10"
            />
            <TouchableOpacity onPress={() => fetchProfile()} className="bg-[#1A1A1A] w-10 h-10 rounded-2xl items-center justify-center shadow-lg">
              <Ionicons name="arrow-forward" size={20} color="#E2B35E" />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View className="items-center mt-20">
            <ActivityIndicator size="large" color="#E2B35E" />
            <Text className="text-[#A0A0A0] text-[10px] font-black mt-4 uppercase tracking-widest">Compiling Data...</Text>
          </View>
        ) : student ? (
          <View className="px-6 mt-6">
            
            {/* 1. CONTRIBUTION SCORE CARD */}
            <View className="bg-[#1A1A1A] rounded-[45px] p-8 shadow-2xl relative overflow-hidden">
                <View className="absolute -right-10 -top-10 w-40 h-40 bg-[#E2B35E] opacity-10 rounded-full" />
                <View className="items-center">
                    <Text className="text-white/40 text-[9px] font-black uppercase tracking-[3px]">Contribution Performance Index</Text>
                    <View className="flex-row items-baseline mt-2">
                        <Text className="text-6xl font-black text-white">{analytics?.contribution?.score ?? "0"}</Text>
                        <Text className="text-[#E2B35E] text-xl font-bold ml-1">pts</Text>
                    </View>
   
                </View>
            </View>

            {/* 2. FULL STUDENT IDENTITY CARD */}
            <View className="bg-white rounded-[40px] p-8 mt-8 border border-[#E5E5E5] shadow-sm">
                <View className="items-center">
                    <View className="w-24 h-24 bg-[#F5F1E6] rounded-[35px] items-center justify-center border-4 border-white shadow-md">
                        <FontAwesome5 name="user-check" size={35} color="#1A1A1A" />
                    </View>
                    <Text className="text-2xl font-black text-[#1A1A1A] mt-5 text-center">{student?.name}</Text>
                    <Text className="text-[#E2B35E] font-bold text-xs uppercase tracking-widest mt-1">ID: {student?.roll_number || "N/A"}</Text>
                </View>

                {/* Info Detail Grid */}
                <View className="flex-row flex-wrap justify-between mt-8">
                    <DetailTile label="Branch" value={student?.branch_name} icon="git-branch" />
                    <DetailTile label="Semester" value={student?.semester_name} icon="layers" />
                    <DetailTile label="Section" value={student?.section_name} icon="grid" />
                    <DetailTile label="Contact" value={student?.contact_no} icon="phone" />
                </View>

                {/* Communication Actions */}
                <View className="flex-row items-center justify-between mt-8 pt-6 border-t border-[#F5F1E6]">
                    <TouchableOpacity onPress={makeCall} className="flex-row items-center justify-center flex-1 h-14 bg-[#1A1A1A] rounded-2xl mr-2">
                        <Feather name="phone-call" size={18} color="#E2B35E" />
                        <Text className="text-white font-black ml-3 uppercase text-[10px] tracking-widest">Call Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openWhatsApp} className="flex-row items-center justify-center flex-1 h-14 bg-[#25D36620] rounded-2xl ml-2 border border-[#25D36640]">
                        <MaterialCommunityIcons name="whatsapp" size={20} color="#25D366" />
                        <Text className="text-[#25D366] font-black ml-2 uppercase text-[10px] tracking-widest">Message</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* 3. CORE METRICS BREAKDOWN ($T_c, A_r, P_a, O_r$) */}
            <View className="bg-white rounded-[40px] p-8 mt-6 border border-[#E5E5E5] shadow-sm">
                <View className="flex-row items-center mb-8">
                    <MaterialCommunityIcons name="chart-box-outline" size={22} color="#E2B35E" />
                    <Text className="ml-3 font-black text-lg text-[#1A1A1A]">Formula Metrics</Text>
                </View>
                
                <View className="flex-row flex-wrap justify-between">
                    <StatBox label="Project Exp" value={analytics?.projects?.total_projects} sub="Count" />
                    <StatBox label="Task Completion" value={analytics?.contribution_explained?.Tc} sub="Tc" />
                    <StatBox label="Attendance" value={analytics?.contribution_explained?.Ar} sub="Ar" />
                    <StatBox label="Activity Pa" value={analytics?.contribution_explained?.Pa} sub="Pa" />
                    <StatBox label="Overdue Or" value={analytics?.contribution_explained?.Or} sub="Or" isNeg />
                    <StatBox label="Total Meet" value={analytics?.attendance?.total_meetings} sub="Count" />
                </View>
            </View>

            {/* 4. TASK & ATTENDANCE STATUS COUNTERS */}
            <View className="bg-[#1A1A1A] rounded-[40px] p-8 mt-6">
                <Text className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-6 text-center">Status Counters</Text>
                <View className="flex-row justify-between mb-8">
                    <CounterItem label="COMPLETED" value={analytics?.tasks?.completed} color="#4ADE80" />
                    <CounterItem label="ONGOING" value={analytics?.tasks?.in_progress} color="#E2B35E" />
                    <CounterItem label="OVERDUE" value={analytics?.tasks?.overdue} color="#F87171" />
                </View>
                <View className="flex-row justify-around pt-6 border-t border-white/5">
                    <View className="items-center">
                        <Text className="text-lg font-black text-white">{analytics?.attendance?.attended}</Text>
                        <Text className="text-white/40 text-[7px] font-bold uppercase tracking-widest">Attended</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-lg font-black text-white">{analytics?.attendance?.missed}</Text>
                        <Text className="text-red-400 text-[7px] font-bold uppercase tracking-widest">Absent</Text>
                    </View>
                </View>
            </View>

          </View>
        ) : (
          <View className="items-center px-10 mt-20">
              <MaterialCommunityIcons name="account-search-outline" size={60} color="#D1D1D1" />
              <Text className="text-[#A0A0A0] text-center font-bold text-[11px] mt-4 uppercase tracking-[2px]">Enter a scholar email to verify their project contributions.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

/* --- REUSABLE COMPONENTS --- */

const DetailTile = ({ label, value, icon }) => (
    <View className="w-[48%] flex-row items-center mb-6">
        <View className="w-9 h-9 rounded-xl bg-[#F5F1E6] items-center justify-center">
            <Feather name={icon} size={14} color="#E2B35E" />
        </View>
        <View className="flex-1 ml-3">
            <Text className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">{label}</Text>
            <Text className="text-[11px] font-black text-[#1A1A1A]" numberOfLines={1}>{value || "N/A"}</Text>
        </View>
    </View>
);

const StatBox = ({ label, value, sub, isNeg }) => (
    <View className="w-[48%] bg-[#F5F1E6] p-4 rounded-[25px] mb-3">
        <Text className="text-[8px] font-bold text-gray-400 uppercase mb-1">{label}</Text>
        <View className="flex-row items-baseline">
            <Text className={`text-xl font-black ${isNeg && value > 0 ? 'text-red-500' : 'text-[#1A1A1A]'}`}>
                {value}
            </Text>
            <Text className="text-[8px] font-bold text-gray-400 ml-1 uppercase">{sub}</Text>
        </View>
    </View>
);

const CounterItem = ({ label, value, color }) => (
    <View className="items-center">
        <Text style={{ color }} className="text-3xl font-black">{value}</Text>
        <Text className="text-white/40 text-[8px] font-bold uppercase tracking-widest mt-1">{label}</Text>
    </View>
);

export default PublicScreen;