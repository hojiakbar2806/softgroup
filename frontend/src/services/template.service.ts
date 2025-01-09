import { Template, Templates } from "@/types/template";
import { axiosWithAuth, defaultAxios } from "./api.service";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export const CreateTemplateService = async (data: FormData) => {
  try {
    const res = await axiosWithAuth.post("/templates", data, {
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

export const GetAllTemplateService = async (
  params?: string
): Promise<Templates> => {
  let endpoint = "/templates";
  if (params) {
    endpoint = `/templates?${params}`;
  }
  const res = await defaultAxios.get(endpoint);
  return res.data;
};

export const GetTemplateWithSlugService = async (
  slug: string
): Promise<Template> => {
  const res = await defaultAxios.get(`/templates/${slug}`);
  return res.data;
};

export const GetCategoriesService = async () => {
  const res = await defaultAxios.get("/categories");
  return res.data;
};

export const CreateCategoryService = async (data: FormData) => {
  const res = await defaultAxios.post("/categories", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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
