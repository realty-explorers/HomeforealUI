import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessToken } from "@auth0/nextjs-auth0";

const baseUrl = process.env.NEXT_PUBLIC_LOCATION_API_URL;

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["Suggestion", "LocationData"],
  endpoints: (builder) => ({
    getLocationSuggestion: builder.query({
      // query: ({ searchTerm }) => ({ url: "suggest", params: { searchTerm } }),
      query: (searchTerm) => `suggest?searchTerm=${searchTerm}`,
      transformResponse: (response: any) => response,
      providesTags: ["Suggestion"],
    }),
    getLocationData: builder.query({
      // query: ({ display, type, city, state }) => ({ url: "data", params: { display, type, city, state } }),
      query: ({ type, state, city, zipCode, neighborhood }) => {
        let queryUrl = "";
        switch (type) {
          case "city":
            queryUrl = new URLSearchParams({ type, state, city }).toString();
            break;
          case "neighborhood":
            queryUrl = new URLSearchParams({ type, state, city, neighborhood })
              .toString();
            break;
          default:
            queryUrl = new URLSearchParams({ type, state }).toString();
            break;
        }
        return `data?${queryUrl}`;
        // return `data?display=&type=${type}&city=${city}&state=${state}`;
      },
      transformResponse: (response: any) => response,
      providesTags: ["LocationData"],
    }),
  }),
});

export const locationApiEndpoints = locationApi.endpoints;

export const {
  useGetLocationSuggestionQuery,
  useLazyGetLocationSuggestionQuery,
  useGetLocationDataQuery,
  useLazyGetLocationDataQuery,
} = locationApi;
