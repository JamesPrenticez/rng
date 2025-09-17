import styled from '@emotion/styled';

const Container = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const MobileAppLayout = () => {
  return (
    <Container>
      <h1>MOBILE</h1>
    </Container>
  );
};
