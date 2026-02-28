import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../context/AuthContext";
import { getStudentTeamDetailsApi } from "../../../services/studentApi";

export default function ProjectDetailScreen() {
  const { teamId } = useRoute().params;
  const navigation = useNavigation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);

  /* ===============================
     SAFE DATA FETCH WITH CLEANUP
  =============================== */
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (!user?.token) return;

        const res = await getStudentTeamDetailsApi(user.token, teamId);

        if (isMounted && res?.success) {
          setDetails(res.data);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Fetch Error:", err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [teamId, user?.token]);

  /* ===============================
     LOADING SCREEN
  =============================== */
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F5F1E6]">
        <ActivityIndicator size="large" color="#E2B35E" />
      </View>
    );
  }

  const project = details?.project_details;

  const formatWhatsApp = (number) => {
    if (!number) return "";
    const cleaned = number.replace(/\D/g, "");
    return `https://wa.me/91${cleaned}`;
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
          Project Overview
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        className="px-5 mt-5"
        showsVerticalScrollIndicator={false}
      >

        {/* TEAM CARD */}
        <View className="bg-white p-6 rounded-[28px] shadow-sm mb-5 border border-[#EAEAEA]">
          <Text className="text-[10px] text-[#E2B35E] font-bold uppercase tracking-widest">
            Team
          </Text>

          <Text className="text-xl font-black text-[#1A1A1A] mt-1">
            {details?.team_name}
          </Text>

          <Text className="text-[#6B6B6B] text-xs mt-1">
            Created on{" "}
            {details?.team_created_at
              ? new Date(details.team_created_at).toLocaleDateString()
              : "-"}
          </Text>
        </View>

        {/* PROJECT CARD */}
        <View className="bg-white p-6 rounded-[28px] shadow-sm mb-6 border border-[#EAEAEA]">
          <View className="flex-row items-start justify-between mb-3">
            <Text className="flex-1 text-2xl font-black text-[#1A1A1A]">
              {project?.title}
            </Text>

            <View
              className={`px-3 py-1 rounded-full ${
                project?.status === "COMPLETED"
                  ? "bg-green-100"
                  : "bg-orange-100"
              }`}
            >
              <Text
                className={`text-[10px] font-bold ${
                  project?.status === "COMPLETED"
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {project?.status}
              </Text>
            </View>
          </View>

          <Text className="text-[#555] text-sm leading-6 mb-4">
            {project?.description || "No description available."}
          </Text>

          {/* DATES */}
          <View className="flex-row justify-between border-t border-[#F0F0F0] pt-4 mb-4">
            <View>
              <Text className="text-[10px] text-[#A0A0A0] font-bold">
                START
              </Text>
              <Text className="font-bold text-[#1A1A1A]">
                {project?.start_date
                  ? new Date(project.start_date).toLocaleDateString()
                  : "-"}
              </Text>
            </View>

            <View>
              <Text className="text-[10px] text-[#A0A0A0] font-bold">
                DEADLINE
              </Text>
              <Text className="font-bold text-[#1A1A1A]">
                {project?.end_date
                  ? new Date(project.end_date).toLocaleDateString()
                  : "-"}
              </Text>
            </View>
          </View>

          {/* TECHNOLOGIES */}
          <View className="flex-row flex-wrap">
            {project?.technologies?.split(",").map((tech, i) => (
              <View
                key={i}
                className="bg-[#1A1A1A] px-3 py-1 rounded-lg mr-2 mb-2"
              >
                <Text className="text-[#E2B35E] text-[10px] font-bold">
                  {tech.trim()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* YOUR ROLE */}
        <View className="bg-[#1A1A1A] p-5 rounded-[24px] mb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-[#E2B35E] text-xs uppercase font-bold">
              Your Role
            </Text>

            <Text className="text-lg font-bold text-white">
              {details?.your_role}
            </Text>
          </View>

          {details?.is_leader && (
            <View className="px-3 py-1 bg-[#E2B35E] rounded-full">
              <Text className="text-xs font-bold text-[#1A1A1A]">
                TEAM LEADER
              </Text>
            </View>
          )}
        </View>

        {/* GUIDE */}
        <View className="bg-white p-5 rounded-[24px] shadow-sm mb-6 border border-[#EAEAEA]">
          <Text className="text-[10px] text-[#E2B35E] font-bold uppercase">
            Guide
          </Text>

          <Text className="text-lg font-bold text-[#1A1A1A] mt-1">
            {details?.guide_details?.name}
          </Text>

          <TouchableOpacity
            onPress={() =>
              Linking.openURL(`mailto:${details?.guide_details?.email}`)
            }
            className="mt-3 bg-[#1A1A1A] px-4 py-2 rounded-full self-start"
          >
            <Text className="text-[#E2B35E] font-bold text-xs">
              Contact via Email
            </Text>
          </TouchableOpacity>
        </View>

        {/* MEMBERS */}
        <Text className="mb-4 text-base font-black uppercase text-[#1A1A1A]">
          Team Members ({details?.total_members})
        </Text>

        {details?.members?.map((member) => (
          <View
            key={member.user_id}
            className="bg-white p-5 rounded-[24px] mb-4 border border-[#EAEAEA] shadow-sm"
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-bold text-[#1A1A1A] text-base">
                {member.student_name}
              </Text>

              {member.is_leader && (
                <View className="px-2 py-1 bg-orange-100 rounded">
                  <Text className="text-[9px] font-bold text-orange-600">
                    LEADER
                  </Text>
                </View>
              )}
            </View>

            <Text className="text-[11px] text-[#6B6B6B]">
              {member.roll_number} • {member.branch_name} •{" "}
              {member.semester_name} • Section {member.section_name}
            </Text>

            <Text className="text-[11px] text-[#A0A0A0] mt-1">
              Role: {member.team_role}
            </Text>

            {/* ACTION BUTTONS */}
            <View className="flex-row mt-4">

              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${member.contact_no}`)}
                className="items-center justify-center w-10 h-10 mr-3 bg-green-500 rounded-full"
              >
                <Ionicons name="call" size={18} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(formatWhatsApp(member.contact_no))
                }
                className="w-10 h-10 rounded-full bg-[#25D366] items-center justify-center mr-3"
              >
                <Ionicons name="logo-whatsapp" size={18} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("PublicProfile", {
                    email: member.student_email,
                  })
                }
                className="w-10 h-10 rounded-full bg-[#1A1A1A] items-center justify-center"
              >
                <Ionicons name="person" size={18} color="#E2B35E" />
              </TouchableOpacity>

            </View>
          </View>
        ))}

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}