import axios from "axios";
const api = axios.create({
  baseURL: process.env.NEXTAUTH_URL,
  withCredentials: true,
});
// Response (Javob) kelganda tutib oluvchi Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Agar server 401 (Unauthorized) qaytarsa va bu so'rov qayta urunish bo'lmasa
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Cheksiz siklga tushib qolmaslik uchun
      try {
        // 1. Orqa fonda sezdirmasdan Refresh token orqali yangi Access token so'raymiz
        await axios.post("/api/auth/refresh", {}, { withCredentials: true });
        // 2. Yangi token cookie-ga tushdi, endi uzilib qolgan so'rovni QAYTA bajaramiz
        return api(originalRequest);
      } catch (refreshError) {
        // Agar refresh token ham o'lgan bo'lsa (7 kun o'tgan), demak seans tugagan
        window.location.href = "/auth/signin";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
export default api;
