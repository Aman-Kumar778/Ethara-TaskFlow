import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { setAccessToken } from "../api/axiosInstance";
import { getMe } from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  const login = (data) => {
    setUser(data.user);
    setAccessToken(data.accessToken);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const restoreSession = async () => {
      try {
        const response = await getMe();
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
