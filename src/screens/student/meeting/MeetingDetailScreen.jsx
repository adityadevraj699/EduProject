import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../../context/AuthContext";
import { getStudentMeetingDetailsApi } from "../../../services/studentApi";

export default function MeetingDetailScreen() {
  const { meetingId } = useRoute().params;
  const navigation = useNavigation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);

  /* ===============================
     SAFE FETCH
  =============================== */
  useEffect(() => {
    let isMounted = true;

    const fetchDetails = async () => {
      try {
        if (!user?.token) return;

        const res = await getStudentMeetingDetailsApi(
          user.token,
          meetingId
        );

        if (isMounted && res?.success) {
          setDetails(res.data);
        }
      } catch (err) {
        if (isMounted) console.error(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [meetingId, user?.token]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F5F1E6]">
        <ActivityIndicator size="large" color="#E2B35E" />
      </View>
    );
  }

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View className="flex-1 bg-[#F5F1E6]">
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-white shadow-sm">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full bg-[#F5F5F5]"
        >
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>

        <Text className="text-lg font-black text-[#1A1A1A]">
          Meeting Report
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        className="px-5 mt-5"
        showsVerticalScrollIndicator={false}
      >

        {/* MEETING OVERVIEW CARD */}
        <View className="bg-white p-6 rounded-[28px] shadow-sm mb-6 border border-[#EAEAEA]">
          <View className="flex-row items-start justify-between mb-2">
            <Text className="text-2xl font-black text-[#1A1A1A] flex-1">
              {details?.title}
            </Text>

            <View
              className={`px-3 py-1 rounded-full ${
                details?.status === "COMPLETED"
                  ? "bg-green-100"
                  : "bg-orange-100"
              }`}
            >
              <Text
                className={`text-[10px] font-bold ${
                  details?.status === "COMPLETED"
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {details?.status}
              </Text>
            </View>
          </View>

          <Text className="text-[#6B6B6B] text-sm">
            {details?.team_name}
          </Text>

          <Text className="text-[#999] text-xs mt-1">
            {formatDate(details?.meeting_date_time)}
          </Text>
        </View>

        {/* AGENDA */}
        {details?.agenda ? (
          <View className="bg-white p-6 rounded-[24px] mb-5 border-l-4 border-[#E2B35E]">
            <Text className="text-xs font-bold text-[#E2B35E] uppercase mb-1">
              Agenda
            </Text>
            <Text className="text-[15px] text-[#444] leading-6">
              {details.agenda}
            </Text>
          </View>
        ) : null}

        {/* SUMMARY */}
        {details?.summary ? (
          <View className="bg-white p-6 rounded-[24px] mb-5 border-l-4 border-[#1A1A1A]">
            <Text className="text-xs font-bold text-[#1A1A1A] uppercase mb-1">
              Summary
            </Text>
            <Text className="text-[15px] text-[#444] leading-6">
              {details.summary}
            </Text>
          </View>
        ) : null}

        {/* NEXT STEPS — ROYAL HIGHLIGHT */}
        {details?.next_steps ? (
          <View className="bg-[#1A1A1A] p-6 rounded-[24px] mb-5 shadow-md">
            <Text className="text-xs font-bold text-[#E2B35E] uppercase mb-2">
              Next Steps
            </Text>
            <Text className="text-[15px] text-white leading-6">
              {details.next_steps}
            </Text>
          </View>
        ) : null}

        {/* ACTION ITEMS */}
        {details?.action_items ? (
          <View className="bg-white p-6 rounded-[24px] mb-5">
            <Text className="text-xs font-bold text-[#A0A0A0] uppercase mb-1">
              Action Items
            </Text>
            <Text className="text-[14px] text-[#555] leading-6">
              {details.action_items}
            </Text>
          </View>
        ) : null}

        {/* REMARKS */}
        {details?.remarks ? (
          <View className="bg-white p-6 rounded-[24px] mb-6">
            <Text className="text-xs font-bold text-[#A0A0A0] uppercase mb-1">
              Remarks
            </Text>
            <Text className="text-[14px] text-[#555]">
              {details.remarks}
            </Text>
          </View>
        ) : null}

        {/* ATTENDANCE */}
        <Text className="mb-3 text-base font-black uppercase text-[#1A1A1A]">
          Attendance
        </Text>

        {details?.attendance_list?.length ? (
          details.attendance_list.map((student, index) => (
            <View
              key={index}
              className="bg-white p-5 rounded-[24px] mb-4 border border-[#EAEAEA] shadow-sm"
            >
              <View className="flex-row items-center justify-between mb-1">
                <Text className="font-bold text-[#1A1A1A]">
                  {student.name}
                </Text>

                <View
                  className={`px-3 py-1 rounded-full ${
                    student.status === "PRESENT"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  <Text
                    className={`text-[10px] font-bold ${
                      student.status === "PRESENT"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {student.status}
                  </Text>
                </View>
              </View>

              <Text className="text-[11px] text-[#6B6B6B]">
                Roll No: {student.roll_number}
              </Text>

              {student.remarks ? (
                <Text className="text-[11px] text-[#999] mt-1">
                  Remarks: {student.remarks}
                </Text>
              ) : null}
            </View>
          ))
        ) : (
          <Text className="text-[#A0A0A0]">
            No attendance data available.
          </Text>
        )}

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}