import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { CommonActions } from '@react-navigation/native';

// --- GUIDE SCREENS ---
import HomeScreen from "../screens/guide/home/HomeScreen";
import TeamStack from "./guide/team/TeamStack";
import MeetingStack from "./guide/meeting/MeetingStack";
import ProfileScreen from "../screens/guide/profile/ProfileScreen";

// --- STUDENT SCREENS ---
import StudentHomeScreen from "../screens/student/home/HomeScreen";
import StudentProjectStack from "./student/team/TeamStack";
import StudentMeetingStack from "./student/meeting/MeetingStack";
import StudentProfileStack from "./student/profile/StudentProfileStack";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        // ⭐ unmountOnBlur: true se har baar tab fresh load hoga
        unmountOnBlur: true, 
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E7EB",
          height: 80,
          paddingBottom: Platform.OS === "ios" ? 25 : 12,
          paddingTop: 8,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: role === "GUIDE" ? "#1A1A1A" : "#E2B35E",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: { 
          fontSize: 10, 
          fontWeight: "800", 
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginTop: 4
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === "Home") {
            return <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />;
          }
          if (route.name === "Team" || route.name === "Project") {
            return <FontAwesome5 name={route.name === "Team" ? "users" : "project-diagram"} size={18} color={color} />;
          }
          if (route.name === "Meeting") {
            return <MaterialIcons name="meeting-room" size={24} color={color} />;
          }
          if (route.name === "Profile") {
            return <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />;
          }
        },
      })}
    >
      {role === "GUIDE" ? (
        <>
          <Tab.Screen name="Home" component={HomeScreen} />
          
          {/* ⭐ Team Tab with Reset Logic */}
  <Tab.Screen 
  name="Team" 
  component={TeamStack} 
  options={{ unmountOnBlur: true }}
  listeners={({ navigation }) => ({
    tabPress: (e) => {
      // Prevent default action
      e.preventDefault();
      
      // Reset the stack and navigate to TeamList
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { 
              name: 'Team', 
              state: {
                routes: [{ name: 'TeamList' }],
              },
            },
          ],
        })
      );
    },
  })}
/>
          
          <Tab.Screen 
            name="Meeting" 
            component={MeetingStack} 
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                // Adjust "MeetingList" to your actual first screen name in MeetingStack
                navigation.navigate("Meeting", { screen: "MeetingList" });
              },
            })}
          />
          
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        <>
          <Tab.Screen name="Home" component={StudentHomeScreen} />
          
          {/* ⭐ Project Tab with Reset Logic */}
          <Tab.Screen 
            name="Project" 
            component={StudentProjectStack} 
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                navigation.navigate("Project", { screen: "ProjectList" });
              },
            })}
          />
          
          <Tab.Screen name="Meeting" component={StudentMeetingStack} />
          <Tab.Screen name="Profile" component={StudentProfileStack} />
        </>
      )}
    </Tab.Navigator>
  );
}