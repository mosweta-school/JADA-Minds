import api from "./api";

export const login = async (credentials) => {
  return api.post("/login", credentials);
};

export const register = async (userData) => {
  return api.post("/register", userData);
};

export const logout = async () => {
  return Promise.resolve();
};

export default {
  login,
  register,
  logout,
};