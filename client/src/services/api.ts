import axios, { type InternalAxiosRequestConfig } from "axios";
import { firebaseAuth } from "./firebase";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const user = firebaseAuth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export default api;
