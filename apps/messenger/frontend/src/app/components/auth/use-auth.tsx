import { useEffect } from 'react';
import { getToken, useSecretMutation } from '@shared/state-management';
import { useAppSelector } from '../../redux/hooks';

export const useAuth = () => {
  const [secret, { isLoading, isError }] = useSecretMutation();
  const { data: user } = useAppSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await getToken(); // Get the token asynchronously
      if (token) {
        const response = await secret({});
        if ('data' in response && response.data) {
          // Dont use the res from secret
          // It set with a matcher in the usersSlice
          // console.log(response.data)
        } else {
          // console.error('Failed to fetch user:', response.error);
          return;
        }
      }
    };

    fetchUser();
  }, [secret]);

  return { user, isLoading, isError };
};
