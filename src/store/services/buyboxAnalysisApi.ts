import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery
} from '@reduxjs/toolkit/query/react';
import { logout } from '../slices/authSlice';

const baseUrl = process.env.NEXT_PUBLIC_ANALYSIS_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: async (headers, { getState }) => {
    let token = (getState() as RootState).auth.token;

    if (!token) {
      try {
        const request = await fetch('/api/protected');
        token = (await request.json()).accessToken;
      } catch (e) {
        console.log(e);
      }
    }

    // If we have a token set in state, let's assume that we should be passing it.
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    headers.set('X-Service', 'analysis');

    return headers;
  }
});
const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 403) {
    //TODO: fetch new accessToken using refresh token and update auth state and recall the api
  } else if (result?.error?.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

export const buyboxAnalysisApi = createApi({
  reducerPath: 'buyboxAnalysisApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    analyzeBuyBox: builder.mutation({
      query: (buybox_id) => ({
        url: `/Analyze?buyboxId=${buybox_id}`,
        method: 'POST'
      }),
      transformResponse: (response: any) => response
    })
  })
});

export const buyboxAnalysisApiEndpoints = buyboxAnalysisApi.endpoints;

export const { useAnalyzeBuyBoxMutation } = buyboxAnalysisApi;
