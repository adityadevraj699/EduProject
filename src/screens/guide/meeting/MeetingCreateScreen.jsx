import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, TextInput, 
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from '../../../context/AuthContext';
import { getGuideTeamsApi, getTeamDetailsApi } from '../../../services/api'; 
import { createMeetingApi } from '../../../services/meetingApi';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function MeetingCreateScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  // Modal & Detail States
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamDetails, setTeamDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Data States
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [teams, setTeams] = useState([]);

  // Form States
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [title, setTitle] = useState('');
  const [agenda, setAgenda] = useState('');
  const [mode, setMode] = useState('OFFLINE'); 
  const [location, setLocation] = useState('');
  
  // Date & Time States
  const [dateTime, setDateTime] = useState(new Date());
  const [pickerMode, setPickerMode] = useState('date');
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  // 1. Fetch All Teams for Dropdown
  const fetchTeams = async () => {
    try {
      const res = await getGuideTeamsApi(user.token);
      if (res.success) {
        const data = res.data.map(t => ({
          label: `${t.team_name} • ${t.project_name || 'N/A'}`,
          value: t.team_id
        }));
        setTeams(data);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to load teams");
    } finally {
      setLoadingTeams(false);
    }
  };

  // 2. Fetch Specific Team Details for Modal
  const fetchTeamDetails = async (teamId) => {
    try {
      setLoadingDetails(true);
      const res = await getTeamDetailsApi(user.token, teamId);
      if (res.success) {
        setTeamDetails(res.data);
        setShowTeamModal(true);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to load team details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const onChangeDateTime = (event, selectedValue) => {
    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }
    const current = selectedValue || dateTime;
    if (Platform.OS === 'android') {
      if (pickerMode === "date") {
        setDateTime(current);
        setPickerMode("time");
        setTimeout(() => setShowPicker(true), 100);
      } else {
        setDateTime(current);
        setShowPicker(false);
        setPickerMode("date");
      }
    } else {
      setDateTime(current);
      setShowPicker(false);
    }
  };

  const handleCreate = async () => {
    if (!selectedTeamId || !title.trim()) {
      Alert.alert("Required", "Please select a team and enter a title.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        team_id: selectedTeamId,
        title: title.trim(),
        agenda: agenda.trim(),
        meeting_date_time: dateTime.toISOString(),
        mode: mode,
        location: location.trim(),
        duration_minutes: 30,
        status: 'SCHEDULED'
      };

      const res = await createMeetingApi(user.token, payload);
      if (res.success) {
        Alert.alert("Success 🎉", "Meeting has been scheduled.");
        navigation.goBack();
      }
    } catch (e) {
      Alert.alert("Error", e.message || "Meeting creation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F1E6' }}>
      {/* HEADER */}
      <View style={{ paddingTop: insets.top + 10, paddingBottom: 20 }} className="px-6 bg-white border-b border-[#E5E5E5] flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 mr-4 bg-gray-100 rounded-full">
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View>
            <Text className="text-[#E2B35E] font-bold text-[10px] uppercase tracking-widest">New Session</Text>
            <Text className="text-xl font-black text-[#1A1A1A]">Schedule Meeting</Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
          
          {/* TEAM SELECTION */}
          <Text className="text-[#1A1A1A] font-bold mb-2 ml-1">Select Squad</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={teams}
            search
            labelField="label"
            valueField="value"
            placeholder={loadingTeams ? "Loading teams..." : "Choose a team"}
            value={selectedTeamId}
            onChange={item => setSelectedTeamId(item.value)}
            renderLeftIcon={() => <MaterialCommunityIcons name="account-group" size={20} color="#E2B35E" style={{marginRight: 10}} />}
          />

          {selectedTeamId && (
            <TouchableOpacity
              onPress={() => fetchTeamDetails(selectedTeamId)}
              activeOpacity={0.7}
              className="bg-[#1A1A1A] mt-4 p-4 rounded-2xl flex-row items-center justify-center shadow-md"
            >
              {loadingDetails ? (
                <ActivityIndicator color="#E2B35E" />
              ) : (
                <>
                  <Ionicons name="people" size={18} color="#E2B35E" />
                  <Text className="ml-2 font-bold text-white">View Team Members & Details</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* MEETING TITLE */}
          <View className="mt-6">
            <Text className="text-[#1A1A1A] font-bold mb-2 ml-1">Meeting Title</Text>
            <TextInput 
              className="bg-white p-4 rounded-2xl border border-[#E5E5E5] text-[#1A1A1A] font-medium"
              placeholder="e.g. Weekly Progress Review"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* MODE & LOCATION */}
          <View className="flex-row justify-between mt-6">
            <View style={{ width: '48%' }}>
                <Text className="text-[#1A1A1A] font-bold mb-2 ml-1">Mode</Text>
                <View className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden flex-row">
                    <TouchableOpacity 
                        onPress={() => setMode('OFFLINE')}
                        className={`flex-1 p-3 items-center ${mode === 'OFFLINE' ? 'bg-[#1A1A1A]' : 'bg-white'}`}>
                        <Text style={{ color: mode === 'OFFLINE' ? 'white' : '#1A1A1A', fontWeight: 'bold', fontSize: 12 }}>OFFLINE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setMode('ONLINE')}
                        className={`flex-1 p-3 items-center ${mode === 'ONLINE' ? 'bg-[#1A1A1A]' : 'bg-white'}`}>
                        <Text style={{ color: mode === 'ONLINE' ? 'white' : '#1A1A1A', fontWeight: 'bold', fontSize: 12 }}>ONLINE</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ width: '48%' }}>
                <Text className="text-[#1A1A1A] font-bold mb-2 ml-1">Location</Text>
                <TextInput 
                  className="bg-white p-3.5 rounded-2xl border border-[#E5E5E5] text-[#1A1A1A]"
                  placeholder={mode === 'ONLINE' ? "G-Meet Link" : "Lab / Cabin"}
                  value={location}
                  onChangeText={setLocation}
                />
            </View>
          </View>

          {/* DATE & TIME */}
          <View className="mt-6">
            <Text className="text-[#1A1A1A] font-bold mb-2 ml-1">Date & Time</Text>
            <TouchableOpacity
              onPress={() => { setPickerMode('date'); setShowPicker(true); }}
              className="bg-white p-4 rounded-2xl border border-[#E5E5E5] flex-row items-center"
            >
              <Ionicons name="calendar-outline" size={20} color="#E2B35E" style={{marginRight: 10}} />
              <Text className="text-[#1A1A1A] font-medium">
                {dateTime.toLocaleString('en-IN', { 
                  day: '2-digit', month: 'short', year: 'numeric', 
                  hour: '2-digit', minute: '2-digit', hour12: true 
                })}
              </Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={dateTime}
                mode={Platform.OS === 'ios' ? 'datetime' : pickerMode}
                is24Hour={false}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeDateTime}
                minimumDate={new Date()}
              />
            )}
          </View>

          {/* AGENDA */}
          <View className="mt-6">
            <Text className="text-[#1A1A1A] font-bold mb-2 ml-1">Agenda (Optional)</Text>
            <TextInput 
              multiline
              numberOfLines={4}
              className="bg-white p-4 rounded-2xl border border-[#E5E5E5] text-[#1A1A1A]"
              placeholder="What will you discuss?"
              textAlignVertical="top"
              style={{ minHeight: 100 }}
              value={agenda}
              onChangeText={setAgenda}
            />
          </View>

          {/* SUBMIT */}
          <TouchableOpacity 
            onPress={handleCreate}
            disabled={submitting}
            activeOpacity={0.8}
            className={`mt-10 mb-10 bg-[#E2B35E] p-5 rounded-3xl items-center shadow-lg ${submitting ? 'opacity-50' : ''}`}
          >
            {submitting ? <ActivityIndicator color="white" /> : <Text className="font-black tracking-widest text-white uppercase">Schedule Session</Text>}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* TEAM DETAILS MODAL */}
      <Modal visible={showTeamModal} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <View style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            padding: 24,
            maxHeight: '75%',
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <View>
                <Text style={{ fontSize: 10, color: '#E2B35E', fontWeight: 'bold', letterSpacing: 1 }}>SQUAD OVERVIEW</Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' }}>Team Details</Text>
              </View>
              <TouchableOpacity onPress={() => setShowTeamModal(false)} style={{ backgroundColor: '#F5F1E6', padding: 8, borderRadius: 50 }}>
                <Ionicons name="close" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {teamDetails && (
                <View>
                  <View style={{ backgroundColor: '#F9F9F9', padding: 16, borderRadius: 20, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#E2B35E' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#1A1A1A' }}>{teamDetails.team_name}</Text>
                    <Text style={{ color: '#666', marginTop: 4 }}>
                      <MaterialCommunityIcons name="rocket-launch" size={14} color="#E2B35E" /> {teamDetails.project_details?.title}
                    </Text>
                    <Text style={{ color: '#777', fontSize: 12, marginTop: 4 }}>
                      Guide: {teamDetails.guide_details?.name}
                    </Text>
                  </View>

                  <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#1A1A1A', marginBottom: 12 }}>TEAM MEMBERS ({teamDetails.members?.length || 0})</Text>

                  {teamDetails.members?.map((member, index) => (
                    <View key={index} style={{ 
                      flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', 
                      padding: 12, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#F0F0F0' 
                    }}>
                      <View style={{ backgroundColor: '#F5F1E6', width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                        <Text style={{ color: '#E2B35E', fontWeight: 'bold', fontSize: 16 }}>
                          {member.student_name?.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', color: '#1A1A1A' }}>{member.student_name}</Text>
                        <Text style={{ color: '#888', fontSize: 12 }}>{member.student_email}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = {
  dropdown: {
    height: 55,
    backgroundColor: 'white',
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  placeholderStyle: { fontSize: 14, color: '#A0A0A0' },
  selectedTextStyle: { fontSize: 14, color: '#1A1A1A', fontWeight: 'bold' },
};


