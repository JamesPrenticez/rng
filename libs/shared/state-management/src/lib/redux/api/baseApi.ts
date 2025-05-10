import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

// initialize an empty api service that we'll inject endpoints into later as needed
export const baseApi = createApi({
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
  tagTypes: ['User', 'Users'], // Define your tag types here
});

// Why we do this.

// Typically, you should only have one API slice per base URL that your application needs to communicate with.
// For example, if your site fetches data from both /api/posts and /api/users,
// you would have a single API slice with /api/ as the base URL, and separate endpoint definitions for posts and users.
// This allows you to effectively take advantage of automated re-fetching by defining tag relationships across endpoints.

// For maintainability purposes, you may wish to split up endpoint definitions across multiple files,
// while still maintaining a single API slice which includes all of these endpoints.
// See code splitting for how you can use the injectEndpoints property to inject API endpoints from other files into a single API slice definition.
// Code Splitting - https://redux-toolkit.js.org/rtk-query/usage/code-splitting
