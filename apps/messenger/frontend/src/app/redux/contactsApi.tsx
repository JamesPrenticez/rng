import { appApi } from './appApi';
import { axiosInstance } from '@shared/state-management';

export const contactsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query({
      query: (userId: string) => ({
        url: `/contacts/${userId}`,
        method: 'GET',
        params: { userId },
      }),
      providesTags: ['Contacts'],
    }),
    addContact: builder.mutation<
      { success: boolean }, // Return type
      { userId: string; contactId: string } // Request type
    >({
      queryFn: async ({ userId, contactId }) => {
        try {
          const response = await axiosInstance.post<{ success: boolean }>(
            `/contacts/add`,
            { userId, contactId }
          );
          return { data: response.data };
        } catch (err: any) {
          return {
            error: {
              status: err.response?.status || 500,
              data: err.response?.data || err.message || 'Unexpected error',
            },
          };
        }
      },
      invalidatesTags: ['Contacts'],
    }),
  }),
});

export const { useGetContactsQuery, useAddContactMutation } = contactsApi;
