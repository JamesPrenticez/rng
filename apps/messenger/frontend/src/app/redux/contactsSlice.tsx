import { createSlice } from '@reduxjs/toolkit';
import { contactsApi } from './contactsApi';
import { User } from '@supabase/supabase-js';

interface ContactsState {
  data: User[] | null;
}

const initialState: ContactsState = {
  data: null,
};

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      contactsApi.endpoints.getContacts.matchFulfilled,
      (state, action) => {
        console.log(action.payload.data);
        state.data = action.payload.data.contacts;
      }
    );
  },
});

export const {} = contactsSlice.actions;
export default contactsSlice.reducer;
