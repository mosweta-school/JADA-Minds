import api from "./api";

export async function login(credentials) {
  return api.post("/login", credentials);
}

export async function register(userData) {
  return api.post("/register", userData);
}

export async function logout() {
  return Promise.resolve();
}