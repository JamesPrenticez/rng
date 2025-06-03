import styled from '@emotion/styled';
import clsx from 'clsx';

const ButtonContainer = styled.button`
  width: fit-content;

  border-radius: 0.8rem;
  border: solid 0.2rem;
  box-sizing: border-box;
  padding: 0.5rem 1.5rem;
  outline: none;

  font-size: 3rem;
  line-height: 4.44rem;
  padding: 1rem 1rem;
  margin: 1rem 0rem;
  font-weight: 600;

  transition: all 300ms ease;

  &.mobile {
    font-size: 2rem;
    line-height: 2rem;
    padding: 1rem 1rem;
    margin: 1rem 0rem;
    font-weight: 600;
  }

  &.default {
    color: var(--color-text);
    background-color: var(--color-background);
    border-color: var(--color-border);

    :hover {
      color: var(--color-primary);
      background-color: var(--color-background);
      border-color: var(--color-primary);
    }

    :disabled {
      color: var(--color-dark-grey-80);
      border-color: var(--color-grey-80);
      background-color: var(--color-grey-60);
    }
  }

  &.primary {
    color: var(--color-primary);
    background-color: var(--color-background);
    border-color: var(--color-action);

    :hover {
      color: var(--color-accent);
      background-color: var(--color-background);
      border-color: var(--color-action-hover);
    }
  }

  &.link {
    background: none;
    color: purple;
    text-decoration: underline;
  }

  &.form {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text);
    background-color: rgba(var(--color-secondary-opacity), 0.5);

    :hover {
      color: var(--color-white-100);
      background-color: var(--color-primary);
      border-color: var(--color-primary);
    }
  }

  &.skeleton {
    color: var(--color-secondary);
    background-color: transparent;
    border: none;
    border-radius: 0rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 0rem;
    margin: 0rem;

    :hover {
      color: var(--color-primary);
      background-color: var(--color-background);
      border-color: var(--color-primary);
    }
  }
`;

export enum ButtonVariants {
  DEFAULT = 'default',
  OUTLINED = 'primary',
  FILLED = 'secondary',
  LINK = 'link',
  FORM = 'form',
  SKELETON = 'skeleton'
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
  isMobile?: boolean;
}

export const Button = ({
  variant = ButtonVariants.DEFAULT,
  children,
  onClick,
  isMobile,
  ...rest
}: ButtonProps) => {
  return (
    <ButtonContainer
      className={clsx(variant, { mobile: isMobile })}
      onClick={onClick}
      {...rest}
    >
      {children}
    </ButtonContainer>
  );
};
