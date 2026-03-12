import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TeamListScreen from "../../../screens/guide/team/TeamListScreen";
import TeamDetailsScreen from "../../../screens/guide/team/TeamDetailsScreen";
import CreateTeamScreen from "../../../screens/guide/team/CreateTeamScreen";

const Stack = createNativeStackNavigator();

export default function TeamStack() {
  return (
    <Stack.Navigator 
      // initialRouteName hamesha TeamList hi rahega
      initialRouteName="TeamList" 
      screenOptions={{ 
        headerShown: false,
        // ⭐ Ise add karne se screen switch karte waqt state clean rehti hai
        animation: 'slide_from_right' 
      }}
    >
      <Stack.Screen name="TeamList" component={TeamListScreen} />
      <Stack.Screen name="TeamDetails" component={TeamDetailsScreen} />
      <Stack.Screen name="CreateTeam" component={CreateTeamScreen} />
    </Stack.Navigator>
  );
}