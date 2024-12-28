import { ISearchParams } from "@/types/mixin";
import { defaultAxios } from "./api.service";

export const SearchProduct = async (query: string) => {
  const URL = query ? `/products/?query=${query}` : "/products";
  return await defaultAxios.get(URL);
};

export const getProductsService = async (
  query: ISearchParams,
  productType: string
) => {
  const URL = query ? `product/${productType}/?query=${query}` : "/products";
  return await defaultAxios.get(URL);
};
