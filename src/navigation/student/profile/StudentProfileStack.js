import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import StudentProfileScreen from "../../../screens/student/profile/ProfileScreen";
import PublicScreen from "../../../screens/student/profile/PublicScreen";

const Stack = createNativeStackNavigator();

export default function StudentProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentProfileHome" component={StudentProfileScreen} />
      <Stack.Screen name="PublicProfile" component={PublicScreen} />
    </Stack.Navigator>
  );
}