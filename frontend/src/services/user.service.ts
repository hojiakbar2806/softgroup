import { IUserUpdate } from "@/types/user";
import { axiosWithAuth } from "./api.service";

export const MyProfileService = async () => {
  return await axiosWithAuth.get("/user/me");
};

export const UpdateProfileService = async (data: IUserUpdate) => {
  return await axiosWithAuth.patch("/user", data);
};
