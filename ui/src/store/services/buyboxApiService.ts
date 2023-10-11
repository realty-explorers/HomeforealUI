import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { logout } from "../slices/authSlice";

// const baseUrl = process.env.NEXT_PUBLIC_BUYBOX_API_URL;
const baseUrl = "http://localhost:8000/buybox";
const GENERAL_BUYBOX_ID = "3dbf8068-bfda-4422-af27-7597045dac6e";

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: async (headers, { getState }) => {
    let token = (getState() as RootState).auth.token;

    if (!token) {
      try {
        const request = await fetch("/api/protected");
        token = (await request.json()).accessToken;
      } catch (e) {
        console.log(e);
      }
    }

    // If we have a token set in state, let's assume that we should be passing it.
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any,
) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 403) {
    //TODO: fetch new accessToken using refresh token and update auth state and recall the api
  } else if (result?.error?.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

export const buyBoxApi = createApi({
  reducerPath: "buyboxApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["BuyBox"],
  endpoints: (builder) => ({
    getBuyBoxes: builder.query({
      query: () => ({ url: "all" }),
      transformResponse: (response: any) => response,
      providesTags: ["BuyBox"],
    }),
    createBuyBox: builder.mutation({
      query: (body) => ({
        url: "",
        method: "POST",
        body: { "json_params": body },
      }),
      transformResponse: (response: any) => response,
      invalidatesTags: ["BuyBox"],
    }),
    updateBuyBox: builder.mutation({
      query: (body) => ({
        url: ``,
        method: "PUT",
        body: { "json_params": body.data, "buybox_id": body.id },
      }),
      transformResponse: (response: any) => response,
      // async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
      //   const patchResult = dispatch(
      //     buyBoxApi.util.updateQueryData(
      //       "getBuyBoxes",
      //       "1",
      //       (draftBuyBoxes) => {
      //         const draft = draftBuyBoxes.find((buyBox) => buyBox.id === id);
      //         if (draft) {
      //           Object.assign(draft, {
      //             ...patch,
      //           });
      //         }
      //       },
      //     ),
      //   );
      //
      //   try {
      //     await queryFulfilled;
      //   } catch {
      //     patchResult.undo();
      //   }
      //   // queryFulfilled.catch(patchResult.undo);
      // },
      invalidatesTags: (
        result,
        error,
        arg,
      ) => [{ type: "BuyBox", id: arg.id }],
      // invalidatesTags: ["BuyBox"],
    }),
    deleteBuyBox: builder.mutation({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response,
      invalidatesTags: (result, error, arg) => [{ type: "BuyBox", id: arg.id }],
    }),

    getLeads: builder.query({
      query: () => ({ url: `leads/${GENERAL_BUYBOX_ID}` }),
      transformResponse: (response: any) => response,
    }),
  }),
});

export const buyBoxApiEndpoints = buyBoxApi.endpoints;

export const {
  useLazyGetLeadsQuery,
  useGetBuyBoxesQuery,
  useLazyGetBuyBoxesQuery,
  useCreateBuyBoxMutation,
  useUpdateBuyBoxMutation,
  useDeleteBuyBoxMutation,
} = buyBoxApi;
