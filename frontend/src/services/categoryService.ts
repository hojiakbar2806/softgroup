import { ICategory } from "@/types/mixin";
import { baseApi } from "./baseApi";

const categoryService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<ICategory[], void>({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryService;
