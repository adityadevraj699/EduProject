import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from "@expo/vector-icons";

import { useAuth } from "../../../context/AuthContext";
import { getStudentTeamsApi } from "../../../services/studentApi";

const { width } = Dimensions.get("window");

export default function ProjectListScreen({ navigation }) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [projects, setProjects] = useState([]);

  const loadData = async () => {
    if (!user?.token) return;
    try {
      const res = await getStudentTeamsApi(user.token);
      if (res.success) {
        setProjects(res.data);
      }
    } catch (err) {
      console.error("Student Project Error:", err.message);
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

  const renderCard = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate("ProjectDetails", { teamId: item.team_id })}
      className="bg-white p-6 rounded-[40px] mb-6 border border-[#E5E5E5] shadow-sm relative overflow-hidden"
    >
      {/* Background Decorative Element */}
      <View className="absolute -right-4 -top-4 w-20 h-20 bg-[#F5F1E6] rounded-full opacity-50" />

      <View className="flex-row items-start justify-between mb-4">
        <View className="flex-1 pr-2">
          <View className="flex-row items-center mb-1">
            <View className="w-1.5 h-1.5 rounded-full bg-[#E2B35E] mr-2" />
            <Text className="text-[#E2B35E] text-[10px] font-bold tracking-[1.5px] uppercase">
              {item.team_name}
            </Text>
          </View>
          <Text className="text-xl font-black text-[#1A1A1A] leading-7">
            {item.project_title}
          </Text>
        </View>

        <View className={`px-4 py-1.5 rounded-2xl ${
            item.project_status === "COMPLETED" ? "bg-green-50" : "bg-[#E2B35E15]"
          }`}
        >
          <Text className={`text-[9px] font-black uppercase tracking-widest ${
              item.project_status === "COMPLETED" ? "text-green-600" : "text-[#E2B35E]"
            }`}
          >
            {item.project_status}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between pt-5 border-t border-[#F5F1E6]">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-xl bg-[#F5F1E6] items-center justify-center">
             <FontAwesome5 name="users" size={12} color="#E2B35E" />
          </View>
          <Text className="ml-3 font-bold text-[#1A1A1A] text-xs">
            {item.total_members} Scholars
          </Text>
        </View>
        
        <View className="bg-[#1A1A1A] w-10 h-10 rounded-2xl items-center justify-center shadow-lg">
            <Feather name="chevron-right" size={20} color="#E2B35E" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F1E6" }}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* ROYAL HEADER */}
      <View style={{ paddingTop: insets.top + 10, paddingBottom: 20 }} className="px-6 bg-white border-b border-[#F0F0F0]">
        <View className="flex-row items-center justify-between">
            <View>
                <Text className="text-[#E2B35E] text-[10px] font-bold tracking-[2.5px] uppercase">
                    Portfolio
                </Text>
                <Text className="text-3xl font-black text-[#1A1A1A]">
                    My Projects
                </Text>
            </View>
            <View className="w-12 h-12 rounded-2xl bg-[#F5F1E6] items-center justify-center">
                <FontAwesome5 name="project-diagram" size={18} color="#E2B35E" />
            </View>
        </View>
      </View>

      {loading && !refreshing ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#E2B35E" />
          <Text className="mt-4 text-[10px] font-bold text-[#A0A0A0] uppercase tracking-widest">Architecting List...</Text>
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.team_id.toString()}
          renderItem={renderCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
          ListEmptyComponent={
            <View className="items-center justify-center mt-20">
               <View className="bg-white p-10 rounded-[40px] border-2 border-dashed border-[#D1D1D1] items-center">
                  <MaterialCommunityIcons name="folder-open-outline" size={50} color="#D1D1D1" />
                  <Text className="text-[#A0A0A0] text-[11px] font-black mt-4 uppercase tracking-[2px]">No projects assigned yet</Text>
               </View>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#E2B35E"]}
              tintColor="#E2B35E"
            />
          }
        />
      )}
    </View>
  );
}