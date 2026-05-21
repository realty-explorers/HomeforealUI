import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';

export type SignOutReason = 'manual' | 'session_expired';

export interface Auth {
  token?: string;
  verificationStep: number;
  showVerificationDialog?: boolean;
  signingOut: boolean;
  signOutReason: SignOutReason | null;
}

const initialState: Auth = {
  token: null,
  verificationStep: 1,
  showVerificationDialog: false,
  signingOut: false,
  signOutReason: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    logout(state, action: Action) {
      state.token = null;
    },
    setVerificationStep(state, action: PayloadAction<number>) {
      state.verificationStep = action.payload;
    },
    setShowVerificationDialog(state, action: PayloadAction<boolean>) {
      state.showVerificationDialog = action.payload;
    },
    setSigningOut(state, action: PayloadAction<boolean>) {
      state.signingOut = action.payload;
      // Reset reason when explicitly clearing the signing-out flag so a
      // stale "session_expired" doesn't leak into the next signout.
      if (!action.payload) state.signOutReason = null;
    },
    setSignOutReason(state, action: PayloadAction<SignOutReason | null>) {
      state.signOutReason = action.payload;
    }
  }
});

export const authReducer = authSlice.reducer;
export const {
  setToken,
  logout,
  setVerificationStep,
  setShowVerificationDialog,
  setSigningOut,
  setSignOutReason
} = authSlice.actions;
export const selectAuth: (state: AppState) => Auth = (state: AppState) =>
  state.auth;
export const selectSigningOut = (state: AppState) => state.auth.signingOut;
export const selectSignOutReason = (state: AppState) =>
  state.auth.signOutReason;

export default authSlice;
