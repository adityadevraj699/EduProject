import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
  Dimensions
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from "@expo/vector-icons";

import { useAuth } from "../../../context/AuthContext";
import { getStudentDashboardApi } from "../../../services/homeApi";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const res = await getStudentDashboardApi(user.token);
      if (res.success) setData(res.data);
    } catch (e) {
      console.log("student dashboard error", e.message);
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

  const present = data?.stats?.attendance?.present || 0;
  const absent = data?.stats?.attendance?.absent || 0;
  const total = present + absent;
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F1E6" }}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* HEADER */}
      <View style={{ paddingTop: insets.top + 10, paddingBottom: 20 }}
        className="flex-row items-center justify-between px-6 bg-white border-b border-[#F0F0F0]"
      >
        <View>
          <Text className="text-[#E2B35E] font-bold text-[10px] uppercase tracking-[2px]">
            Student Portal
          </Text>
          <Text className="text-[#1A1A1A] text-2xl font-black">
            Hello, {user?.name?.split(" ")[0]}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          className="w-12 h-12 rounded-2xl bg-[#1A1A1A] items-center justify-center"
        >
          <FontAwesome5 name="user-graduate" size={18} color="#E2B35E" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#E2B35E"]} />
        }
      >

        {/* ATTENDANCE HERO CARD */}
        <View className="px-6 mt-6">
          <View className="bg-[#1A1A1A] p-7 rounded-[40px] shadow-2xl">
            <Text className="text-white/60 text-[11px] font-bold uppercase tracking-widest">
              Attendance Performance
            </Text>

            <View className="flex-row items-baseline mt-2">
              <Text className="text-5xl font-black text-white">{attendanceRate}</Text>
              <Text className="text-[#E2B35E] text-xl font-bold ml-1">%</Text>
            </View>

            <View className="flex-row w-full h-3 mt-6 overflow-hidden rounded-full bg-white/10">
              <View
                style={{ width: `${attendanceRate}%` }}
                className="h-full bg-[#E2B35E]"
              />
            </View>

            <View className="flex-row justify-between mt-4">
              <Text className="text-xs font-bold text-white">
                {present} Present
              </Text>
              <Text className="text-xs font-bold text-white">
                {absent} Absent
              </Text>
            </View>
          </View>
        </View>

        {/* STATS GRID */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          className="px-6 mt-8"
        >
          <MetricCard label="Teams" value={data?.stats?.teams} icon="users" />
          <MetricCard label="Meetings" value={data?.stats?.total_meetings} icon="video" />
          <MetricCard label="Completed" value={data?.stats?.completed_meetings} icon="check-circle" />
        </ScrollView>

        {/* UPCOMING */}
        <SectionSlider
          title="Upcoming"
          subtitle="Next 24 Hours"
          data={data?.upcoming_24h?.list}
          navigation={navigation}
        />

        {/* MISSED */}
        <SectionSlider
          title="Missed"
          subtitle="Needs Attention"
          data={data?.missed_meetings?.list}
          navigation={navigation}
          isMissed
        />

      </ScrollView>
    </View>
  );
}

/* ---------- COMPONENTS ---------- */

const MetricCard = ({ label, value, icon }) => (
  <View className="bg-white p-5 rounded-[30px] border border-[#E5E5E5] mr-4 min-w-[130px] shadow-sm">
    <FontAwesome5 name={icon} size={16} color="#E2B35E" />
    <Text className="mt-3 text-2xl font-black">{value ?? 0}</Text>
    <Text className="mt-1 text-xs font-bold text-gray-500 uppercase">{label}</Text>
  </View>
);

const SectionSlider = ({ title, subtitle, data, navigation, isMissed }) => (
  <View className="mt-10">
    <View className="flex-row items-center justify-between px-6 mb-5">
      <View>
        <Text className="text-xl font-black">{title}</Text>
        <Text className="text-xs text-gray-500 uppercase">{subtitle}</Text>
      </View>
    </View>

    {data?.length > 0 ? (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 24 }}>
        {data.map(m => (
          <TouchableOpacity
            key={m.meeting_id}
            style={{ width: width * 0.75 }}
            onPress={() => navigation.navigate("MeetingDetail", { meetingId: m.meeting_id })}
            className="bg-white p-6 rounded-[35px] mr-5 border border-[#E5E5E5]"
          >
            <Text className="text-lg font-black">{m.title}</Text>
            <Text className="mt-1 text-xs text-gray-500">{m.team_name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    ) : (
      <View className="px-6">
        <Text className="text-xs text-gray-400">No records available</Text>
      </View>
    )}
  </View>
);