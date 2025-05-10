import styled from '@emotion/styled';
import { User } from '@shared/models';
import { ContactImage } from './contact-image';
import { Button, ButtonVariants } from '@shared/ui/components/buttons';
import {
  PlusCircle as PlusCircleIcon,
  MessageCircle as MessageCircleIcon,
} from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: solid var(--color-grey-20) 0.1rem;
  padding: 0.5rem 0rem;

  .header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0rem 0.5rem;

    img {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
    }

    h1 {
      font-size: 1.6rem;
      line-height: 1.4rem;
      color: var(--color-text);
      font-weight: 700;
      margin: 0rem;
    }

    h2 {
      font-size: 1.2rem;
      color: var(--color-text);
      font-weight: 300;
      margin: 0rem;
      line-height: 2rem;
    }

    button {
      margin-left: auto;
      cursor: pointer;
    }
  }
`;

interface ContactCardProps {
  user: User;
  onClick: () => void;
  type: 'stranger' | 'friend';
}

export const ContactCard = ({ user, type, onClick }: ContactCardProps) => {
  return (
    <Container>
      <div className="header">
        <ContactImage
          src={user.profile_picture}
          alt={user.display_name}
          email={user.email}
        />
        <div>
          <h1 className="display-name">{user.display_name}</h1>
          <h2 className="display-name">{user.email}</h2>
        </div>

        <Button variant={ButtonVariants.INVIZ} onClick={onClick}>
          {type === 'stranger' ? <PlusCircleIcon /> : <MessageCircleIcon />}
        </Button>
      </div>
    </Container>
  );
};
