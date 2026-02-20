import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TeamListScreen from "../../../screens/guide/team/TeamListScreen";
import TeamDetailsScreen from "../../../screens/guide/team/TeamDetailsScreen";

const Stack = createNativeStackNavigator();

export default function TeamStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TeamList" component={TeamListScreen} />
      <Stack.Screen name="TeamDetails" component={TeamDetailsScreen} />
    </Stack.Navigator>
  );
}