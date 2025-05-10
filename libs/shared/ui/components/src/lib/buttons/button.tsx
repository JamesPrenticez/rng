import styled from '@emotion/styled';
import clsx from 'clsx';

const ButtonContainer = styled.button`
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

  &.gold {
    color: var(--color-gold-100);
    background-color: var(--color-background);
    border-color: var(--color-gold-100);

    :hover {
      color: var(--color-background);
      background-color: var(--color-gold-100);
      border-color: var(--color-gold-100);
    }
  }

  &.blue {
    color: var(--color-blue-100);
    background-color: var(--color-background);
    border-color: var(--color-blue-100);

    :hover {
      color: var(--color-background);
      background-color: var(--color-blue-100);
      border-color: var(--color-blue-100);
    }
  }

  &.white {
    color: var(--color-black-100);
    background-color: rgba(var(--color-white-80-opacity), 0.5);
    border-color: var(--color-black-100);

    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    :hover {
      color: var(--color-white-100);
      background-color: var(--color-black-100);
      border-color: var(--color-black-100);
    }
  }

  &.black {
    color: var(--color-white-100);
    background-color: var(--color-black-100);
    border-color: var(--color-black-100);

    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    :hover {
      color: var(--color-black-100);
      background-color: var(--color-white-100);
      border-color: var(--color-white-100);
    }
  }

  &.green {
    color: var(--color-green-100);
    background-color: var(--color-background);
    border-color: var(--color-green-100);

    :hover {
      color: var(--color-background);
      background-color: var(--color-green-100);
      border-color: var(--color-green-100);
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

  &.form {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: var(--color-text);
    background-color: rgba(var(--color-secondary-opacity), 0.5);

    :hover {
      color: var(--color-white-100);
      background-color: var(--color-primary);
      border-color: var(--color-primary);
    }
  }

  &.bottom-nav {
    color: var(--color-text);
    background-color: var(--color-background);
    border-color: var(--color-border);
    border: none;
    background-color: rgba(var(--color-background-subtle-opacity), 0.2);
    border-radius: 0rem;

    :hover {
      color: var(--color-primary);
      background-color: var(--color-background);
      border-color: var(--color-primary);
    }
  }

  &.right-nav {
    color: var(--color-secondary);
    background-color: var(--color-background);
    border-color: var(--color-border);
    border: none;
    background-color: rgba(var(--color-background-subtle-opacity), 0.2);
    border-radius: 0rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    :hover {
      color: var(--color-primary);
      background-color: var(--color-background);
      border-color: var(--color-primary);
    }
  }

  &.inviz {
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
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  CTA = 'cta',
  LINK = 'link',
  GOLD = 'gold',
  BLUE = 'blue',
  GREEN = 'green',
  BLACK = 'black',
  WHITE = 'white',
  BOTTOM_NAV = 'bottom-nav',
  RIGHT_NAV = 'right-nav',
  FORM = 'form',
  INVIZ = 'inviz',
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
    >
      {children}
    </ButtonContainer>
  );
};
