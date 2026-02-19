import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./src/navigation/AuthStack";
import MainTabs from "./src/navigation/MainTabs";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import './global.css'

/* ---------- ROOT NAV ---------- */
function RootNavigator() {
  const { user, loading } = useAuth();

  /* ⭐ WAIT until AsyncStorage check finish */
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
