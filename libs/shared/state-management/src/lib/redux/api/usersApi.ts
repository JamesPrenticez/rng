import { User } from '@shared/models';
import { baseApi } from './baseApi';
import { supabaseFrontend } from '@shared/supabase/db/supabase-frontend';
import { Session } from '@supabase/supabase-js';
import { axiosInstance } from './axiosInstance';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (searchQuery: string) => ({
        url: `/users`,
        method: 'GET',
        params: { search: searchQuery },
      }),
    }),
    getUserById: builder.query({
      query: (id: string) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
    }),
    // updateUser: builder.mutation({
    //   query: (userData: {userId: string, displayName: string, profilePicture: string}) => ({
    //     url: '/user',  // Post request to /api/user
    //     method: 'POST',
    //     body: userData,
    //   }),
    // }),

    // updateUser: builder.mutation({
    //   query: (userData) => ({
    //     url: '/user',  // Post request to /api/user
    //     method: 'POST',
    //     body: userData,  // User data to be sent
    //   }),
    // }),

    // TODO this should be in "userApi"
    updateUser: builder.mutation<
      { user: User; session: Session | null }, // Return type
      { userId: string; displayName: string } // Request type
    >({
      queryFn: async ({ userId, displayName }) => {
        try {
          const response = await axiosInstance.post<{
            user: User;
            session: Session;
          }>('/user', {
            userId,
            displayName,
          });

          return {
            data: {
              user: response.data.user,
              session: response.data.session,
            },
          };
        } catch (err: any) {
          return {
            error: {
              status: err.response?.status || 500,
              data: err.response?.data || err.message || 'Unexpected error',
            },
          };
        }
      },
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useUpdateUserMutation } =
  usersApi;
