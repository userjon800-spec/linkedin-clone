// lib\api.ts
import axios from "axios";
const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXTAUTH_URL ||
  "http://localhost:3000";
const api = axios.create({
  baseURL,
  withCredentials: true,
});
// Parallel so'rovlarni navbatga qo'yish uchun o'zgaruvchilar
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];
const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // 1. MUHIM: Agar xatosi 401 bo'lsa VA so'rov /auth/refresh NING O'ZI BO'LMASA
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      // 2. Client side ekanligini tekshiramiz
      if (typeof window !== "undefined") {
        // Agar token hozirgina boshqa so'rov orqali yangilanayotgan bo'lsa, ushbu so'rovni navbatga qo'yamiz
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => api(originalRequest))
            .catch((err) => Promise.reject(err));
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try {
          // Tokenni yangilash
          await axios.post(
            `${baseURL}/api/auth/refresh`,
            {},
            { withCredentials: true },
          );
          // Navbatda turgan barcha so'rovlarga "token yangilandi" ruxsatini beramiz
          processQueue(null);
          // Asosiy so'rovni qayta yuboramiz
          return api(originalRequest);
        } catch (refreshError) {
          // Navbatdagi so'rovlarni rad etamiz
          processQueue(refreshError);
          // Refresh ham yaroqsiz bo'lsa, login sahifasiga o'tkazamiz
          window.location.href = "/auth/signin";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }
    return Promise.reject(error);
  },
);
export default api;