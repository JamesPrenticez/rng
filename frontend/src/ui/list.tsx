import styled from '@emotion/styled';

export const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

export const ListItem = styled.li`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;