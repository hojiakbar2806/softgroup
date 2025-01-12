import { Templates } from "@/types/template";
import { baseApi } from "./baseApi";
import { IUser } from "@/types/user";

const userService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserTemplates: builder.query<Templates, void>({
      query: () => `/users/templates`,
      providesTags: ["Template"],
    }),

    getMe: builder.query<IUser, void>({
      query: () => `/users/me`,
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUserTemplatesQuery, useGetMeQuery } = userService;
