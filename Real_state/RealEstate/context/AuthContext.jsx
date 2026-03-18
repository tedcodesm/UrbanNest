import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true); 

const login = async (userData, token) => {
  await AsyncStorage.setItem("token", token);
  await AsyncStorage.setItem("user", JSON.stringify(userData));

  setAuthenticated(true);
  setUser(userData);
  setName(userData.username);
  setPhone(userData.phone);
  setEmail(userData.email);
  setRole(userData.role);

  console.log("User logged in:", userData);
};

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userData = await AsyncStorage.getItem("user");

        if (token && userData) {
          const parsedUser = JSON.parse(userData);

          setAuthenticated(true);
          setUser(parsedUser);
          setRole(parsedUser.role);
          setName(parsedUser.username);
          setPhone(parsedUser.phone);
          setEmail(parsedUser.email);
          console.log("User loaded from storage:", parsedUser);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.log("Auth error:", error.message);
        setAuthenticated(false);
      } finally {
        setLoading(false); 
      }
    };

    checkIfLoggedIn();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
     await AsyncStorage.removeItem("email"); 
  await AsyncStorage.removeItem("password");


    setAuthenticated(false);
    setUser(null);
    setRole(null);
    setName(null);
    setPhone(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        user,
        role,
        name,
        phone,
        email,
        setAuthenticated,
        setUser,
        logout,
        loading, 
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};