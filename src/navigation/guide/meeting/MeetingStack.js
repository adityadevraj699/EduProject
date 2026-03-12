import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MeetingScreen from "../../../screens/guide/meeting/MeetingScreen";
import MomCreateScreen from "../../../screens/guide/meeting/MomCreateScreen";
import ViewMomScreen from "../../../screens/guide/meeting/ViewMomScreen";
import MeetingCreateScreen from "../../../screens/guide/meeting/MeetingCreateScreen";

const Stack = createNativeStackNavigator();

// 💡 Name change to MeetingStack for better readability
export default function MeetingStack() {
  return (
    <Stack.Navigator 
      initialRouteName="MeetingList" // Hamesha list se shuru hoga
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right' 
      }}
    >
      <Stack.Screen name="MeetingList" component={MeetingScreen} />
      <Stack.Screen name="CreateMOM" component={MomCreateScreen} />
      <Stack.Screen name="ViewMOM" component={ViewMomScreen} />
      <Stack.Screen name="CreateMeeting" component={MeetingCreateScreen}/>
    </Stack.Navigator>
  );
}