import React, { useEffect, useState, useCallback } from "react";
import { 
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, 
  StatusBar, RefreshControl, Dimensions 
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from "@expo/vector-icons";

import { useAuth } from "../../../context/AuthContext";
import { getGuideDashboardApi } from "../../../services/homeApi";

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);

  const loadData = async () => {
    try {
      const res = await getGuideDashboardApi(user.token);
      if (res.success) setData(res.data);
    } catch (e) {
      console.log("dashboard error", e.message);
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

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F5F1E6]">
        <ActivityIndicator size="large" color="#E2B35E" />
      </View>
    );
  }

  const attended = data?.stats?.attendance?.attended || 0;
  const missed = data?.stats?.attendance?.missed || 0;
  const total = attended + missed;
  const attendanceRate = total > 0 ? Math.round((attended / total) * 100) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F1E6' }}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      {/* MODERN HEADER */}
      <View style={{ paddingTop: insets.top + 10, paddingBottom: 20 }} className="flex-row items-center justify-between px-6 bg-white border-b border-[#F0F0F0]">
        <View>
            <View className="flex-row items-center">
                <View className="w-2 h-2 mr-2 bg-green-500 rounded-full" />
                <Text className="text-[#E2B35E] font-bold text-[10px] tracking-[2.5px] uppercase">EduProject Live</Text>
            </View>
            <Text className="text-[#1A1A1A] text-2xl font-black mt-0.5">Hello, {user?.name?.split(' ')[0] || "Guide"}</Text>
        </View>
        <TouchableOpacity 
            onPress={() => navigation.navigate("Profile")}
            className="w-12 h-12 rounded-2xl bg-[#1A1A1A] items-center justify-center shadow-lg"
        >
            <FontAwesome5 name="user-tie" size={18} color="#E2B35E" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#E2B35E"]} />}
      >
        
        {/* HERO ANALYTICS CARD */}
        <View className="px-6 mt-6">
            <View className="bg-[#1A1A1A] p-7 rounded-[40px] shadow-2xl relative overflow-hidden">
                <View className="absolute -right-5 -bottom-5 w-32 h-32 bg-[#E2B35E] opacity-10 rounded-full" />
                
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-white/60 text-[11px] font-bold uppercase tracking-widest">Team Efficiency</Text>
                        <View className="flex-row items-baseline mt-1">
                            <Text className="text-5xl font-black text-white">{attendanceRate}</Text>
                            <Text className="text-[#E2B35E] text-xl font-bold ml-1">%</Text>
                        </View>
                    </View>
                    <View className="items-center justify-center p-4 bg-white/10 rounded-3xl">
                        <Feather name="trending-up" size={24} color="#E2B35E" />
                        <Text className="text-white text-[8px] font-black mt-1 uppercase">Active</Text>
                    </View>
                </View>

                {/* Styled Progress Bar */}
                <View className="flex-row w-full h-3 mt-8 overflow-hidden border rounded-full bg-white/5 border-white/10">
                    <View style={{ width: `${attendanceRate}%` }} className="h-full bg-[#E2B35E] rounded-full" />
                </View>
                
                <View className="flex-row justify-between mt-4">
                    <View className="flex-row items-center">
                        <Ionicons name="checkmark-circle" size={14} color="#4ADE80" />
                        <Text className="text-white/80 text-[10px] font-bold ml-1">{attended} Sessions Met</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons name="alert-circle" size={14} color="#F87171" />
                        <Text className="text-white/80 text-[10px] font-bold ml-1">{missed} Unresolved</Text>
                    </View>
                </View>
            </View>
        </View>

        {/* HORIZONTAL STATS GRID */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 mt-8" contentContainerStyle={{ paddingRight: 40 }}>
            <MetricCard label="Squads" value={data?.stats?.teams} icon="users" />
            <MetricCard label="Scholars" value={data?.stats?.students} icon="graduation-cap" />
            <MetricCard label="Projects" value={data?.stats?.projects} icon="briefcase" />
            <MetricCard label="Meetings" value={data?.stats?.meetings} icon="video" />
        </ScrollView>

        {/* UPCOMING SECTION - SLIDER */}
        <View className="mt-10">
            <View className="flex-row items-center justify-between px-6 mb-5">
                <View>
                    <Text className="text-xl font-black text-[#1A1A1A]">Priority <Text className="text-[#E2B35E]">Schedule</Text></Text>
                    <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Next 24 Hours</Text>
                </View>
                <TouchableOpacity className="bg-white px-4 py-2 rounded-full border border-[#E5E5E5]">
                    <Text className="text-[10px] font-black text-[#1A1A1A] uppercase">{data?.upcoming_24h?.count || 0} Total</Text>
                </TouchableOpacity>
            </View>
            
            {data?.upcoming_24h?.list?.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 24, paddingRight: 20 }} decelerationRate="fast" snapToInterval={width * 0.78}>
                    {data.upcoming_24h.list.map(m => (
                        <HorizontalMeetingCard key={m.meeting_id} item={m} onPress={() => navigation.navigate("Meeting", { screen: "CreateMOM", params: { meetingId: m.meeting_id }})} />
                    ))}
                </ScrollView>
            ) : (
                <View className="px-6"><EmptyBox text="Your slate is clean for now!" /></View>
            )}
        </View>

        {/* MISSED RECAP - SLIDER */}
        <View className="mt-10">
            <View className="flex-row items-center justify-between px-6 mb-5">
                <Text className="text-xl font-black text-[#1A1A1A]">Action <Text className="text-red-500">Required</Text></Text>
                <Ionicons name="ellipsis-horizontal" size={20} color="#A0A0A0" />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 24, paddingRight: 20 }}>
                {data?.missed_meetings?.list?.map(m => (
                    <HorizontalMeetingCard key={m.meeting_id} item={m} isMissed onPress={() => navigation.navigate("Meeting", { screen: "CreateMOM", params: { meetingId: m.meeting_id }})} />
                ))}
            </ScrollView>
        </View>

        {/* PERFORMANCE INSIGHTS SECTION (NEW) */}
        <View className="px-6 mt-12">
            <Text className="text-lg font-black text-[#1A1A1A] mb-4">Strategic Insights</Text>
            <View className="bg-white p-6 rounded-[35px] border border-[#E5E5E5]">
                <View className="flex-row items-center mb-4">
                    <View className="w-10 h-10 rounded-full bg-[#E2B35E20] items-center justify-center">
                        <MaterialCommunityIcons name="lightbulb-on" size={20} color="#E2B35E" />
                    </View>
                    <Text className="ml-3 font-black text-[#1A1A1A]">Guide Recommendation</Text>
                </View>
                <Text className="text-xs italic font-medium leading-5 text-gray-500">
                    "Based on recent activity, <Text className="font-bold text-[#1A1A1A]">{data?.stats?.teams || 0} teams</Text> are currently progressing. Consider scheduling follow-ups for missed sessions to maintain the project timeline."
                </Text>
                <View className="flex-row justify-between pt-5 mt-5 border-t border-gray-50">
                    <View>
                        <Text className="text-[10px] font-bold text-gray-400 uppercase">Project Velocity</Text>
                        <Text className="font-black text-[#1A1A1A]">Optimal</Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase">System Status</Text>
                        <Text className="font-black text-green-500">Synced</Text>
                    </View>
                </View>
            </View>
        </View>

        {/* FINAL QUICK LINK */}
        <View className="px-6 mt-10">
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate("Team", { screen: "TeamList" })}
                className="bg-[#1A1A1A] p-7 rounded-[40px] flex-row items-center justify-between shadow-xl"
            >
                <View className="flex-row items-center">
                    <View className="bg-[#E2B35E] w-12 h-12 rounded-2xl items-center justify-center">
                        <FontAwesome5 name="project-diagram" size={18} color="white" />
                    </View>
                    <View className="ml-4">
                        <Text className="text-lg font-black text-white">EduProject Directory</Text>
                        <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Browse All Squads</Text>
                    </View>
                </View>
                <Feather name="arrow-up-right" size={24} color="#E2B35E" />
            </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

