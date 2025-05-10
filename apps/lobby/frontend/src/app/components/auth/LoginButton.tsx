import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Path } from '../../models';
import { Button, ButtonVariants } from '@shared/ui/components/buttons';

export const LoginButton = () => {
  const navigate = useNavigate();

  async function handleLogin() {

  };

  return (
    <Button
      variant={ButtonVariants.PRIMARY}
      className="px-4"
      onClick={handleLogin}
    >
    Login
  </Button>
  )
}
