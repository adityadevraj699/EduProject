import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, 
  StatusBar, SafeAreaView 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getMeetingDetailsApi } from '../../../services/meetingApi'; 
import { useAuth } from '../../../context/AuthContext';

export default function ViewMomScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { meetingId } = route.params; 
  const { user } = useAuth(); // Context se user le rahe hain

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    // Agar user aur token available hai tabhi call karein
    if (user?.token) {
      fetchDetails();
    }
  }, [meetingId, user?.token]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      // ⭐ Sabse important: Yahan user.token pass karna hai
      const response = await getMeetingDetailsApi(user.token, meetingId); 
      
      if (response.success) {
        setDetails(response.data);
      }
    } catch (error) {
      console.error("Detail Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F5F1E6]">
        <ActivityIndicator size="large" color="#E2B35E" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F5F1E6]">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-white shadow-sm">
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          className="p-2 rounded-xl bg-[#F5F5F5]"
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text className="text-lg font-black text-[#1A1A1A]">Meeting Details</Text>
        <View className="w-10" /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="px-5">
        
        {/* Meeting Info Card */}
        <View className="bg-white p-6 rounded-[32px] my-5 shadow-sm border border-[#E5E5E5]">
          <Text className="text-2xl font-black text-[#1A1A1A] mb-3">{details?.subject}</Text>
          <View className="flex-row items-center mb-2">
            <MaterialCommunityIcons name="calendar-month" size={18} color="#E2B35E" />
            <Text className="text-[#666] ml-2 font-bold text-sm">
              {details?.date ? new Date(details.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : "N/A"}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="people" size={18} color="#E2B35E" />
            <Text className="text-[#666] ml-2 font-bold text-sm">{details?.team_name}</Text>
          </View>
        </View>

        {/* MOM Summary Section */}
        <View className="mb-6">
          <Text className="text-base font-black text-[#1A1A1A] mb-3 ml-1 uppercase">Minutes of Meeting</Text>
          <View className="bg-white p-6 rounded-[24px] border-l-4 border-[#E2B35E] shadow-sm">
            <Text className="text-[10px] font-black text-[#E2B35E] mb-1 uppercase">Summary</Text>
            <Text className="text-[#444] text-[15px] leading-6 mb-4">{details?.mom_summary || "No summary provided."}</Text>
            
            {details?.next_steps && (
              <>
                <View className="h-[1px] bg-[#EEE] mb-4" />
                <Text className="text-[10px] font-black text-[#E2B35E] mb-1 uppercase">Next Steps</Text>
                <Text className="text-[#444] text-[15px] leading-6">{details?.next_steps}</Text>
              </>
            )}
          </View>
        </View>

        {/* Attendance Section */}
        <View className="mb-10">
          <Text className="text-base font-black text-[#1A1A1A] mb-3 ml-1 uppercase">Attendance List</Text>
          {details?.attendance_list?.map((student, index) => (
            <View key={index} className="flex-row justify-between items-center bg-white p-4 rounded-[20px] mb-3 border border-[#E5E5E5]">
              <View>
                <Text className="text-[#1A1A1A] font-bold text-[15px]">{student.name}</Text>
                <Text className="text-[#999] text-[11px] mt-1">{student.enrollment_no}</Text>
              </View>
              <View 
                className={`px-4 py-1.5 rounded-full ${student.status === 'PRESENT' ? 'bg-green-100' : 'bg-red-100'}`}
              >
                <Text 
                   className={`text-[10px] font-black ${student.status === 'PRESENT' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {student.status}
                </Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}