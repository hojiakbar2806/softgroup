import { Template } from "@/types/template";
import { axiosWithAuth, defaultAxios } from "./api.service";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export const SearchTemplateService = async (query: string) => {
  return await defaultAxios.get(`/template/search/?query=${query}`);
};

export const AddTemplateService = async (data: FormData) => {
  try {
    const res = await axiosWithAuth.post("/template/create", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success(res.data.message);
    return res.data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      toast.warning(error.response?.data.detail || "Template failed");
    }
  }
};

export const GetAllTemplateService = async (): Promise<Template[]> => {
  const res = await defaultAxios.get("/template/all");
  return res.data;
};

export const GetTemplateWithSlugService = async (
  slug: string
): Promise<Template> => {
  const res = await defaultAxios.get(`/template/${slug}`);
  return res.data;
};

export const AddRateService = async (data: { slug: string; rate: number }) => {
  try {
    const res = await axiosWithAuth.patch(
      `/template/add/rating/${data.slug}?rating=${data.rate}`
    );
    toast.success(res.data.message);
    return res.data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      toast.warning(error.response?.data.detail || "Rate failed");
    }
  }
};
