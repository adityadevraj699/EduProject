import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MeetingScreen from "../../../screens/guide/meeting/MeetingScreen";
import MomCreateScreen from "../../../screens/guide/meeting/MomCreateScreen";
import ViewMomScreen from "../../../screens/guide/meeting/ViewMomScreen";
import MeetingCreateScreen from "../../../screens/guide/meeting/MeetingCreateScreen";


const Stack = createNativeStackNavigator();

export default function TeamStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MeetingList" component={MeetingScreen} />
      <Stack.Screen name="CreateMOM" component={MomCreateScreen} />
        <Stack.Screen name="ViewMOM" component={ViewMomScreen} />
        <Stack.Screen name="CreateMeeting" component={MeetingCreateScreen}/>
    </Stack.Navigator>
  );
}