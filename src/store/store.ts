import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { locationReducer } from './slices/locationSlice';
import { filterReducer } from './slices/filterSlice';
import { propertiesReducer } from './slices/propertiesSlice';
import { expensesReducer } from './slices/expensesSlice';
import { locationApi } from './services/locationApiService';
import { propertiesApi } from './services/propertiesApiService';
import { buyBoxApi } from './services/buyboxApiService';
import { analysisApi } from './services/analysisApi';
import { authReducer } from './slices/authSlice';
import { buyBoxesReducer } from './slices/buyBoxesSlice';
import { mapReducer } from './slices/mapSlice';
import { buyboxAnalysisApi } from './services/buyboxAnalysisApi';
import { userApi } from './services/userApi';
import { offerApi } from './services/offersApi';

export const store = configureStore({
  reducer: {
    location: locationReducer,
    filter: filterReducer,
    properties: propertiesReducer,
    auth: authReducer,
    buyBoxes: buyBoxesReducer,
    map: mapReducer,
    expenses: expensesReducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [propertiesApi.reducerPath]: propertiesApi.reducer,
    [buyBoxApi.reducerPath]: buyBoxApi.reducer,
    [analysisApi.reducerPath]: analysisApi.reducer,
    [buyboxAnalysisApi.reducerPath]: buyboxAnalysisApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [offerApi.reducerPath]: offerApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(locationApi.middleware)
      .concat(propertiesApi.middleware)
      .concat(analysisApi.middleware)
      .concat(buyBoxApi.middleware)
      .concat(buyboxAnalysisApi.middleware)
      .concat(userApi.middleware)
      .concat(offerApi.middleware),
  devTools: true
});

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
