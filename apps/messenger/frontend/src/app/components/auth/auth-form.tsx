import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useLoginMutation,
  useLoginWithOAuthMutation,
  useRegisterMutation,
} from '@shared/state-management';

import styled from '@emotion/styled';
import { Button, ButtonVariants } from '@shared/ui/components/buttons';
import { InputVariants, TextInput } from '@shared/ui/components/inputs';
import { Provider } from '@supabase/supabase-js';
import { ArrowRightLeft } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Path } from '../../models';
import { useAuth } from './use-auth';
import { clsx } from 'clsx';

const Container = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  background-color: var(--color-background);
`;

const FormContainer = styled.div`
  /* background-color: rgba(var(--color-secondary-opacity), 0.2); */
  padding: 4rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  min-width: 30rem;
  max-width: 40rem;
  display: flex;
  flex-direction: column;

  &.mobile {
    min-width: 10rem;
    max-width: 25rem;

    form {
      gap: 0rem;

      .title {
        font-size: 3rem;
        margin-bottom: 2rem;

        svg {
          width: 3rem;
          min-height: 3rem;
        }
      }

      input {
        margin-bottom: 2rem;
      }
      .error-wrapper {
        .error-text {
          font-size: 1rem;
          line-height: 0rem;
          bottom: 1rem;
        }
      }

      .divider {
        font-size: 1.4rem;
      }
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 3rem;

    .title {
      display: flex;
      align-items: center;

      font-size: 5rem;
      color: var(--color-primary);
      font-weight: 600;

      user-select: none;

      svg {
        width: 4.5rem;
        height: 4.5rem;
        margin-left: auto;
        cursor: pointer;
      }
    }
    .error-wrapper {
      position: relative;
      display: flex;

      .error-text {
        color: red;
        font-size: 2rem;
        line-height: 0.2rem;
        position: absolute;
        bottom: -1.5rem;
        text-align: center;

        &.special {
          top: -1.8rem;
          height: 2rem;
          line-height: 1.5rem;
        }
      }
    }

    .divider {
      color: var(--color-text);
      font-size: 2.5rem;
      line-height: 2rem;
      font-weight: 700;
      text-align: center;
    }
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 1.2rem;
  line-height: 1.2rem;
  text-align: center;
`;

// Zod validation schema for form
const schema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .nonempty('Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .nonempty('Password is required'),
});

type FormData = z.infer<typeof schema>;

interface AuthFormProps {
  isMobile: boolean;
}

export const AuthForm = ({ isMobile }: AuthFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  const [mode, setMode] = useState<boolean>(true);
  const [login, { isLoading: isLoginLoading, isError: isLoginError }] =
    useLoginMutation();
  const [
    loginWithOAuthMutation,
    {
      isLoading: isLoginWithOAuthLoading,
      isError: isLoginWithOAuthLoadingError,
    },
  ] = useLoginWithOAuthMutation();
  const [
    registerUser,
    { isLoading: isRegisterLoading, isError: isRegisterError },
  ] = useRegisterMutation();

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isLoading && user) {
      navigate(Path.MESSENGER);
    }
  }, [user, navigate]);

  useEffect(() => {
    setErrorMessage('');
  }, [mode]);

  const handleLogin = async (data: FormData) => {
    try {
      const res = await login({ email: data.email, password: data.password });
      // console.log('Login Response:', res);

      // On Success Navigate
      if (res.data) {
        navigate(Path.MESSENGER);
      }

      // Check for error in response
      if (res.error) {
        // @ts-ignore
        const errorDetails = res.error.data;
        if (errorDetails) {
          setErrorMessage(errorDetails);
        } else {
          // @ts-ignore
          setErrorMessage(
            'An error occurred during login. Please contact support'
          );
        }
      }
    } catch (err: any) {
      console.error('Login Error:', err); // Log error details
      setErrorMessage(
        JSON.stringify(err.message) || 'An unknown error occurred during login.'
      ); // Store the error message
    }
  };

  const handleRegister = async (data: FormData) => {
    try {
      const res = await registerUser({
        email: data.email,
        password: data.password,
      });

      // On Success Navigate
      if (res.data) {
        navigate(Path.MESSENGER);
      }

      // Check for error in response
      if (res.error) {
        // @ts-ignore
        const errorDetails = res.error.data;
        if (errorDetails) {
          setErrorMessage(errorDetails);
        } else {
          // @ts-ignore
          setErrorMessage(
            'An error occurred during login. Please contact support'
          );
        }
      }
    } catch (err: any) {
      console.error('Login Error:', err); // Log error details
      setErrorMessage(
        JSON.stringify(err.message) || 'An unknown error occurred during login.'
      ); // Store the error message
    }
  };

  const handleOAuth = async () => {
    const provider = 'github' as Provider;

    await loginWithOAuthMutation({ provider: provider });
  };

  return (
    <Container>
      <FormContainer className={clsx({ mobile: isMobile })}>
        <form onSubmit={handleSubmit(mode ? handleLogin : handleRegister)}>
          <div
            className="title"
            onClick={() => {
              setMode((prev) => !prev);
            }}
          >
            {mode === true ? 'Login' : 'Register'}
            <ArrowRightLeft />
          </div>
          <div className="error-wrapper">
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextInput
                  variant={InputVariants.FORM}
                  type="email"
                  placeholder="Email"
                  isMobile={isMobile}
                  {...field} // automatically connects value & onChange
                />
              )}
            />
            {errors.email && (
              <div className="error-text">{errors.email.message}</div>
            )}
            {/* {errors.email && <ErrorText>{errors.email.message}</ErrorText>} */}
          </div>

          <div className="error-wrapper">
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextInput
                  variant={InputVariants.FORM}
                  type="password"
                  placeholder="Password"
                  isMobile={isMobile}
                  {...field}
                />
              )}
            />
            {errors.password && (
              <div className="error-text">{errors.password.message}</div>
            )}
          </div>

          <div className="error-wrapper">
            <Button
              type="submit"
              className="button"
              disabled={isLoginLoading || isRegisterLoading}
              variant={ButtonVariants.FORM}
              isMobile={isMobile}
            >
              {isLoginLoading || isRegisterLoading
                ? 'Loading...'
                : mode === true
                ? 'LOGIN'
                : 'REGISTER'}
            </Button>

            {/* {(isLoginError || isRegisterError) && ( */}
            <div className="error-text special">{errorMessage}</div>
            {/* )} */}
          </div>

          <div className="divider">OR CONTINUE WITH SSO</div>

          <Button
            onClick={() => handleOAuth()}
            disabled={isLoginLoading || isRegisterLoading}
            variant={ButtonVariants.WHITE}
            isMobile={isMobile}
          >
            GitHub
          </Button>
        </form>
      </FormContainer>
    </Container>
  );
};
