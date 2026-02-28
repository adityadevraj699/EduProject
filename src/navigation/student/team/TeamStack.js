import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProjectListScreen from "../../../screens/student/project/ProjectListScreen";
import ProjectDetailsScreen from "../../../screens/student/project/ProjectDetailScreen";

const Stack = createNativeStackNavigator();

export default function TeamStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProjectList" component={ProjectListScreen} />
      <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen} />
    </Stack.Navigator>
  );
}