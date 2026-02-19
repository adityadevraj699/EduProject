import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext(null);

/* ⭐ custom hook */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userData = await AsyncStorage.getItem("user"); // 👈 User data bhi load karein
        
        if (token && userData) {
          setUser({ ...JSON.parse(userData), token });
        }
      } catch (err) {
        console.log("Error loading storage", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);


 const login = async (data) => {
  await AsyncStorage.setItem("token", data.token);
  await AsyncStorage.setItem("user", JSON.stringify(data.user));

  setUser({
    ...data.user,
    token: data.token
  });
};


 const logout = async () => {
  await AsyncStorage.removeItem("token");
  console.log("token remove context");
  setUser(null);
};


  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
