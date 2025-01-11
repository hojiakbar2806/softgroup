import { Templates } from "@/types/template";
import { baseApi } from "./baseApi";

const userService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserTemplates: builder.query<Templates, void>({
      query: () => `/users/templates`,
      providesTags: ["Template", "User"],
    }),
  }),
});

export const { useGetUserTemplatesQuery } = userService;
