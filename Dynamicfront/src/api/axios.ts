import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Send httpOnly cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Response interceptor: redirect to /login on 401 ────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if already on login/register pages
      const currentPath = window.location.pathname;
      const publicPaths = ["/", "/login", "/admin/login", "/register", "/unauthorized"];
      
      if (!publicPaths.includes(currentPath)) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
