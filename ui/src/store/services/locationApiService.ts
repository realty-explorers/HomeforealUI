import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.NEXT_PUBLIC_LOCATION_API_URL;

export const locationApi = createApi({
    reducerPath: "locationApi",
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getLocationSuggestion: builder.query({
            // query: ({ searchTerm }) => ({ url: "suggest", params: { searchTerm } }),
            query: (searchTerm) => `suggest?searchTerm=${searchTerm}`,
            transformResponse: (response: any) => response,
        }),
        getLocationData: builder.query({
            // query: ({ display, type, city, state }) => ({ url: "data", params: { display, type, city, state } }),
            query: ({ display, type, city, state }) => `data?display=${display}&type=${type}&city=${city}&state=${state}`,
            transformResponse: (response: any) => response,
        }),
    }),
})

export const locationApiEndpoints = locationApi.endpoints;

export const { useGetLocationSuggestionQuery, useLazyGetLocationSuggestionQuery, useGetLocationDataQuery, useLazyGetLocationDataQuery } = locationApi;