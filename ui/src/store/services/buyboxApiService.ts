import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const baseUrl = process.env.NEXT_PUBLIC_BUYBOX_API_URL;
const baseUrl = 'http://20.253.72.70:8001/buyboxes';
const GENERAL_BUYBOX_ID = '3dbf8068-bfda-4422-af27-7597045dac6e';

export const buyBoxApi = createApi({
  reducerPath: 'buyboxApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getBuyBoxesIds: builder.query({
      query: () => ({ url: 'all' }),
      transformResponse: (response: any) => response
    }),

    getLeads: builder.query({
      query: () => ({ url: `leads/${GENERAL_BUYBOX_ID}` }),
      transformResponse: (response: any) => response
    })
  })
});

export const buyBoxApiEndpoints = buyBoxApi.endpoints;

export const { useLazyGetLeadsQuery, useGetBuyBoxesIdsQuery } = buyBoxApi;
