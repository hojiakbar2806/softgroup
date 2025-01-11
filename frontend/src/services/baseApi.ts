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
import { RootState } from "../store";
import { RefreshTokenResponse } from "@/types/user";
import { clearAllData } from "@/lib/utils";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://api.softgroup.uz",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,unknown,
  FetchBaseQueryError,
  object,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    try {
      const refreshResult = (await baseQuery(
        { url: "/auth/refresh-token", method: "POST" },
        api,
        extraOptions
      )) as { data?: RefreshTokenResponse };

      if (refreshResult.data?.access_token) {
        api.dispatch(
          setCredentials({
            token: refreshResult.data.access_token,
          })
        );
      }
      result = await baseQuery(args, api, extraOptions);
      if (result.error && result.error.status === 401) {
        clearAllData();
        api.dispatch(logout());
        const locale = window.location.pathname.split("/")[1];
        window.location.href = `/${locale || "uz"}/login`;
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      clearAllData();
      api.dispatch(logout());
      const locale = window.location.pathname.split("/")[1];
      window.location.href = `/${locale || "uz"}/login`;
    }
  }
  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ["Auth", "User", "Template"],
});
