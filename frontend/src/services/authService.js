import api from "./api";

export const login = async (credentials) => {
  const response = await api.post("/login", credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};

export const logout = async () => {
  // Placeholder until backend logout endpoint is implemented
  return Promise.resolve();
};

const authService = {
  login,
  register,
  logout,
};

export default authService;