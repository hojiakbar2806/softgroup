import { IUserUpdate } from "@/types/user";
import { axiosWithAuth } from "./api.service";

export const MyProfileService = async () => {
  const res = await axiosWithAuth.get("/user/me");
  return res.data;
};

export const UpdateProfileService = async (data: IUserUpdate) => {
  return await axiosWithAuth.patch("/user", data);
};

export const MyTemplatesService = async () => {
  const res = await axiosWithAuth.get("/user/my-templates");
  return res.data;
};

