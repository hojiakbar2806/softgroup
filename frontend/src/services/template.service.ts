import { Template } from "@/types/template";
import { axiosWithAuth, defaultAxios } from "./api.service";

export const SearchProduct = async (query: string) => {
  const URL = query ? `/products/?query=${query}` : "/products";
  return await defaultAxios.get(URL);
};

export const AddTemplateService = async (data: FormData) => {
  return await axiosWithAuth.post("/templates/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const GetAllTemplateService = async (): Promise<Template[]> => {
  const res = await defaultAxios.get("/templates/");
  return res.data;
};

export const GetTemplateWithSlugService = async (
  slug: string
): Promise<Template> => {
  const res = await defaultAxios.get(`/templates/${slug}`);
  return res.data;
};
