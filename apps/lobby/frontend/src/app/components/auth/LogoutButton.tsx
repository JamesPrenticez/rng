import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Path } from '../../models';
import { useAppDispatch } from '../../redux/hooks';
import { Button } from '@shared/ui/components/buttons';
import { logoutUser } from '@shared/state-management';

export const LogoutButton = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  async function handleLogout() {
    try {
      // Dispatch the action correctly by calling the action creator
      await dispatch(logoutUser());

      // Navigate to the login or home page after successful logout
      navigate(Path.LOGIN);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  return <Button onClick={handleLogout}>Logout</Button>;
};
