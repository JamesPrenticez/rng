import { User } from '@shared/models';
import { baseApi } from './baseApi';
import { Session } from '@supabase/supabase-js';
import { axiosInstance } from './axiosInstance';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation<
      { user: User; session: Session | null }, // Return type
      { userId: string; displayName: string } // Request type
    >({
      queryFn: async ({ userId, displayName }) => {
        try {
          const response = await axiosInstance.post<{
            user: User;
            session: Session;
          }>('/api/user', {
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
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useUpdateUserMutation } = userApi;
