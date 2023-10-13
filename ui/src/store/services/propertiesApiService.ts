import Deal from "@/models/deal";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import data from "./mockData.json";

// const baseUrl = process.env.NEXT_PUBLIC_PROPERTIES_API_URL;
const baseUrl = "http://localhost:8000/";
const GENERAL_BUYBOX_ID = "1fc03787-65ca-44b2-aec3-f9b707a2748f";

export const propertiesApi = createApi({
  reducerPath: "propertiesApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getProperties: builder.query({
      // query: ({ type, state, city, zipCode, neighborhood }) => {
      //   // `loc_properties?buybox_id=${GENERAL_BUYBOX_ID}&city=${city}&neighborhood=${"Central southwest"}`,
      //   let queryUrl = "";
      //   switch (type) {
      //     case "city":
      //       queryUrl = new URLSearchParams({ city }).toString();
      //       break;
      //     case "neighborhood":
      //       queryUrl = new URLSearchParams({ city, neighborhood })
      //         .toString();
      //       break;
      //     default:
      //       queryUrl = "";
      //       break;
      //   }
      //   return `loc_properties?buybox_id=${GENERAL_BUYBOX_ID}&${queryUrl}`;
      //   // return `loc_properties?buybox_id=${GENERAL_BUYBOX_ID}&city=${city}&neighborhood=${neighborhood}&zipcode=${zipCode}`;
      // },
      query: () => "",
      transformResponse: (response: any) => {
        try {
          const set = [];
          const a = data[0];
          for (let i = 0; i < 50; i++) {
            a.property.longitude = a.property.longitude + 0.00001 * i;
            a.property.latitude = a.property.latitude + 0.00001 * i;
            a.source_id = a.source_id + i;
            set.push(JSON.parse(JSON.stringify(a)));
          }
          console.log(set);
          return set;
          // return response.slice(0, 50);
        } catch (e) {
          console.log(e);
        }
      },
    }),

    getDeals: builder.query({
      // query: (location) => ({ url: "findGeneralDeals", params: location }),
      // query: (location) => `findGeneralDeals?display=${location.display}&type=${location.type}&city=${location.city}&state=${location.state}`,

      query: ({ display, type, city, state }) =>
        `findGeneralDeals?display=${display}&type=${type}&city=${city}&state=${state}`,
      transformResponse: (response: any) => response,
    }),
  }),
});

export const propertiesApiEndpoints = propertiesApi.endpoints;

export const {
  useGetPropertiesQuery,
  useLazyGetPropertiesQuery,
  // useLazyGetDealsQuery,
} = propertiesApi;
