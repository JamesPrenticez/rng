import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import mailchimp from '@mailchimp/mailchimp_marketing';
import styled from '@emotion/styled';

import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const Container = styled.div`
  form {
    display: flex;
    position: relative;
  }

  .errors {
    font-size: 1.6rem;
    position: absolute;
    bottom: -2.5rem;
    left: 2.4rem;
    color: var(--color-rag-red);
    font-style: italic;
  }

  .success {
    font-size: 1.6rem;
    position: absolute;
    bottom: -2.5rem;
    left: 2.4rem;
    color: var(--color-rag-green);
    font-style: italic;
  }
`;
const StyledInput = styled.input`
  display: flex;
  width: 100%;
  border-radius: 9999px;
  outline: solid 0.2rem var(--color-primary);
  background-color: var(--color-background);
  color: inherit;
  padding: 0.5rem 16rem 0.5rem 2rem;
  border: none;

  &::placeholder {
    color: var(--disabled);
  }

  &:focus-visible {
    outline: 0.3rem solid var(--color-action);
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const StyledButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 14rem;
  background-color: var(--color-primary);
  color: var(--color-background);
  border-radius: 0 9999px 9999px 0;
  outline: solid 0.2rem var(--color-primary);
`;

// TODO moved to shared
const Spinner = styled.div`
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 0.2rem solid transparent;
  border-top: 0.2rem solid #ddd;
  border-right: 0.2rem solid #ccc;
  border-bottom: 0.2rem solid #bbb;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Configure Mailchimp SDK

console.log(import.meta.env.VITE_MAILCHIMP_API_KEY);
console.log(import.meta.env.VITE_MAILCHIMP_SERVER_PREFIX);

mailchimp.setConfig({
  apiKey: import.meta.env.VITE_MAILCHIMP_API_KEY,
  server: import.meta.env.VITE_MAILCHIMP_SERVER_PREFIX,
});

// Zod validation schema for email
const schema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
});

type FormData = z.infer<typeof schema>;

export const NewsLetterSignUp = () => {
  const { width, height } = useWindowSize(); // For confetti

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [status, setStatus] = React.useState<
    'idle' | 'processing' | 'success' | 'error'
  >('idle');

  const onSubmit = async (data: FormData) => {
    setStatus('processing');

    setTimeout(() => {
      setStatus('success');
    }, 1000);

    setTimeout(() => {
      setStatus('idle');
    }, 3000);
  };

  // const onSubmit = async (data: FormData) => {
  //   setStatus('processing')

  //   try {
  //     const response = await mailchimp.lists.addListMember('YOUR_LIST_ID', {
  //       email_address: data.email,
  //       status: 'subscribed',
  //     });

  //     if (response.status === 'subscribed') {
  //       setStatus('success');
  //     }
  //   } catch (error) {
  //     console.error('Error adding email:', error);
  //     setStatus('error');
  //   }
  // };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledInput
          type="email"
          placeholder="Enter your email"
          {...register('email')}
        />

        {errors.email && <div className="errors">{errors.email.message}</div>}

        <StyledButton className="button" type="submit">
          {status === 'processing' ? <Spinner /> : <>Subscribe</>}
        </StyledButton>

        {status === 'error' && (
          <div className="errors">Something went wrong. Please try later.</div>
        )}
        {status === 'success' && (
          <div className="success">
            Congratulation! We will be in touch shortly.
          </div>
        )}
      </form>

      {status === 'success' && <Confetti width={width} height={height} />}
    </Container>
  );
};
