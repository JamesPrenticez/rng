import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';

import { Path } from '../models';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SiteMap = () => {
  return (
    <Container>
      {Object.keys(Path).map((key) => {
        const pathKey = key as keyof typeof Path;

        return (
          <NavLink key={pathKey} to={Path[pathKey]}>
            {pathKey}
          </NavLink>
        );
      })}
    </Container>
  );
};
