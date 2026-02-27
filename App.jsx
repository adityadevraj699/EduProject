import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context"; // 👈 Add this
import { View, ActivityIndicator, StatusBar } from "react-native";

// Context aur Navigation imports
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import AuthStack from "./src/navigation/AuthStack";
import MainTabsStack from "./src/navigation/MainTabsStack";

import './global.css';

const RootStack = createNativeStackNavigator();

function RootNavigator() {
  const { user, loading } = useAuth();

  // Loading Screen
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F1E6" }}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F1E6" />
        <ActivityIndicator size="large" color="#E2B35E" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom", // 💡 Professional transition
          animationDuration: 400,
        }}
      >
        {user ? (
          // Authenticated Routes
          <RootStack.Screen 
            name="MainTabs" 
            component={MainTabsStack} 
          />
        ) : (
          // Unauthenticated Routes
          <RootStack.Screen 
            name="AuthStack" 
            component={AuthStack} 
            options={{
              animationTypeForReplace: 'pop',
            }}
          />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    // 1. SafeAreaProvider zaroori hai useSafeAreaInsets() ke liye
    <SafeAreaProvider> 
      {/* 2. AuthProvider ko navigation ke upar rakhein taaki useAuth har jagah chale */}
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}