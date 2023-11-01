import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  RootState,
} from "@reduxjs/toolkit/query/react";
import { logout } from "../slices/authSlice";

const baseUrl = process.env.NEXT_PUBLIC_DATA_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: async (headers, { getState }) => {
    let token = (getState() as RootState).auth.token;

    if (!token) {
      try {
        const request = await fetch("/api/protected");
        token = (await request.json()).accessToken;
      } catch (e) {
        console.log(e);
      }
    }

    // If we have a token set in state, let's assume that we should be passing it.
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

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
