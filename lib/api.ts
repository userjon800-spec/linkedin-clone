import axios from "axios";
// Server va Client uchun baseURL ni aniqlash
const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXTAUTH_URL ||
  "http://localhost:3000";
const api = axios.create({
  baseURL,
  withCredentials: true,
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // KOD FAQAT BRAUZERDA (CLIENT) ISHLAYOTGANINI TEKSHIRAMIZ
      if (typeof window !== "undefined") {
        try {
          await axios.post(
            `${baseURL}/api/auth/refresh`,
            {},
            { withCredentials: true },
          );
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh ham o'xshamasa signin sahifasiga yo'naltiramiz
          window.location.href = "/auth/signin";
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  },
);
export default api;
