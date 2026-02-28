import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View, ActivityIndicator, StatusBar } from "react-native";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import AuthStack from "./src/navigation/AuthStack";
import MainTabsStack from "./src/navigation/MainTabsStack";
import "./global.css"


const RootStack = createNativeStackNavigator();

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F1E6" }}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F1E6" />
        <ActivityIndicator size="large" color="#E2B35E" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "fade_from_bottom",
            animationDuration: 400,
          }}
        >
          {user ? (
            <RootStack.Screen name="MainTabs" component={MainTabsStack} />
          ) : (
            <RootStack.Screen
              name="AuthStack"
              component={AuthStack}
              options={{ animationTypeForReplace: "pop" }}
            />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}