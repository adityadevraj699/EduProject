import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabs from "./MainTabs";
import PublicScreen from "../screens/student/profile/PublicScreen";

const Stack = createNativeStackNavigator();

export default function MainTabsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen name="PublicProfile" component={PublicScreen} />
    </Stack.Navigator>
  );
}