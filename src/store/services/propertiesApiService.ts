import AnalyzedProperty from '@/models/analyzedProperty';
import PropertyPreview from '@/models/propertyPreview';
import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery
} from '@reduxjs/toolkit/query/react';
import { signOut } from 'next-auth/react';
import { logout } from '../slices/authSlice';

const baseUrl = `${process.env.NEXT_PUBLIC_ANALYSIS_API_URL}/v1/analysis`;
const GENERAL_BUYBOX_ID = '3dbf8068-bfda-4422-af27-7597045dac6e';

const API_KEY = 'test-api-key';
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

export const propertiesApi = createApi({
  reducerPath: 'propertiesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Previews'],
  endpoints: (builder) => ({
    getPropertiesPreviews: builder.query({
      query: ({
        suggestion: { type, state, city, zipCode, neighborhood },
        buybox_id,
        masked
      }) => {
        // `loc_properties?buybox_id=${GENERAL_BUYBOX_ID}&city=${city}&neighborhood=${"Central southwest"}`,
        const query = {};
        switch (type) {
          case 'city':
            query['city'] = city.toLowerCase();
            break;
          case 'neighborhood':
            query['city'] = city.toLowerCase();
            query['neighborhood'] = neighborhood;
            break;
          default:
            break;
        }
        if (!masked) {
          query['masked'] = masked;
        }
        let queryUrl = '';
        if (Object.keys(query).length > 0) {
          queryUrl = `?${new URLSearchParams(query).toString()}`;
        }
        return `/previews/buybox/${buybox_id}${queryUrl}`;
      },
      transformResponse: (response: PropertyPreview[]) => {
        try {
          // const set = [];
          // const a = data[0];
          // for (let i = 0; i < 50; i++) {
          //   a.property.longitude = a.property.longitude + 0.00001 * i;
          //   a.property.latitude = a.property.latitude + 0.00001 * i;
          //   a.source_id = a.source_id + i;
          //   set.push(JSON.parse(JSON.stringify(a)));
          // }
          // console.log(set);
          // return set;
          // return response.slice(0, 50);
          return response;
        } catch (e) {
          console.log(e);
        }
      }
    }),
    getProperties: builder.query({
      query: ({ type, state, city, zipCode, neighborhood }) => {
        // `loc_properties?buybox_id=${GENERAL_BUYBOX_ID}&city=${city}&neighborhood=${"Central southwest"}`,
        const query = {};
        switch (type) {
          case 'city':
            query['city'] = city.toLowerCase();
            break;
          case 'neighborhood':
            query['city'] = city.toLowerCase();
            query['neighborhood'] = neighborhood;
            break;
          default:
            break;
        }
        const queryUrl = new URLSearchParams(query).toString();
        return `leads/?buyboxId=${GENERAL_BUYBOX_ID}&${queryUrl}`;
      },
      transformResponse: (response: AnalyzedProperty[]) => {
        try {
          // const set = [];
          // const a = data[0];
          // for (let i = 0; i < 50; i++) {
          //   a.property.longitude = a.property.longitude + 0.00001 * i;
          //   a.property.latitude = a.property.latitude + 0.00001 * i;
          //   a.source_id = a.source_id + i;
          //   set.push(JSON.parse(JSON.stringify(a)));
          // }
          // console.log(set);
          // return set;
          // return response.slice(0, 50);
          response.sort((a, b) => {
            if (a.arvPrice && !b.arvPrice) return -1;
            if (!a.arvPrice && b.arvPrice) return 1;
            if (!a.arvPrice && !b.arvPrice) return 0;
            if (a.arvPrice > b.arvPrice) return 1;
            if (a.arvPrice < b.arvPrice) return -1;
            return 0;
          });
          return response;
        } catch (e) {
          console.log(e);
        }
      }
    }),

    getProperty: builder.query({
      query: ({ buybox_id, property_id, masked }) => {
        const query = {};
        if (!masked) {
          query['masked'] = masked;
        }

        let queryUrl = '';
        if (Object.keys(query).length > 0) {
          queryUrl = `?${new URLSearchParams(query).toString()}`;
        }
        return `/${property_id}${queryUrl}`;
      },
      transformResponse: async (response: AnalyzedProperty) => {
        try {
          return response;
        } catch (e) {
          console.log(e);
        }
      }
    }),

    getDeals: builder.query({
      // query: (location) => ({ url: "findGeneralDeals", params: location }),
      // query: (location) => `findGeneralDeals?display=${location.display}&type=${location.type}&city=${location.city}&state=${location.state}`,

      query: ({ display, type, city, state }) =>
        `findGeneralDeals?display=${display}&type=${type}&city=${city}&state=${state}`,
      transformResponse: (response: any) => response
    })
  })
});

export const propertiesApiEndpoints = propertiesApi.endpoints;

export const {
  useGetPropertiesQuery,
  useLazyGetPropertyQuery,

  useLazyGetPropertiesPreviewsQuery,
  useGetPropertiesPreviewsQuery
  // useLazyGetDealsQuery,
} = propertiesApi;
