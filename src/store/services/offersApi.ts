import { signOut } from 'next-auth/react';
import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery
} from '@reduxjs/toolkit/query/react';
import { logout, setSigningOut } from '../slices/authSlice';
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
    const alreadySigningOut = (api.getState() as any)?.auth?.signingOut;
    if (!alreadySigningOut) {
      api.dispatch(setSigningOut(true));
      await signOut({
        redirect: true,
        callbackUrl: '/'
      });
      api.dispatch(logout());
    }
  }
  return result;
};

export const offerApi = createApi({
  reducerPath: 'offerApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Offer', 'Realtor', 'OfferTemplates'],
  endpoints: (builder) => ({
    createOffer: builder.mutation({
      query: (body) => ({
        url: '/offers',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Offer']
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
      query: ({ userId }) => ({ url: `/offers/user/${userId}/detailed` }),
      providesTags: ['Offer']
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
    }),
    getUserTemplates: builder.query({
      query: () => ({
        url: `/offers/template`
      }),
      providesTags: ['OfferTemplates']
    }),
    updateTemplate: builder.mutation({
      query: ({ templateId, body }) => ({
        url: `/offers/template/${templateId}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['OfferTemplates']
    }),
    createTemplate: builder.mutation({
      query: (body) => ({
        url: `/offers/template`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['OfferTemplates']
    }),
    deleteTemplate: builder.mutation({
      query: ({ templateId }) => ({
        url: `/offers/template/${templateId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['OfferTemplates']
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
  useDeleteOfferMutation,
  useGetUserTemplatesQuery,
  useUpdateTemplateMutation,
  useCreateTemplateMutation,
  useDeleteTemplateMutation
} = offerApi;
