import { Template, Templates } from "@/types/template";
import { baseApi } from "./baseApi";

const templateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTemplates: builder.query<Templates, string>({
      query: (filter) => `/templates?${filter}`,
      providesTags: ["Template"],
    }),

    getTemplateWithSlug: builder.query<Template, string>({
      query: (slug) => `/templates/${slug}`,
      providesTags: ["Template"],
    }),
  }),
});

export const { useGetAllTemplatesQuery, useGetTemplateWithSlugQuery } =
  templateApi;

export default templateApi;
