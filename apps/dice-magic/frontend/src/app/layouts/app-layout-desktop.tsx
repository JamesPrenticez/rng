import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: var(--color-primary);
`;

export const DesktopAppLayout = () => {
  return (
    <Container>
      Desktop
    </Container>
  );
};
