import { MyTemplate } from "@/types/template";
import { baseApi } from "./baseApi";
import { IUser } from "@/types/user";

const userService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserTemplates: builder.query<MyTemplate[], void>({
      query: () => `/users/templates`,
      providesTags: ["Template"],
    }),

    getMe: builder.query<IUser, void>({
      query: () => `/users/me`,
      providesTags: ["User"],
    }),
    contactUs: builder.mutation({
      query: (data) => ({
        url: `/users/contact`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetUserTemplatesQuery, useGetMeQuery, useContactUsMutation } =
  userService;
