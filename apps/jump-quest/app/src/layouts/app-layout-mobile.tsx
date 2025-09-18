import styled from '@emotion/styled';
import { useIsMobile } from '@shared/hooks';

const Container = styled.div`
  width: 100%;
  height: 100dvh;

  display: flex;
  flex-direction: column;

  box-sizing: border-box;

  position: relative;

  font-size: 5rem;
  color: var(--color-primary);
  background-color: var(--color-background);
`;

export const MobileAppLayout = () => {
  const isMobile = useIsMobile();

  return (
    <Container>
      {isMobile?.landscape ? (
        <h1>TABLET</h1>
      ) : (
        <h1>MOBILE</h1>
      )
    }
    </Container>
  );
};
