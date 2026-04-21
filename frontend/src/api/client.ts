import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const rawAuth = localStorage.getItem("taskflow_auth");

  if (rawAuth) {
    const auth = JSON.parse(rawAuth) as { token?: string };

    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
  }

  return config;
});

export default api;
