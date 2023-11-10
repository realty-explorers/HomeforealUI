import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { logout } from "../slices/authSlice";

const baseUrl = process.env.NEXT_PUBLIC_ANALYSIS_API_URL;
// const baseUrl = "http://172.171.238.111:8001/analysis";
const GENERAL_BUYBOX_ID = "3dbf8068-bfda-4422-af27-7597045dac6e";

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

export const analysisApi = createApi({
  reducerPath: "analysisApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["BuyBoxLeads", "BuyBoxLeadsCount", "SelectedComps"],
  endpoints: (builder) => ({
    getLeads: builder.query({
      query: ({ id, skip, limit }) => ({
        url: `summary?buybox_id=${id}&skip=${skip}&limit=${limit}`,
      }),
      transformResponse: (response: any) => response,
      providesTags: ["BuyBoxLeads"],
    }),
    getLeadsCount: builder.query({
      query: (id) => ({
        url: `count?buybox_id=${id}`,
      }),
      transformResponse: (response: any) => response,
      providesTags: ["BuyBoxLeadsCount"],
    }),
    calculateComps: builder.mutation({
      query: ({ buybox_id, source_id, list_of_comps, analysis_comp_name }) => ({
        url: "edit-comps",
        method: "POST",
        body: {
          "buybox_id": buybox_id,
          "source_id": source_id,
          "list_of_comps": list_of_comps,
          "analysis_comp_name": analysis_comp_name,
        },
      }),
      transformResponse: (response: any) => response,
      invalidatesTags: ["SelectedComps"],
    }),
  }),
});

export const analysisApiEndpoints = analysisApi.endpoints;

export const {
  useGetLeadsQuery,
  useLazyGetLeadsQuery,
  useGetLeadsCountQuery,
  useCalculateCompsMutation,
} = analysisApi;
