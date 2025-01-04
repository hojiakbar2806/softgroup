import { useAuthStore } from "@/store/authStore";
import axios from "@/utils/axios";
const axiosWithAuth = axios.create();

axiosWithAuth.interceptors.request.use(async (config) => {
  const { getToken } = useAuthStore.getState();
  const token = await getToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosWithAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { refreshToken } = useAuthStore.getState();
    await refreshToken();
    return Promise.reject(error);
  }
);

const axiosWithCredentials = axios.create({ withCredentials: true });

axiosWithCredentials.interceptors.response.use(
  (response) => {
    document.cookie = "isLoggedIn=eyJhbGciOiJIU; path=/; SameSite=Lax";
    return response;
  },
  async (error) => {
    document.cookie = "isLoggedIn=; Max-Age=0; path=/;";
    window.location.reload();
    return Promise.reject(error);
  }
);

const defaultAxios = axios.create();

export { axiosWithAuth, axiosWithCredentials, defaultAxios };
