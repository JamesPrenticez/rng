import clsx from 'clsx';
import styled from '@emotion/styled';
import { forwardRef } from 'react';

const InputContainer = styled.input`
  border-radius: 0.8rem;
  border: solid 0.2rem;
  box-sizing: border-box;
  padding: 0.5rem 1rem;
  outline: none;
  transition: all 300ms ease;
  z-index: 50;
  width: 100%;

  font-size: 2.2rem;

  &.mobile {
    font-size: 1.2rem;
  }

  &.default {
    color: var(--color-text);
    background-color: var(--color-background);
    border-color: var(--color-border);

    :focus {
      border-color: var(--color-primary);
    }
  }

  &.primary {
    color: var(--color-primary);
    background-color: var(--color-background);
    border-color: var(--color-action);

    :focus {
      border-color: var(--color-action-hover);
    }
  }

  &.gold {
    color: var(--color-gold-100);
    background-color: var(--color-background);
    border-color: var(--color-gold-100);

    :focus {
      border-color: var(--color-gold-100);
    }
  }

  &.blue {
    color: var(--color-blue-100);
    background-color: var(--color-background);
    border-color: var(--color-blue-100);

    :focus {
      border-color: var(--color-blue-100);
    }
  }

  &.black {
    color: var(--color-white-100);
    background-color: var(--color-black-100);
    border-color: var(--color-black-100);

    :focus {
      border-color: var(--color-white-100);
    }
  }

  &.green {
    color: var(--color-green-100);
    background-color: var(--color-background);
    border-color: var(--color-green-100);

    :focus {
      border-color: var(--color-green-100);
    }
  }

  &.form {
    color: var(--color-text);
    background-color: rgba(var(--color-secondary-opacity), 0.2);
    border-color: var(--color-text);

    :focus {
      border-color: var(--color-accent);
    }
  }

  &.secondary {
    background: white;
  }

  &.cta {
    background: dodgerblue;
  }

  &.link {
    background: none;
    color: purple;
    text-decoration: underline;
  }
`;

export enum InputVariants {
  DEFAULT = 'default',
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  CTA = 'cta',
  LINK = 'link',
  GOLD = 'gold',
  BLUE = 'blue',
  GREEN = 'green',
  BLACK = 'black',
  FORM = 'form',
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariants;
  isMobile: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = InputVariants.DEFAULT, isMobile, ...rest }, ref) => {
    return (
      <InputContainer
        className={clsx(variant, {
          mobile: isMobile,
        })}
        ref={ref}
        {...rest}
      />
    );
  }
);

TextInput.displayName = 'TextInput';
