import styled from '@emotion/styled';

export const Button = styled.button`
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4338ca;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled(Button)`
  background-color: #ef4444;

  &:hover {
    background-color: #dc2626;
  }
`;

export const SecondaryButton = styled(Button)`
  background-color: #9ca3af;

  &:hover {
    background-color: #6b7280;
  }
`;


