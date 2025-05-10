import { createSlice } from '@reduxjs/toolkit';

import { User } from '@supabase/supabase-js';
import { usersApi } from '../api/usersApi';

export interface UsersState {
  data: User[] | null;
}

const initialState: UsersState = {
  data: null,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => usersApi.endpoints.getUsers.matchFulfilled(action),
      (state, action) => {
        state.data = action.payload.data.users;
      }
    );
  },
});

export const {} = usersSlice.actions;
