import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, TextInput, 
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from '../../../context/AuthContext';
import { getGuideTeamsApi } from '../../../services/api'; // Path sahi kar lena
import { createMeetingApi } from '../../../services/meetingApi';

export default function MeetingCreateScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  // States
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [teams, setTeams] = useState([]);

  // Form States
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [title, setTitle] = useState('');
  const [agenda, setAgenda] = useState('');
  const [mode, setMode] = useState('OFFLINE'); // Default
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState(new Date().toISOString()); // Logic simplified

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await getGuideTeamsApi(user.token);
      if (res.success) {
        const teamData = res.data.map(t => ({
          label: t.team_name,
          value: t.team_id,
          project: t.project_name
        }));
        setTeams(teamData);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to load teams");
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleCreate = async () => {
    if (!selectedTeam || !title.trim() || !mode) {
      return Alert.alert("Required fields", "Please fill Team, Title and Mode.");
    }

    try {
      setSubmitting(true);
      const payload = {
        team_id: selectedTeam,
        title: title.trim(),
        agenda: agenda.trim(),
        meeting_date_time: dateTime,
        mode: mode,
        location: location.trim(),
        duration_minutes: 60, // Default 1 hour
      };

      const res = await createMeetingApi(user.token, payload);
      if (res.success) {
        Alert.alert("Success 🎉", "Meeting has been scheduled.");
        navigation.goBack();
      }
    } catch (err) {
      Alert.alert("Failed", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F1E6' }}>
      {/* Header */}
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
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          
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
            value={selectedTeam}
            onChange={item => setSelectedTeam(item.value)}
            renderLeftIcon={() => <MaterialCommunityIcons name="account-group" size={20} color="#E2B35E" style={{marginRight: 10}} />}
          />

          {/* TITLE */}
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

          {/* SUBMIT BUTTON */}
          <TouchableOpacity 
            onPress={handleCreate}
            disabled={submitting}
            activeOpacity={0.8}
            className={`mt-10 bg-[#E2B35E] p-5 rounded-3xl items-center shadow-lg ${submitting ? 'opacity-50' : ''}`}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-black tracking-widest text-white uppercase">Schedule Session</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
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