import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import { Session } from '@supabase/supabase-js';
import { User } from '@shared/models';

import { authApi } from '../api/authApi';
import { usersApi } from '../api';
import { userApi } from '../api/userApi';

export interface UserState {
  data: User | null;
  session: Session | null;
  spaToken: string | null;
}

const initialState: UserState = {
  data: null,
  session: null,
  spaToken: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<Partial<User> | null>) => {
      if (action.payload) {
        state.data = state.data
          ? { ...state.data, ...action.payload }
          : (action.payload as User); // Ensures type compatibility
      }
    },
    updateUserField: (
      state,
      action: PayloadAction<{ key: keyof User; value: User[keyof User] }>
    ) => {
      const { key, value } = action.payload;
      if (state.data && key in state.data) {
        (state.data[key as keyof typeof state.data] as User[keyof User]) =
          value;
      }
    },
    logoutUser(state) {
      state.data = null;
      state.session = null;
      state.spaToken = null;

      // Clear frontend session data (cookies, localStorage)
      // Clear cookies
      document.cookie = 'sb-access-token=; Max-Age=0; path=/; SameSite=Strict';
      document.cookie = 'sb-refresh-token=; Max-Age=0; path=/; SameSite=Strict';

      // Clear localStorage
      localStorage.removeItem('spaToken');

      console.log('thsi is the dispatch');
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) =>
        authApi.endpoints.login.matchFulfilled(action) ||
        authApi.endpoints.secret.matchFulfilled(action) ||
        authApi.endpoints.loginWithOAuth.matchFulfilled(action) ||
        authApi.endpoints.register.matchFulfilled(action) ||
        userApi.endpoints.updateUser.matchFulfilled(action),
      (state, action) => {
        // Extract user and session directly from the action payload
        const { user, session } = action.payload as {
          user: User;
          session: Session | null;
        };

        // console.log("updating user", user)

        // Update state with the user and session data
        state.data = user;
        state.session = session;
        state.spaToken = 'mockspatoken';
      }
    ),
      builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.data = null;
        state.session = null;
        state.spaToken = null;

        // Clear frontend session data (cookies, localStorage)
        // Clear cookies
        document.cookie =
          'sb-access-token=; Max-Age=0; path=/; SameSite=Strict';
        document.cookie =
          'sb-refresh-token=; Max-Age=0; path=/; SameSite=Strict';

        // Clear localStorage
        localStorage.removeItem('spaToken');

        console.log('but do you reallly need it if you have a matcher?');
      });
    builder.addMatcher(
      (action) => usersApi.endpoints.updateUser.matchFulfilled(action),
      (state, action) => {
        const updatedUser = action.payload.user;
        if (state.data && state.data.id === updatedUser.id) {
          state.data = updatedUser; // Update the single user's data in the state
        }
      }
    );
  },
});

export const {
  updateUser,
  updateUserField,
  logoutUser, // TODO
} = userSlice.actions;

export default userSlice;
