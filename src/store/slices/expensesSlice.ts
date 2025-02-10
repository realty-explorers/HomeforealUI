import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../store";

// Type for our state
export interface Expenses {
  initialInvestment?: number;
  financingCosts?: number;
}

// Initial state
const initialState: Expenses = {
  initialInvestment: 0,
  financingCosts: 0,
};

// Actual Slice
export const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setInitialInvestment(state, action: PayloadAction<number>) {
      state.initialInvestment = action.payload;
    },
    setFinancingCosts(state, action: PayloadAction<number>) {
      state.financingCosts = action.payload;
    },
  },
});

export const expensesReducer = expensesSlice.reducer;
export const {
  setInitialInvestment,
  setFinancingCosts,
} = expensesSlice.actions;
export const selectExpenses: (state: AppState) => Expenses = (
  state: AppState,
) => state.expenses;

export default expensesSlice;
