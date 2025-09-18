import styled from '@emotion/styled';

const Container = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  font-size: 5rem;
  color: var(--color-primary);
  background-color: var(--color-background);
`;

export const MobileAppLayout = () => {
  return (
    <Container>
      Mobile
    </Container>
  );
};
