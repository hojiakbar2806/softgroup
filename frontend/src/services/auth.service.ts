import { IUserLogin, IUserRegister } from "@/types/user";
import { toast } from "sonner";
import { axiosWithCredentials, defaultAxios } from "./api.service";
import { isAxiosError } from "axios";
import { useAuthStore } from "@/store/authStore";

export const LoginService = async (data: IUserLogin) => {
  try {
    const res = await axiosWithCredentials.post("auth/login", data);
    toast.success(res.data.message);
    const { setAuth } = useAuthStore.getState();
    setAuth(res.data.access_token);
    const urlParams = new URLSearchParams(window.location.search);
    const nextPath = urlParams.get("next") || "/";
    window.location.href = nextPath;
    return res;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      toast.error(error.response?.data.detail || "Login failed");
    }
  }
};

export const RegisterService = async (data: IUserRegister) => {
  try {
    const res = await defaultAxios.post("auth/register", data);
    toast.success(res.data.message);
    const { setAuth } = useAuthStore.getState();
    setAuth(res.data.access_token);
    const urlParams = new URLSearchParams(window.location.search);
    const nextPath = urlParams.get("next") || "/";
    window.location.href = nextPath;
    return res;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      toast.error(error.response?.data.detail || "Register failed");
    }
  }
};

export const LogoutService = async () => {
  try {
    const res = await axiosWithCredentials.post("auth/logout");
    toast.success(res.data.message);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      toast.error(error.response?.data.detail || "Logout failed");
    }
  }
};

export const ActivateService = async (token: string) => {
  return await axiosWithCredentials.post(`/auth/activate/${token}`);
};

export const SessionService = async () => {
  return await axiosWithCredentials.post("/auth/refresh-token");
};
