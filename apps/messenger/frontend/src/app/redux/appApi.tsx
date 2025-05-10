import { baseApi } from '@shared/state-management';

// This just extends baseApi from the shared lib so that we can add app specific tags
export const appApi = baseApi.enhanceEndpoints({
  addTagTypes: ['Contacts'],
});
