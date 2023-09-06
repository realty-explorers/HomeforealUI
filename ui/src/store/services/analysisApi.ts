import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const baseUrl = process.env.NEXT_PUBLIC_analysis_API_URL;
const baseUrl = 'http://20.253.72.70:8001/analysis';
const GENERAL_BUYBOX_ID = '3dbf8068-bfda-4422-af27-7597045dac6e';

export const analysisApi = createApi({
  reducerPath: 'analysisApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getSummary: builder.query({
      query: () => ({ url: `summary/${GENERAL_BUYBOX_ID}` }),
      transformResponse: (response: any) => response
    }),
    getLeads: builder.query({
      query: (id) => `leads/${id}`
      // transformResponse: (response) => response
    })
  })
});

export const analysisApiEndpoints = analysisApi.endpoints;

export const { useGetSummaryQuery, useGetLeadsQuery } = analysisApi;
