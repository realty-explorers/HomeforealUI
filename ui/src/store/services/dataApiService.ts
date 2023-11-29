import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  RootState,
} from "@reduxjs/toolkit/query/react";
import { logout } from "../slices/authSlice";

const baseUrl = process.env.NEXT_PUBLIC_DATA_API_URL;

const API_KEY = "o63cMy45PuLH8sRs8iEP";
const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: async (headers, { getState }) => {
    headers.set("API-Key", API_KEY);

    return headers;
  },
});

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any,
) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 403) {
    //TODO: fetch new accessToken using refresh token and update auth state and recall the api
  } else if (result?.error?.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

export const dataApi = createApi({
  reducerPath: "dataApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Locations"],
  endpoints: (builder) => ({
    getLocations: builder.query({
      query: () => ({ url: "get_all_locations" }),
      transformResponse: (response: any) => response,
      providesTags: ["Locations"],
    }),
  }),
});

export const dataApiEndpoints = dataApi.endpoints;

export const {
  useLazyGetLocationsQuery,
  useGetLocationsQuery,
} = dataApi;
