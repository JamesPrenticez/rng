import { SessionData, User } from '@shared/models';
import { baseApi } from './baseApi';
import { supabaseFrontend } from '@shared/supabase/db/supabase-frontend';
import { type Session, type Provider } from '@supabase/supabase-js';
import { axiosInstance } from './axiosInstance';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    secret: builder.mutation<{ user: User; session: Session | null }, {}>({
      queryFn: async () => {
        try {
          const token = await getToken(); // Wait for token
          // console.log("getting token from local storage", token)

          const response = await axiosInstance.post(
            '/auth/secret',
            {}, // Empty body (or you can omit if not needed)
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // console.log(response.data)
          return { data: response.data }; // Axios automatically parses the JSON response
        } catch (error: any) {
          // Handle axios error (which might not be a 2xx status code)
          const errorMessage = error.response?.data?.error || error.message;
          return {
            error: {
              status: error.response?.status || 500,
              data: errorMessage,
            },
          };
        }
      },
      invalidatesTags: ['User'],
    }),
    login: builder.mutation<
      { user: User; session: Session | null },
      { email: String; password: String }
    >({
      queryFn: async ({ email, password }) => {
        try {
          const res = await axiosInstance.post('/auth/login', {
            email,
            password,
          }); // Body

          console.log(res);
          if (res.data.session) {
            // Set the session manually in the frontend
            supabaseFrontend.auth.setSession(res.data.session);

            // Optionally, you can store the token in localStorage
            localStorage.setItem('access_token', res.data.session.access_token);
          } else {
            console.error('Login failed:', res.data.error);
          }

          console.log(res.data);

          return { data: res.data };
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || error.message;
          return {
            error: {
              status: error.response?.status || 500,
              data: errorMessage,
            },
          };
        }
      },
      invalidatesTags: ['User'],
    }),
    loginWithOAuth: builder.mutation<
      { user: User; session: Session | null }, // Return type
      { provider: Provider } // Input type
    >({
      async queryFn({ provider }) {
        try {
          // Initiate OAuth login
          const { error } = await supabaseFrontend.auth.signInWithOAuth({
            provider,
            options: {
              redirectTo: `/api/auth/callback`, // TODO update with PRODUCTION URL or make a param?
            },
          });

          if (error) {
            return { error: { status: 401, data: error.message } };
          }

          // Wait for the session to be available (after the redirect)
          const { data: sessionData, error: sessionError } =
            await supabaseFrontend.auth.getSession();

          if (sessionError) {
            return { error: { status: 500, data: sessionError.message } };
          }

          // Ensure the session contains the user
          const user = sessionData.session?.user;
          if (!user) {
            return {
              error: { status: 500, data: 'No user found in session.' },
            };
          }

          // Return user and session
          return {
            data: {
              user,
              session: sessionData.session,
            },
          };
        } catch (err: any) {
          return { error: { status: 500, data: err.message } };
        }
      },
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent with the request
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled; // Wait for the query to succeed
          await supabaseFrontend.auth.signOut();

          // Remove the token from localStorage
          localStorage.removeItem('access_token');
          localStorage.removeItem('sb-your-supabase-project-id-auth-token'); // Remove your token
          sessionStorage.clear(); // Optionally clear sessionStorage if you're using it
          window.location.reload(); // Redirect to login page or reload
        } catch (error) {
          console.error('Logout failed:', error);
        }
      },
      invalidatesTags: ['User'],
    }),
    // TODO convert this to backend route!
    // =====================================
    // =====================================
    // =====================================
    register: builder.mutation<
      { user: User; session: Session | null },
      { email: String; password: String }
    >({
      queryFn: async ({ email, password }) => {
        try {
          const res = await axiosInstance.post('/auth/register', {
            email,
            password,
          });

          if (res.data.session) {
            // Set the session manually in the frontend
            supabaseFrontend.auth.setSession(res.data.session);

            // Optionally, store the token in localStorage
            localStorage.setItem('access_token', res.data.session.access_token);
          } else {
            console.error('Registration failed:', res.data.error);
          }

          return { data: res.data, session: res.data.session };
        } catch (error: any) {
          console.log(error);
          const errorMessage = error.response?.data.error || error.message;
          return {
            error: {
              status: error.response?.status || 500,
              data: errorMessage,
            },
          };
        }
      },
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useSecretMutation,
  useLoginMutation,
  useLoginWithOAuthMutation,
  useLogoutMutation,
  useRegisterMutation,
} = authApi;

export const getToken = async () => {
  const { data } = await supabaseFrontend.auth.getSession();
  return data?.session?.access_token || null;
};
