import { signOut } from 'next-auth/react';
import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery
} from '@reduxjs/toolkit/query/react';
import { logout } from '../slices/authSlice';
import { getServerSession } from 'next-auth/next';

const baseUrl = process.env.NEXT_PUBLIC_OFFER_SERVICE_URL;

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
    await signOut({
      redirect: true,
      callbackUrl: '/'
    });
    api.dispatch(logout());
  }
  return result;
};

export const offerApi = createApi({
  reducerPath: 'offerApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Offer', 'Realtor'],
  endpoints: (builder) => ({
    createOffer: builder.mutation({
      query: (body) => ({
        url: '/offers',
        method: 'POST',
        body
      })
    }),
    approveOffer: builder.mutation({
      query: ({ offerId }) => ({
        url: `/offers/${offerId}/approve`,
        method: 'POST'
      }),
      invalidatesTags: ['Offer']
    }),

    deleteOffer: builder.mutation({
      query: ({ offerId }) => ({
        url: `/offers/${offerId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Offer']
    }),

    getOffers: builder.query({
      query: () => ({ url: '/offers' })
    }),

    getAllOffers: builder.query({
      query: () => ({ url: '/offers/all' }),
      providesTags: ['Offer']
    }),
    getAllRealtors: builder.query({
      query: () => ({ url: '/realtors' }),
      providesTags: ['Realtor']
    }),
    approveRealtor: builder.mutation({
      query: ({ realtorId }) => ({
        url: `/realtors/${realtorId}/approve`,
        method: 'POST'
      }),
      invalidatesTags: ['Realtor']
    })
  })
});

export const offerApiEndpoints = offerApi.endpoints;

export const {
  useCreateOfferMutation,
  useLazyGetOffersQuery,
  useLazyGetAllOffersQuery,
  useLazyGetAllRealtorsQuery,
  useGetAllOffersQuery,
  useGetAllRealtorsQuery,
  useApproveOfferMutation,
  useApproveRealtorMutation,
  useDeleteOfferMutation
} = offerApi;
