import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { getStudentPublicProfileApi } from "../../../services/publicProfileApi";

const PublicScreen = ({ route }) => {
  /* ⭐ email from navigation */
  const initialEmail = route?.params?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  /* ⭐ AUTO FETCH when screen opens with email */
  useEffect(() => {
    if (initialEmail) fetchProfile(initialEmail);
  }, []);

  const fetchProfile = async (targetEmail = email) => {
    if (!targetEmail) return;

    try {
      setLoading(true);
      const res = await getStudentPublicProfileApi(targetEmail);
      if (res.success) setData(res.data);
    } catch (e) {
      console.log("public profile error", e.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const student = data?.student;
  const analytics = data?.analytics;

  return (
    <ScrollView
      className="flex-1 bg-[#F5F1E6]"
      contentContainerStyle={{ padding: 24 }}
    >
      {/* ⭐ SEARCH BAR */}
      <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 border border-[#E5E5E5]">
        <Ionicons name="search" size={20} color="#777" />

        <TextInput
          placeholder="Enter student email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          className="flex-1 ml-2 text-[#1A1A1A]"
        />

        <TouchableOpacity onPress={() => fetchProfile()}>
          <Ionicons name="arrow-forward-circle" size={26} color="#E2B35E" />
        </TouchableOpacity>
      </View>

      {/* ⭐ LOADING */}
      {loading && (
        <View className="items-center mt-10">
          <ActivityIndicator size="large" color="#E2B35E" />
        </View>
      )}

      {/* ⭐ PROFILE UI */}
      {!loading && student && (
        <>
          {/* TOP SCORE */}
          <View className="bg-[#1A1A1A] rounded-3xl p-6 items-center mt-6">
            <Text className="text-xs tracking-widest text-white uppercase">
              Contribution Score
            </Text>
            <Text className="text-[#E2B35E] text-5xl font-black mt-2">
              {analytics?.contribution?.score ?? "-"}
            </Text>
            <Text className="mt-2 text-xs text-white">
              Overall Performance Index
            </Text>
          </View>

          {/* PROFILE HEADER */}
          <View className="items-center mt-8">
            <View className="items-center justify-center w-24 h-24 bg-white rounded-full shadow">
              <Ionicons name="person" size={40} color="#E2B35E" />
            </View>

            <Text className="text-xl font-black text-[#1A1A1A] mt-4">
              {student?.name}
            </Text>

            <Text className="text-[#777]">
              {student?.branch_name} • {student?.semester_name}
            </Text>
          </View>

          {/* SNAPSHOT */}
          <View className="flex-row justify-between mt-8">
            <Card label="Projects" value={analytics?.projects?.total_projects} />
            <Card label="Completed" value={analytics?.tasks?.completed} />
            <Card
              label="Attendance"
              value={`${Math.round(
                (analytics?.attendance?.attendance_rate || 0) * 100
              )}%`}
            />
          </View>

          {/* TASK DETAILS */}
          <View className="bg-white rounded-3xl p-6 mt-8 border border-[#E5E5E5]">
            <SectionTitle title="Task Analytics" />
            <Item label="Total Assigned" value={analytics?.tasks?.total_assigned} />
            <Item label="Completed" value={analytics?.tasks?.completed} />
            <Item label="In Progress" value={analytics?.tasks?.in_progress} />
            <Item label="Overdue" value={analytics?.tasks?.overdue} />
          </View>

          {/* ATTENDANCE */}
          <View className="bg-white rounded-3xl p-6 mt-6 border border-[#E5E5E5]">
            <SectionTitle title="Meeting Attendance" />
            <Item label="Total Meetings" value={analytics?.attendance?.total_meetings} />
            <Item label="Attended" value={analytics?.attendance?.attended} />
            <Item label="Missed" value={analytics?.attendance?.missed} />
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default PublicScreen;

/* small components */

const Card = ({ label, value }) => (
  <View className="bg-white rounded-2xl p-4 items-center w-[30%] border border-[#E5E5E5]">
    <Text className="text-[#777] text-xs">{label}</Text>
    <Text className="text-lg font-black text-[#1A1A1A] mt-1">
      {value ?? "-"}
    </Text>
  </View>
);

const SectionTitle = ({ title }) => (
  <Text className="font-black text-[#1A1A1A] mb-4">{title}</Text>
);

const Item = ({ label, value }) => (
  <View className="mb-3">
    <Text className="text-[#777] text-xs">{label}</Text>
    <Text className="font-bold text-[#1A1A1A]">{value ?? "-"}</Text>
  </View>
);