import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./src/navigation/AuthStack";
import MainTabs from "./src/navigation/MainTabs";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import './global.css'

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const RootStack = createNativeStackNavigator();


function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F1E6" }}>
        <ActivityIndicator size="large" color="#E2B35E" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          // 💡 Yahan professional animation set karein
          animation: "fade", 
          animationDuration: 600,
        }}
      >
        {user ? (
          // Jab user login hoga
          <RootStack.Screen name="MainTabs" component={MainTabs} />
        ) : (
          // Jab user logged out hoga
          <RootStack.Screen 
            name="AuthStack" 
            component={AuthStack} 
            options={{
              animationTypeForReplace: 'pop', // Logout pe piche jane wala effect
            }}
          />
        )}
      </RootStack.Navigator>
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
