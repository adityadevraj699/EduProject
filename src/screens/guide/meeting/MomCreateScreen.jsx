import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, TextInput, 
  ActivityIndicator, Alert, StatusBar, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from '../../../context/AuthContext';
import { createMomApi, getMeetingAndMembersApi } from '../../../services/meetingApi';

export default function CreateMomScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { meetingId } = route.params;

  // States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [meetingData, setMeetingData] = useState(null);
  const [summary, setSummary] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [attendanceList, setAttendanceList] = useState([]);

  // Fetch initial data on mount
  useEffect(() => {
    if (user?.token && meetingId) {
      fetchInitialData();
    }
  }, [meetingId, user?.token]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const response = await getMeetingAndMembersApi(user.token, meetingId);
      

      if (response.success && response.data) {
        const serverData = response.data;
        
        // 1. Set Meeting Metadata (Title, Team Name, etc.)
        setMeetingData(serverData);
        
        // 2. Set existing MOM if available
        if (serverData.mom) {
          setSummary(serverData.mom.summary || '');
          setNextSteps(serverData.mom.next_steps || '');
        }

        // 3. Map Students for Attendance
        if (serverData.members) {
          const initialAttendance = serverData.members.map(member => ({
            user_id: member.user_id,
            name: member.name,
            roll_number: member.roll_number,
            present: 1, // Defaulting everyone to Present (1)
            remarks: member.attendance_remark || ''
          }));
          setAttendanceList(initialAttendance);
        }
      }
    } catch (err) {
     
      Alert.alert("Error", "Could not load meeting details.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (index) => {
    const updatedList = [...attendanceList];
    // Toggle 1 to 0 or 0 to 1
    updatedList[index].present = updatedList[index].present === 1 ? 0 : 1;
    setAttendanceList(updatedList);
  };

  const handleSubmit = async () => {
    if (!summary.trim()) {
      return Alert.alert("Required", "Please provide a brief summary of the meeting.");
    }

    try {
      setSubmitting(true);
      
      const payload = {
        summary: summary.trim(),
        next_steps: nextSteps.trim(),
        remarks: "Submitted via Mobile App",
        attendance_list: attendanceList.map(a => ({
          user_id: a.user_id,
          present: a.present === 1, // Sending boolean for backend
          remarks: a.remarks || ""
        }))
      };

      

      const res = await createMomApi(user.token, meetingId, payload);
      
      if (res.success) {
        Alert.alert("Success 🎉", "Minutes of Meeting and Attendance saved.");
        navigation.goBack(); 
      }
    } catch (err) {
      Alert.alert("Submission Failed", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <View className="flex-1 justify-center items-center bg-[#F5F1E6]">
      <ActivityIndicator size="large" color="#E2B35E" />
      <Text className="mt-4 text-[#A0A0A0] font-bold text-xs uppercase tracking-widest">Syncing Team Data...</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F5F1E6]">
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={{ 
        paddingTop: insets.top + 10, 
        paddingBottom: 15, 
        paddingHorizontal: 20, 
        backgroundColor: 'white', 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderBottomWidth: 1, 
        borderBottomColor: '#E5E5E5' 
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-[#F8F8F8] rounded-full mr-4">
          <Ionicons name="close" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-[10px] text-[#E2B35E] font-black tracking-widest uppercase">Create MOM</Text>
          <Text className="text-lg font-bold text-[#1A1A1A]" numberOfLines={1}>
            {meetingData?.title || "Loading..."}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}>
          
          {/* TEAM INFO */}
          <View className="bg-white p-5 rounded-[28px] border border-[#E5E5E5] mb-6 flex-row items-center">
            <View className="bg-[#1A1A1A] w-12 h-12 rounded-2xl items-center justify-center mr-4">
              <MaterialCommunityIcons name="account-group" size={24} color="#E2B35E" />
            </View>
            <View className="flex-1">
              <Text className="text-[#A0A0A0] text-[10px] font-bold uppercase">Assigned Team</Text>
              <Text className="text-[#1A1A1A] font-black text-base">{meetingData?.team_name || "N/A"}</Text>
            </View>
          </View>

          {/* ATTENDANCE SECTION */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between px-1 mb-4">
               <Text className="text-lg font-black text-[#1A1A1A]">Attendance</Text>
               <Text className="text-[10px] font-bold text-[#A0A0A0] uppercase">{attendanceList.length} Members</Text>
            </View>

            {attendanceList.map((item, index) => (
              <TouchableOpacity 
                key={item.user_id} 
                onPress={() => toggleAttendance(index)} 
                activeOpacity={0.7} 
                className="bg-white p-4 rounded-[22px] mb-3 flex-row items-center border border-[#E5E5E5]"
              >
                <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${item.present ? 'bg-green-100' : 'bg-red-100'}`}>
                   <Ionicons 
                    name={item.present ? "checkmark-circle" : "close-circle"} 
                    size={24} 
                    color={item.present ? "#16A34A" : "#DC2626"} 
                   />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-[#1A1A1A]">{item.name}</Text>
                  <Text className="text-[10px] text-[#A0A0A0] uppercase">{item.roll_number}</Text>
                </View>
                <View className={`px-3 py-1 rounded-lg ${item.present ? 'bg-green-50' : 'bg-red-50'}`}>
                  <Text className={`text-[9px] font-black ${item.present ? 'text-green-600' : 'text-red-600'}`}>
                    {item.present ? "PRESENT" : "ABSENT"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* MOM FORM */}
          <View className="mb-6 bg-[#1A1A1A] p-6 rounded-[32px] shadow-xl">
            <View className="mb-5">
              <Text className="text-white/40 text-[9px] font-bold mb-2 ml-1 uppercase tracking-widest">Meeting Summary</Text>
              <TextInput
                multiline
                numberOfLines={4}
                placeholder="What did you discuss in the meeting?"
                placeholderTextColor="#555"
                className="bg-[#222] p-4 rounded-2xl text-white font-medium border border-[#333]"
                style={{ textAlignVertical: 'top', minHeight: 120 }}
                value={summary}
                onChangeText={setSummary}
              />
            </View>

            <View>
              <Text className="text-white/40 text-[9px] font-bold mb-2 ml-1 uppercase tracking-widest">Next Steps / Action Items</Text>
              <TextInput
                multiline
                numberOfLines={3}
                placeholder="Tasks assigned to the team..."
                placeholderTextColor="#555"
                className="bg-[#222] p-4 rounded-2xl text-white font-medium border border-[#333]"
                style={{ textAlignVertical: 'top', minHeight: 80 }}
                value={nextSteps}
                onChangeText={setNextSteps}
              />
            </View>
          </View>

          {/* SUBMIT BUTTON */}
          <TouchableOpacity 
            onPress={handleSubmit} 
            disabled={submitting}
            activeOpacity={0.8}
            className={`bg-[#E2B35E] py-5 rounded-[24px] items-center mb-10 ${submitting ? 'opacity-50' : ''}`}
            style={{ elevation: 5, shadowColor: '#E2B35E', shadowOpacity: 0.3, shadowRadius: 10 }}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <View className="flex-row items-center">
                <Text className="mr-2 font-black tracking-widest text-white uppercase">Save Minutes</Text>
                <Ionicons name="chevron-forward" size={18} color="white" />
              </View>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}