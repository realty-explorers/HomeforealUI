import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../store";

// Type for our state
export interface BuyBoxesState {
  buyboxes: {
    [buybox_id: string]: {
      open: boolean;
      page: number;
      pageSize: number;
    };
  };
}

// Initial state
const initialState: BuyBoxesState = {
  buyboxes: {},
};

// Actual Slice
export const buyBoxesSlice = createSlice({
  name: "buyboxes",
  initialState,
  reducers: {
    // Action to set the authentication status
    setBuyBoxOpen(
      state,
      action: PayloadAction<{ buybox_id: string; open: boolean }>,
    ) {
      if (!(action.payload.buybox_id in state.buyboxes)) {
        state.buyboxes[action.payload.buybox_id] = {
          open: action.payload.open,
          page: 1,
          pageSize: 5,
        };
      } else {
        state.buyboxes[action.payload.buybox_id].open = action.payload.open;
      }
    },

    setBuyBoxPage(
      state,
      action: PayloadAction<{ buybox_id: string; page: number }>,
    ) {
      if (!(action.payload.buybox_id in state.buyboxes)) {
        state.buyboxes[action.payload.buybox_id] = {
          open: false,
          page: action.payload.page,
          pageSize: 5,
        };
      } else {
        state.buyboxes[action.payload.buybox_id].page = action.payload.page;
      }
    },
    setBuyBoxPageSize(
      state,
      action: PayloadAction<{ buybox_id: string; pageSize: number }>,
    ) {
      if (!(action.payload.buybox_id in state.buyboxes)) {
        state.buyboxes[action.payload.buybox_id] = {
          open: false,
          page: 1,
          pageSize: action.payload.pageSize,
        };
      } else {
        state.buyboxes[action.payload.buybox_id].pageSize =
          action.payload.pageSize;
      }
    },
  },
});

export const buyBoxesReducer = buyBoxesSlice.reducer;
export const {
  setBuyBoxOpen,
  setBuyBoxPage,
  setBuyBoxPageSize,
} = buyBoxesSlice.actions;
export const selectBuyBoxes: (state: AppState) => BuyBoxesState = (
  state: AppState,
) => state.buyBoxes;

export default buyBoxesSlice;
