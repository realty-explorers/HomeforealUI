import Deal from '@/models/deal';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.NEXT_PUBLIC_PROPERTIES_API_URL;

export const propertiesApi = createApi({
    reducerPath: "propertiesApi",
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getProperties: builder.query({
            query: (location) => ({ url: "findProperties", params: location }),
            transformResponse: (response: any) => response,
        }),

        getDeals: builder.query({
            // query: (location) => ({ url: "findGeneralDeals", params: location }),
            // query: (location) => `findGeneralDeals?display=${location.display}&type=${location.type}&city=${location.city}&state=${location.state}`,

            query: ({ display, type, city, state }) => `findGeneralDeals?display=${display}&type=${type}&city=${city}&state=${state}`,
            transformResponse: (response: any) => response,
        }),
    }),
})

export const propertiesApiEndpoints = propertiesApi.endpoints;

export const { useGetPropertiesQuery, useLazyGetPropertiesQuery, useLazyGetDealsQuery } = propertiesApi;