import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

import HomeScreen from "../screens/home/HomeScreen";
import TeamListScreen from "../screens/team/TeamListScreen";
import MeetingScreen from "../screens/meeting/MeetingScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,

        
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E7EB",
          height: 60,
          paddingBottom: Platform.OS === "ios" ? 10 : 6,
          paddingTop: 6
        },

        tabBarActiveTintColor: "#0A66C2", 
        tabBarInactiveTintColor: "#6B7280",

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500"
        },

        tabBarIcon: ({ focused, color }) => {
          if (route.name === "Home") {
            return (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={22}
                color={color}
              />
            );
          }

          if (route.name === "Team") {
            return (
              <FontAwesome5
                name="users"
                size={18}
                color={color}
              />
            );
          }

          if (route.name === "Meeting") {
            return (
              <MaterialIcons
                name="meeting-room"
                size={22}
                color={color}
              />
            );
          }

          if (route.name === "Profile") {
            return (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={22}
                color={color}
              />
            );
          }
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Team" component={TeamListScreen} />
      <Tab.Screen name="Meeting" component={MeetingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
