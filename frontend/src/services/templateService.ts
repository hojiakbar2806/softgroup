import { Template, Templates } from "@/types/template";
import { baseApi } from "./baseApi";

const templateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTemplates: builder.query<Templates, string>({
      query: (filter) => `/templates?${filter}`,
      providesTags: ["Template"],
    }),

    createTemplate: builder.mutation<Template, FormData>({
      query: (data) => ({
        url: "/templates",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Template"],
    }),

    getTemplateWithSlug: builder.query<Template, string>({
      query: (slug) => `/templates/${slug}`,
      providesTags: ["Template"],
    }),

    addRate: builder.mutation<any, { slug: string; rate: number }>({
      query: (data) => ({
        url: `/template/add-rating/${data.slug}?rating=${data.rate}`,
        method: "PATCH",
      }),
    }),

    downloadTemplate: builder.mutation<Blob, string>({
      query: (slug) => ({
        url: `/templates/download/${slug}`,
        method: "GET",
        responseHandler: (res) => res.blob(),
      }),
    }),

    deleteTemplate: builder.mutation<any, string>({
      query: (slug) => ({
        url: `/templates/${slug}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateTemplateMutation,
  useGetAllTemplatesQuery,
  useGetTemplateWithSlugQuery,
  useDownloadTemplateMutation,
  useDeleteTemplateMutation,
  useAddRateMutation,
} = templateApi;

export default templateApi;
