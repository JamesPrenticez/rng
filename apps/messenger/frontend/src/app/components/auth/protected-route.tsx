import { PropsWithChildren, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Path } from '../../models';
import { useAuth } from './use-auth';

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Fetching your session</div>;
  }

  if (isLoading === false && user === null) {
    return <Navigate to={Path.LOGIN} />;
  }

  if (!user?.display_name) {
    return <Navigate to={Path.UPDATE_USER_DETAILS} />;
  }

  return <div>{children}</div>;
};
