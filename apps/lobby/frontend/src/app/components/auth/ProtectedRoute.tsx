import { type ReactNode } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { NoAuth } from '../../pages/errors/no-auth';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const user = useAppSelector((state) => state.user.data);

  if(!user){
    return <NoAuth />
  }

  return children;
};
