import AnalyzedProperty from '@/models/analyzedProperty';
import PropertyPreview from '@/models/propertyPreview';
import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery
} from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.NEXT_PUBLIC_ANALYSIS_API_URL;
const GENERAL_BUYBOX_ID = '3dbf8068-bfda-4422-af27-7597045dac6e';

const API_KEY = 'o63cMy45PuLH8sRs8iEP';
const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: async (headers, { getState }) => {
    headers.set('X-Service', 'scraper');
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
    console.log('401');
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
        buybox_id
      }) => {
        // `loc_properties?buybox_id=${GENERAL_BUYBOX_ID}&city=${city}&neighborhood=${"Central southwest"}`,
        let queryUrl = '/Results';
        switch (type) {
          case 'city':
            queryUrl = new URLSearchParams({
              city: city.toLowerCase()
            }).toString();
            break;
          case 'neighborhood':
            queryUrl = new URLSearchParams({
              city: city.toLowerCase(),
              neighborhood
            }).toString();
            break;
          default:
            queryUrl = '';
            break;
        }
        return `/Previews?buybox_id=${buybox_id}&${queryUrl}`;
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
        let queryUrl = '';
        switch (type) {
          case 'city':
            queryUrl = new URLSearchParams({ city }).toString();
            break;
          case 'neighborhood':
            queryUrl = new URLSearchParams({ city, neighborhood }).toString();
            break;
          default:
            queryUrl = '';
            break;
        }
        return `leads/?buybox_id=${GENERAL_BUYBOX_ID}&${queryUrl}`;
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
            if (a.arv_price && !b.arv_price) return -1;
            if (!a.arv_price && b.arv_price) return 1;
            if (!a.arv_price && !b.arv_price) return 0;
            if (a.arv_price > b.arv_price) return 1;
            if (a.arv_price < b.arv_price) return -1;
            return 0;
          });
          return response;
        } catch (e) {
          console.log(e);
        }
      }
    }),

    getProperty: builder.query({
      query: ({ buybox_id, property_id }) => {
        return `/AnalyzedProperty/?resultId=${property_id}`;
      },
      transformResponse: (response: AnalyzedProperty) => {
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
