import React, { useState, useCallback } from 'react';
import { 
  View, Text, FlatList, TextInput, TouchableOpacity, 
  ActivityIndicator, StatusBar, RefreshControl, Platform 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 👈 Notch handle karne ke liye
import { useAuth } from '../../../context/AuthContext';
import { getGuideTeamsApi } from '../../../services/api';
import { Ionicons } from "@expo/vector-icons";

export default function TeamListScreen({ navigation }) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets(); // 👈 Top spacing nikalne ke liye
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeams = async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const response = await getGuideTeamsApi(user.token);
      if (response.success) {
        setTeams(response.data);
        setFilteredTeams(response.data);
      }
    } catch (error) {
      console.error("Fetch Error:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTeams();
    }, [user?.token])
  );

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = teams.filter(item => 
      item.team_name.toLowerCase().includes(text.toLowerCase()) || 
      item.project_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredTeams(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTeams();
  };

  if (loading && !refreshing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F1E6' }}>
        <ActivityIndicator size="large" color="#E2B35E" />
        <Text style={{ marginTop: 10, color: '#6B6B6B' }}>Loading your teams...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F1E6' }}>
      {/* StatusBar ko translucent rakhein taaki color uniform rahe */}
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      {/* 🚀 HEADER SECTION: insets.top ka use karke My Teams ko niche laya */}
      <View style={{ paddingTop: insets.top + 10 }} className="px-6 pb-2">
        <Text className="text-3xl font-extrabold text-[#1A1A1A]">My Teams</Text>
        <Text className="text-[#6B6B6B] text-base mb-4">Monitor your projects</Text>

        {/* SEARCH BAR */}
        <View className="flex-row items-center bg-white px-4 py-3 rounded-2xl shadow-sm border border-[#E5E5E5] mb-4">
          <Ionicons name="search-outline" size={20} color="#A0A0A0" />
          <TextInput
            placeholder="Search team or project..."
            placeholderTextColor="#A0A0A0"
            className="flex-1 ml-3 text-[#333]"
            value={search}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredTeams}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
        keyExtractor={(item) => item.team_id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#E2B35E"]} />}
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('TeamDetails', { teamId: item.team_id })}
            className="bg-white p-5 rounded-[25px] mb-4 shadow-sm border border-[#E5E5E5]"
          >
            <View className="flex-row justify-between mb-2">
              <View className="flex-1">
                <Text className="text-xl font-bold text-[#1A1A1A]">{item.team_name}</Text>
                <Text className="text-[#6B6B6B] text-sm italic">{item.project_name}</Text>
              </View>
              <View className={`px-3 py-1 rounded-full h-6 ${item.project_status === 'COMPLETED' ? 'bg-green-100' : 'bg-orange-100'}`}>
                <Text className={`text-[10px] font-bold ${item.project_status === 'COMPLETED' ? 'text-green-600' : 'text-orange-600'}`}>
                  {item.project_status}
                </Text>
              </View>
            </View>

            <View className="h-[1px] bg-[#F5F1E6] my-3" />

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="people" size={16} color="#E2B35E" />
                <Text className="text-[#333] font-semibold ml-2">{item.total_members} Members</Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={24} color="#E2B35E" />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}