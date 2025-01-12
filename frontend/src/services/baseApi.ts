import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../features/auth/authSlice";
import { clearAllData } from "@/lib/utils";
import { openModal } from "@/features/modal/loginMessageModalSlice";
import { RootState } from "@/lib/store";
import { BASE_URL } from "@/lib/const";

const getConfig = async (locale: string) => {
  if (!locale || !["uz", "en", "ru"].includes(locale)) {
    locale = "uz";
  }
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
};

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("Cache-Control", "no-store");
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  object,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  // const state = api.getState() as RootState;
  // if (state.auth.isAuthenticated === false) {
  //   return baseQuery(args, api, extraOptions);
  // }
  let result = await baseQuery(args, api, extraOptions);
  const protectedEndpoints = [
    "getUserTemplates",
    "downloadTemplate",
    "getMe",
    "addLike",
  ];

  if (
    result.error &&
    result.error.status === 403 &&
    protectedEndpoints.includes(api.endpoint)
  ) {
    const refreshResult = (await baseQuery(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions
    )) as any;

    if (refreshResult.error) {
      const locale = window.location.pathname.split("/")[1];
      const config = await getConfig(locale);

      if (refreshResult.error.status === 401) {
        api.dispatch(logout());
        clearAllData();
        api.dispatch(
          openModal({
            message: config.messages.Common.modal.refreshError,
            path: "/login",
            button: config.messages.Common.modal.login,
          })
        );
      }

      if (refreshResult.error.status === 403) {
        api.dispatch(
          openModal({
            message: config.messages.Common.modal.unauthorized,
            path: "/register",
            button: config.messages.Common.modal.register,
          })
        );
      }
    }

    if (refreshResult.data?.access_token) {
      api.dispatch(
        setCredentials({
          token: refreshResult.data.access_token,
        })
      );
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ["Auth", "User", "Template"],
});
