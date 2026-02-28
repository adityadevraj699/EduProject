import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { useAuth } from "../../../context/AuthContext";
import { getStudentMeetingsApi } from "../../../services/studentApi";

export default function MeetingScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [meetings, setMeetings] = useState([]);

  const loadData = async () => {
    if (!user?.token) return;

    try {
      const res = await getStudentMeetingsApi(user.token);
      if (res.success) {
        setMeetings(res.data);
      }
    } catch (err) {
      console.error("Student Meeting Error:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, [user?.token])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const renderCard = ({ item }) => {
    const isMomCreated = item.mom_status === "CREATED";

    return (
      <View className="bg-white p-5 rounded-[28px] mb-5 shadow-sm border border-[#E5E5E5]">
        <View className="flex-row items-start justify-between mb-3">
          <Text className="text-[#1A1A1A] font-black text-lg flex-1">
            {item.subject}
          </Text>

          <View
            className={`px-3 py-1 rounded-full ${
              isMomCreated ? "bg-green-100" : "bg-orange-100"
            }`}
          >
            <Text
              className={`text-[9px] font-bold ${
                isMomCreated ? "text-green-600" : "text-orange-600"
              }`}
            >
              {isMomCreated ? "MOM READY" : "NO MOM"}
            </Text>
          </View>
        </View>

        <View className="mb-4">
          <View className="flex-row items-center mb-1">
            <Ionicons name="people-outline" size={14} color="#E2B35E" />
            <Text className="text-[#6B6B6B] ml-2 text-[12px]">
              {item.team_name}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="folder-outline" size={14} color="#A0A0A0" />
            <Text className="text-[#A0A0A0] ml-2 text-[11px]">
              {item.project_title}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center border-t border-[#F5F1E6] pt-4">
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="calendar-clock"
              size={16}
              color="#1A1A1A"
            />
            <Text className="ml-2 font-bold text-[11px]">
              {new Date(item.date).toLocaleDateString("en-GB")}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("StudentMeetingDetails", {
                meetingId: item.meeting_id,
              })
            }
            className="px-5 py-2 rounded-2xl bg-[#1A1A1A]"
          >
            <Text className="text-white text-[11px] font-bold uppercase">
              View Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F1E6" }}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View
        style={{ paddingTop: insets.top + 10 }}
        className="px-6 pb-6 bg-white shadow-sm"
      >
        <Text className="text-[#E2B35E] font-bold text-[10px] tracking-[2px] uppercase">
          Student Portal
        </Text>
        <Text className="text-3xl font-black text-[#1A1A1A]">
          My Meetings
        </Text>
      </View>

      {loading ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#E2B35E" />
        </View>
      ) : (
        <FlatList
          data={meetings}
          keyExtractor={(item) => item.meeting_id.toString()}
          renderItem={renderCard}
          contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#E2B35E"]}
            />
          }
        />
      )}
    </View>
  );
}