/* ---------- UI Sub-Components ---------- */

const MetricCard = ({ label, value, icon }) => (
    <View className="bg-white p-5 rounded-[32px] border border-[#E5E5E5] mr-4 min-w-[130px] shadow-sm items-start">
        <View className="w-10 h-10 rounded-2xl bg-[#F5F1E6] items-center justify-center mb-4">
            <FontAwesome5 name={icon} size={14} color="#E2B35E" />
        </View>
        <Text className="text-2xl font-black text-[#1A1A1A]">{value ?? 0}</Text>
        <Text className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider mt-1">{label}</Text>
    </View>
);

const HorizontalMeetingCard = ({ item, onPress, isMissed }) => (
    <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={{ width: width * 0.78 }}
        className="bg-white p-6 rounded-[38px] mr-5 border border-[#E5E5E5] shadow-sm"
    >
        <View className="flex-row items-center justify-between mb-4">
            <View className={`px-4 py-1.5 rounded-full ${isMissed ? 'bg-red-50' : 'bg-[#E2B35E15]'}`}>
                <Text className={`text-[9px] font-black uppercase tracking-widest ${isMissed ? 'text-red-500' : 'text-[#E2B35E]'}`}>
                    {isMissed ? 'Action Needed' : 'Upcoming'}
                </Text>
            </View>
            <View className="flex-row items-center">
                <Feather name="clock" size={12} color="#A0A0A0" />
                <Text className="text-[#A0A0A0] text-[10px] font-bold ml-1">
                    {new Date(item.meeting_date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        </View>

        <Text className="text-lg font-black text-[#1A1A1A] mb-1" numberOfLines={1}>{item.title}</Text>
        <Text className="text-[11px] text-[#A0A0A0] font-bold mb-5" numberOfLines={1}>Squad: {item.team_name}</Text>

        <View className="flex-row items-center justify-between pt-4 border-t border-[#F5F1E6]">
            <View className="flex-row items-center">
                <Ionicons name="location" size={14} color="#E2B35E" />
                <Text className="text-[10px] text-[#1A1A1A] font-black ml-1 uppercase">{item.location || 'Online'}</Text>
            </View>
            <View className="bg-[#1A1A1A] px-5 py-2.5 rounded-2xl">
                <Text className="text-white text-[10px] font-black uppercase tracking-widest">Open</Text>
            </View>
        </View>
    </TouchableOpacity>
);

const EmptyBox = ({ text }) => (
    <View className="bg-white/50 border-2 border-dashed border-[#D1D1D1] p-12 rounded-[40px] items-center justify-center">
        <MaterialCommunityIcons name="shield-check" size={45} color="#D1D1D1" />
        <Text className="text-[#A0A0A0] text-[11px] font-black mt-4 text-center uppercase tracking-[2px]">{text}</Text>
    </View>
);