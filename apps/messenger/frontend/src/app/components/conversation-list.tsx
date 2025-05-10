import styled from '@emotion/styled';
import { type Conversation } from '../layout/app-layout-desktop';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: flex-start;

  width: 33rem;

  border-right: solid var(--color-accent) 0.2rem;
  gap: 1rem;
  padding: 1rem;

  .list-item {
    font-size: 3rem;
    font-weight: 600;
    color: var(--color-text);

    display: flex;

    width: 100%;

    padding: 2rem;
    border-radius: 1rem;
    border: var(--color-border);
    background-color: rgba(var(--color-primary-opacity), 0.2);
    transition: background-color 200ms ease;

    &:hover {
      border: var(--color-primary);
      background-color: rgba(var(--color-primary-opacity), 0.5);
    }

    cursor: pointer;
  }
`;

interface ConverstaionListProps {
  setConversationId: (id: string) => void;
  conversationsList: Conversation[];
}

export const ConversationList = ({
  setConversationId,
  conversationsList,
}: ConverstaionListProps) => {
  const navigate = useNavigate();

  const handleItemClick = (itemId: string) => {
    // Navigate to the new URL with the conversation-id parameter
    navigate(`?conversation-id=${itemId}`);

    // Optionally, you can also update the conversation ID in your state
    setConversationId(itemId);
  };

  return (
    <Container>
      {conversationsList.map((item, index) => (
        <div
          key={item.id + '-' + index}
          className="list-item"
          onClick={() => handleItemClick(item.id)}
        >
          {item.name.toUpperCase()}
        </div>
      ))}
    </Container>
  );
};
