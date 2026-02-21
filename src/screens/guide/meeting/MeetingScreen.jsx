import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, 
  StatusBar, StyleSheet, RefreshControl 
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// Context aur API imports
import { useAuth } from '../../../context/AuthContext'; 
import { getAllMeetingsByGuideApi } from '../../../services/meetingApi';

export default function MeetingScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth(); 
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [allMeetings, setAllMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const loadData = async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const response = await getAllMeetingsByGuideApi(user.token);
      if (response.success) {
        const meetingData = response.data;
        setAllMeetings(meetingData);
        setFilteredMeetings(meetingData);

        const uniqueTeams = Array.from(new Set(meetingData.map(m => m.team_name)))
          .map(teamName => ({ label: teamName, value: teamName }));

        setTeams([{ label: "All Squads", value: null }, ...uniqueTeams]);
      }
    } catch (err) {
      console.error("Fetch Error:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user?.token])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleTeamChange = (item) => {
    setSelectedTeam(item.value);
    if (item.value === null) {
      setFilteredMeetings(allMeetings);
    } else {
      setFilteredMeetings(allMeetings.filter(m => m.team_name === item.value));
    }
  };

  const renderMeetingCard = ({ item }) => {
    const isCompleted = item.meeting_status === 'COMPLETED';
    const isMomCreated = item.mom_status === 'CREATED';

    return (
      <View className="bg-white p-5 rounded-[28px] mb-5 shadow-sm border border-[#E5E5E5]">
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1 mr-2">
            <Text className="text-[#1A1A1A] font-black text-lg leading-6">{item.subject}</Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${isCompleted ? 'bg-green-100' : 'bg-orange-100'}`}>
            <Text className={`text-[9px] font-bold uppercase ${isCompleted ? 'text-green-600' : 'text-orange-600'}`}>
              {item.meeting_status}
            </Text>
          </View>
        </View>

        <View className="mb-4">
          <View className="flex-row items-center mb-1.5">
            <Ionicons name="people-outline" size={14} color="#E2B35E" />
            <Text className="text-[#6B6B6B] text-[12px] ml-2 font-medium">{item.team_name}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="folder-open-outline" size={14} color="#A0A0A0" />
            <Text className="text-[#A0A0A0] text-[11px] ml-2" numberOfLines={1}>{item.project_title}</Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center border-t border-[#F5F1E6] pt-4">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="calendar-clock" size={16} color="#1A1A1A" />
            <Text className="text-[#1A1A1A] font-bold text-[11px] ml-1">
              {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </Text>
          </View>

          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => {
              if (isMomCreated) {
                navigation.navigate('ViewMOM', { meetingId: item.meeting_id });
              } else {
                navigation.navigate('CreateMOM', { meetingId: item.meeting_id });
              }
            }}
            className={`px-5 py-2.5 rounded-2xl flex-row items-center ${isMomCreated ? 'bg-[#1A1A1A]' : 'bg-[#E2B35E]'}`}
          >
            <Ionicons name={isMomCreated ? "document-text" : "add-circle"} size={14} color="white" />
            <Text className="text-white font-bold text-[11px] ml-2 uppercase">
              {isMomCreated ? "View MOM" : "Create MOM"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F1E6' }}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      <View style={{ paddingTop: insets.top + 10, paddingBottom: 20 }} className="px-6 bg-white shadow-sm">
        <Text className="text-[#E2B35E] font-bold text-[10px] tracking-[2px] uppercase">Academic Portal</Text>
        <Text className="text-[#1A1A1A] text-3xl font-black leading-tight">Meetings</Text>
      </View>

      <View className="px-6 mt-5">
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={teams}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Filter by Squad"
          searchPlaceholder="Search team name..."
          value={selectedTeam}
          onChange={handleTeamChange}
          renderLeftIcon={() => (
            <Ionicons style={{ marginRight: 10 }} color="#E2B35E" name="search" size={18} />
          )}
        />
      </View>

      {loading && !refreshing ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#E2B35E" />
          <Text className="text-[#A0A0A0] mt-3 font-medium">Fetching meetings...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMeetings}
          keyExtractor={(item) => item.meeting_id.toString()}
          renderItem={renderMeetingCard}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 10, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#E2B35E"]} tintColor="#E2B35E" />
          }
          ListEmptyComponent={
            <View className="items-center mt-20">
              <MaterialCommunityIcons name="calendar-blank-outline" size={70} color="#D1D1D1" />
              <Text className="text-[#A0A0A0] mt-4 font-bold text-lg">No meetings found</Text>
            </View>
          }
        />
      )}

      {/* FLOATING ACTION BUTTON (FAB) */}
      <TouchableOpacity 
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('CreateMeeting')}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 60,
    backgroundColor: 'white',
    borderRadius: 22,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    elevation: 4,
  },
  placeholderStyle: { fontSize: 14, color: '#A0A0A0', fontWeight: '500' },
  selectedTextStyle: { fontSize: 14, color: '#1A1A1A', fontWeight: 'bold' },
  inputSearchStyle: { borderRadius: 15, fontSize: 14 },
  // FAB Styling
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 30, // Agar Bottom Tabs hain toh isse thoda aur upar (+ insets.bottom) kar sakte hain
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: '#E2B35E'
  }
});