import { IUserUpdate } from "@/types/user";
import { axiosWithAuth } from "./api.service";

export const MyProfileService = async () => {
  return await axiosWithAuth.get("/users/me");
};

export const UpdateProfileService = async (data: IUserUpdate) => {
  return await axiosWithAuth.patch("/user", data);
};
