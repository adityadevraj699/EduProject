import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext"; // 👈 Hook import karein

// --- GUIDE SCREENS ---
import HomeScreen from "../screens/guide/home/HomeScreen";
import TeamStack from "./guide/team/TeamStack";
import MeetingScreen from "../screens/guide/meeting/MeetingScreen";
import ProfileScreen from "../screens/guide/profile/ProfileScreen";

// --- STUDENT SCREENS (Inhe create kar lena agar nahi kiye hain) ---
import StudentHomeScreen from "../screens/student/home/HomeScreen";
import StudentProjectScreen from "../screens/student/project/ProjectListScreen";
import StudentMeetingScreen from "../screens/student/meeting/MeetingScreen";
import StudentProfileScreen from "../screens/student/profile/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { user } = useAuth(); // 👈 User object se role nikalenge
  const role = user?.role; // 'GUIDE' or 'STUDENT'

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E7EB",
          height: 80,
          paddingBottom: Platform.OS === "ios" ? 15 : 10,
          paddingTop: 6
        },
        tabBarActiveTintColor: role === "GUIDE" ? "#0A66C2" : "#E2B35E", // Role wise colors
        tabBarInactiveTintColor: "#6B7280",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "500" },
        tabBarIcon: ({ focused, color }) => {
          if (route.name === "Home") {
            return <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />;
          }
          if (route.name === "Team" || route.name === "Project") {
            return <FontAwesome5 name={route.name === "Team" ? "users" : "project-diagram"} size={18} color={color} />;
          }
          if (route.name === "Meeting") {
            return <MaterialIcons name="meeting-room" size={22} color={color} />;
          }
          if (route.name === "Profile") {
            return <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />;
          }
        }
      })}
    >
      {/* ---------- ROLE BASED SCREENS ---------- */}
      {role === "GUIDE" ? (
        <>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Team" component={TeamStack} />
          <Tab.Screen name="Meeting" component={MeetingScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        <>
          <Tab.Screen name="Home" component={StudentHomeScreen} />
          <Tab.Screen name="Project" component={StudentProjectScreen} />
          <Tab.Screen name="Meeting" component={StudentMeetingScreen} />
          <Tab.Screen name="Profile" component={StudentProfileScreen} />
        </>
      )}
    </Tab.Navigator>
  );
}

