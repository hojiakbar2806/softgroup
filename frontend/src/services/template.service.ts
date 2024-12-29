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
