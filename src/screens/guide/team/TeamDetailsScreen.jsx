import React, { useState, useCallback } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, 
  StatusBar, Linking, Platform 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Notch handling ke liye
import { useAuth } from '../../../context/AuthContext';
import { getTeamDetailsApi } from '../../../services/api'; 
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TeamDetailsScreen({ route, navigation }) {
  const { teamId } = route.params;
  const { user } = useAuth();
  const insets = useSafeAreaInsets(); // 👈 Important: Notch height nikalne ke liye
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await getTeamDetailsApi(user.token, teamId);
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Detail Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDetails();
    }, [teamId])
  );

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F1E6' }}>
      <ActivityIndicator size="large" color="#E2B35E" />
      <Text style={{ marginTop: 10, color: '#A0A0A0' }}>Fetching details...</Text>
    </View>
  );

  if (!data) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F1E6', padding: 40 }}>
      <Ionicons name="alert-circle-outline" size={60} color="#A0A0A0" />
      <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 10 }}>Team not found</Text>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20, backgroundColor: '#E2B35E', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10 }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F1E6' }}>
      {/* 1. Status Bar Setup */}
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      {/* 2. CUSTOM HEADER (Safe Area aware) */}
      <View 
        style={{ 
          paddingTop: insets.top + 10, // 👈 Ye notch se niche rakhega exact
          paddingBottom: 15,
          paddingHorizontal: 20,
          backgroundColor: 'white',
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E5E5',
          // Shadow for better UI
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}
      >
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={{ padding: 8, backgroundColor: '#F8F8F8', borderRadius: 50, marginRight: 15 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10, color: '#E2B35E', fontWeight: 'bold', letterSpacing: 1 }}>TEAM PORTAL</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' }} numberOfLines={1}>
            {data?.team_name}
          </Text>
        </View>
      </View>

      {/* 3. CONTENT AREA */}
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        
        {/* PROJECT CARD */}
        <View className="bg-white p-6 rounded-[32px] shadow-sm border border-[#E5E5E5] mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center bg-[#F5F1E6] px-3 py-1 rounded-full">
              <MaterialCommunityIcons name="rocket-launch" size={14} color="#E2B35E" />
              <Text className="text-[#E2B35E] font-bold text-[10px] ml-1 uppercase">Project Details</Text>
            </View>
            <View className={`px-3 py-1 rounded-full ${data?.project_details?.status === 'COMPLETED' ? 'bg-green-100' : 'bg-blue-100'}`}>
              <Text className={`text-[10px] font-bold ${data?.project_details?.status === 'COMPLETED' ? 'text-green-600' : 'text-blue-600'}`}>
                {data?.project_details?.status || 'ONGOING'}
              </Text>
            </View>
          </View>
          
          <Text className="text-2xl font-black text-[#1A1A1A] mb-3">{data?.project_details?.title}</Text>
          <Text className="text-[#6B6B6B] text-sm leading-6 mb-5">{data?.project_details?.description}</Text>
          
          <View className="flex-row flex-wrap mb-6">
            {data?.project_details?.technologies?.split(',').map((tech, index) => (
              <View key={index} className="bg-[#1A1A1A] px-3 py-1.5 rounded-lg mr-2 mb-2">
                <Text className="text-white text-[10px] font-bold">{tech.trim()}</Text>
              </View>
            ))}
          </View>

          <View className="flex-row justify-between border-t border-[#F5F1E6] pt-5">
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={18} color="#22C55E" />
              <View className="ml-2">
                <Text className="text-[#A0A0A0] text-[9px] font-bold">START</Text>
                <Text className="text-[#333] font-bold text-xs">{new Date(data?.project_details?.start_date).toLocaleDateString()}</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={18} color="#EF4444" />
              <View className="ml-2">
                <Text className="text-[#A0A0A0] text-[9px] font-bold">DEADLINE</Text>
                <Text className="text-[#333] font-bold text-xs">{new Date(data?.project_details?.end_date).toLocaleDateString()}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* GUIDE CARD */}
        <View className="bg-[#1A1A1A] p-5 rounded-[24px] mb-8 flex-row items-center">
          <View className="bg-[#E2B35E] w-10 h-10 rounded-full items-center justify-center mr-4">
            <Ionicons name="school" size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-[#E2B35E] text-[10px] font-bold uppercase">Guide</Text>
            <Text className="font-bold text-white">{data?.guide_details?.name}</Text>
          </View>
          <TouchableOpacity onPress={() => Linking.openURL(`mailto:${data?.guide_details?.email}`)}>
            <Ionicons name="mail-unread" size={24} color="#E2B35E" />
          </TouchableOpacity>
        </View>

        {/* TEAM MEMBERS */}
        <Text className="text-xl font-black text-[#1A1A1A] mb-5">Team Squad</Text>
        {data?.members?.map((member) => (
          <View key={member.user_id} className="bg-white p-4 rounded-[24px] mb-4 flex-row items-center border border-[#E5E5E5]">
            <View className="bg-[#F5F1E6] w-12 h-12 rounded-2xl items-center justify-center mr-4">
              <Text className="text-[#E2B35E] font-black text-lg">{member.student_name.charAt(0)}</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center">
                <Text className="font-bold text-[#1A1A1A]">{member.student_name}</Text>
                {member.is_leader === 1 && <View className="px-2 ml-2 bg-orange-100 rounded"><Text className="text-orange-600 text-[8px] font-bold">LEADER</Text></View>}
              </View>
              <Text className="text-[#6B6B6B] text-[10px]">{member.roll_number} • {member.branch_name}</Text>
            </View>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${member.contact_no}`)} className="items-center justify-center w-10 h-10 bg-green-500 rounded-full">
              <Ionicons name="call" size={18} color="white" />
            </TouchableOpacity>
          </View>
        ))}

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}