// frontend/src/contexts/AuthContext.jsx

import { createContext, useEffect, useState, useContext } from "react";
import { authApi } from "../api/authApi";

// ✅ Named export for AuthContext
export const AuthContext = createContext();

// ✅ Named export for AuthProvider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mfaPending, setMFAPending] = useState(false);
  const [preAuthToken, setPreAuthToken] = useState(null);

  // Restore session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("access_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Regular Login
  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    const data = response.data;

    if (data.requires_mfa) {
      setMFAPending(true);
      setPreAuthToken(data.pre_auth_token);
      return { requires_mfa: true, user: data.user };
    }

    const { access_token, refresh_token, user } = data;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    return { success: true, user };
  };

  // Google OAuth Login
  const googleLogin = async (credential) => {
    const response = await authApi.googleLogin(credential);
    const data = response.data;

    if (data.requires_mfa) {
      setMFAPending(true);
      setPreAuthToken(data.pre_auth_token);
      return { requires_mfa: true, user: data.user };
    }

    const { access_token, refresh_token, user } = data;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    return { success: true, user };
  };

  // MFA Verification
  const verifyMFA = async (code) => {
    if (!preAuthToken) {
      throw new Error("No MFA session found");
    }
    const response = await authApi.verifyMFA(code, preAuthToken);
    const { access_token, refresh_token, user } = response.data;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setMFAPending(false);
    setPreAuthToken(null);
    return { success: true, user };
  };

  // Registration
  const register = async (data) => {
    const response = await authApi.register(data);
    return response.data;
  };

  // Logout
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore logout errors
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    setMFAPending(false);
    setPreAuthToken(null);
  };

  // Update Profile
  const updateProfile = async (data) => {
    const response = await authApi.updateProfile(data);
    const updatedUser = response.data;
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  };

  // Change Password
  const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    const response = await authApi.changePassword(
      currentPassword,
      newPassword,
      confirmPassword
    );
    return response.data;
  };

  // Enable MFA
  const enableMFA = async () => {
    const response = await authApi.enableMFA();
    return response.data;
  };

  // Verify MFA Setup
  const verifyMFASetup = async (code) => {
    const response = await authApi.verifyMFASetup(code);
    const updatedUser = { ...user, mfa_enabled: true };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    return response.data;
  };

  // Disable MFA
  const disableMFA = async () => {
    const response = await authApi.disableMFA();
    const updatedUser = { ...user, mfa_enabled: false };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    return response.data;
  };

  const value = {
    user,
    loading,
    mfaPending,
    isAuthenticated: !!user,
    login,
    googleLogin,
    verifyMFA,
    register,
    logout,
    updateProfile,
    changePassword,
    enableMFA,
    verifyMFASetup,
    disableMFA,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ✅ Named export for useAuth hook (or you can keep it in a separate file)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ✅ Default export for backward compatibility
export default AuthContext;