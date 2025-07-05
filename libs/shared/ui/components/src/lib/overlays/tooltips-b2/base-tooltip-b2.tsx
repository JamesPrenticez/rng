import styled from '@emotion/styled';
import clsx from 'clsx';
import { forwardRef } from 'react';

const Container = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

  width: auto;
  min-height: 2.8rem;
  min-width: 10rem;

  padding: 0.4rem 1rem;

  background-color: rgba(var(--color-black-100-opacity), 0.7);
  backdrop-filter: blur(7.5px);

  border-radius: 0.6rem;
  border: 0.1rem solid var(--color-primary);

  color: var(--color-white-100);
  font-family: 'Aronui';
  font-size: calc(max(1.1rem, 10px));
  font-weight: 400;
  text-align: center;

  box-sizing: border-box;

  opacity: 0;;
  
  &.visible {
    opacity: 1;
  }
`;

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  visible: boolean;
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(({ 
    children,
    visible,
    style
  }, ref) => {
    return (
      <Container
        ref={ref}
        className={clsx({visible})}
        style={{
          ...style,
        }}
        role="tooltip"
      >
          {children}
      </Container>
    );
  }
);

Tooltip.displayName = 'Tooltip';
