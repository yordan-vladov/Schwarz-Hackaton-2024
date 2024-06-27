import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import axios, { AxiosError } from "axios";
import {router} from "expo-router";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  signUp: (
    username: string,
    email: string,
    password: string
  ) => Promise<void | { error: string }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<void | { error: string }>;
  signOut: () => Promise<void>;
  refreshAccessToken: (refreshToken: string) => Promise<string>;
  loading: boolean;
}

interface User {
  id: string;
  username: string;
  email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync("user");
        const storedAccessToken = await SecureStore.getItemAsync("accessToken");
        const storedRefreshToken = await SecureStore.getItemAsync(
          "refreshToken"
        );

        if (storedUser && storedAccessToken && storedRefreshToken) {
          setUser(JSON.parse(storedUser));
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
        }
      } catch (error) {
        console.error("Failed to load storage data", error);
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const signUp = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_HOST}/api/v1/auth/register`,
        { username, email, password }
      );

      await SecureStore.setItemAsync(
        "user",
        JSON.stringify(response.data.user)
      );
      await SecureStore.setItemAsync("accessToken", response.data.access_token);
      await SecureStore.setItemAsync(
        "refreshToken",
        response.data.refresh_token
      );

      setUser(response.data.user);
      setAccessToken(response.data.access_token);
      setRefreshToken(response.data.refresh_token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data };
      } else {
        console.error(error);
        return { error: "Something else went wrong" };
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log(`${process.env.EXPO_PUBLIC_HOST}/api/v1/auth/authenticate`);

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_HOST}/api/v1/auth/authenticate`,
        { email, password }
      );

      await SecureStore.setItemAsync(
        "user",
        JSON.stringify(response.data.user)
      );
      await SecureStore.setItemAsync("accessToken", response.data.access_token);
      await SecureStore.setItemAsync(
        "refreshToken",
        response.data.refresh_token
      );
      
      setUser(response.data.user);
      setAccessToken(response.data.access_token);
      setRefreshToken(response.data.refresh_token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.detail === "Invalid credentials") {
          return { error: "Incorrect username or password" };
        } else {
          return { error: error.message };
        }
      } else {
        console.error(error);
        return { error: "Something else went wrong" };
      }
    }
  };

  const signOut = async () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    router.navigate("(auth)/sign-in")

  };
        
  const refreshAccessToken = useCallback(
    async (refreshToken: string) => {
      try {
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_HOST}/api/v1/auth/refresh`,
          { refreshToken }
        );
        const { accessToken: newAccessToken } = response.data;
        await SecureStore.setItemAsync("accessToken", newAccessToken);
        setAccessToken(newAccessToken);
        return newAccessToken;
      } catch (error) {
        console.error("Failed to refresh access token", error);
        signOut();
        throw error;
      }
    },
    [signOut]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        signUp,
        signIn,
        signOut,
        refreshAccessToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
