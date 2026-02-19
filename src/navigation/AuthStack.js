// src/navigation/AuthStack.js

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/auth/LoginScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import VerifyOtpScreen from "../screens/auth/VerifyOtpScreen";
import ChangePasswordScreen from "../screens/auth/ChangePasswordScreen";

import MainTabs from "./MainTabs";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right"
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      
      <Stack.Screen
        name="VerifyOtp"
        component={VerifyOtpScreen}
      />
      
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
      />

       {/* IMPORTANT */}
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}
