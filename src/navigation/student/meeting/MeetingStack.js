import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MeetingListScreen from "../../../screens/student/meeting/MeetingScreen";
import MeetingDetailsScreen from "../../../screens/student/meeting/MeetingDetailScreen";

const Stack = createNativeStackNavigator();

export default function MeetingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentMeetingList" component={MeetingListScreen} />
      <Stack.Screen name="StudentMeetingDetails" component={MeetingDetailsScreen} />
    </Stack.Navigator>
  );
}