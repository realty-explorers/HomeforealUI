import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { searchSlice } from "./slices/searchSlice";
import { locationReducer } from './slices/locationSlice';
import { filterReducer } from './slices/filterSlice';
import { propertiesReducer } from "./slices/propertiesSlice";
import { createWrapper } from "next-redux-wrapper";
import { locationApi } from "./services/locationApiService";
import { propertiesApi } from "./services/propertiesApiService";

export const store = configureStore({
    reducer: {
        location: locationReducer,
        filter: filterReducer,
        properties: propertiesReducer,
        [locationApi.reducerPath]: locationApi.reducer,
        [propertiesApi.reducerPath]: propertiesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(locationApi.middleware).concat(propertiesApi.middleware),
    devTools: true,
});

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;