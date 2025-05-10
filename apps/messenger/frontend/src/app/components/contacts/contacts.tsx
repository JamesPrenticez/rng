import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useGetContactsQuery } from '../../redux/contactsApi';

import { useAuth } from '../auth/use-auth';
import { FindContacts } from './find-contacts';
import styled from '@emotion/styled';
import { User } from '@shared/models';
import { ContactCard } from './contact-card';

const Container = styled.div`
  .title {
    color: var(--color-secondary);
    font-size: 1.8rem;
    line-height: 1.2rem;
    font-weight: 900;
    margin-left: 1rem;
    margin-top: 1rem;
  }

  .no-contacts-message {
    color: var(--color-text);
    font-size: 1.8rem;
    line-height: 2.2rem;
    font-weight: 300;
    margin-left: 1rem;
    margin-top: 1rem;
  }

  .contacts-list {
    height: 37rem;
    overflow-y: scroll;
    border: solid var(--color-grey-20) 0.1rem;
    border-radius: 1rem;
    margin: 1rem;
  }
`;

export const Contacts = () => {
  const { user } = useAuth();
  const userId = useMemo(() => user?.id as User['id'], [user]); // Cast userId to string

  const { isLoading, error } = useGetContactsQuery(userId, {
    skip: !userId,
  });

  const { data: contactsList } = useAppSelector((state) => state.contacts);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  return (
    <Container>
      <h1 className="title">Contacts List</h1>

      {contactsList && !contactsList.length && (
        <>
          <div className="no-contacts-message">
            Oh no! It appears you need to add some friends first!
          </div>
          <FindContacts />
        </>
      )}

      <div className="contacts-list">
        {contactsList &&
          contactsList.length > 0 &&
          contactsList.map((friend: User) => (
            <ContactCard
              key={friend.id}
              type="friend"
              user={friend}
              onClick={() => {
                console.log('hi');
              }}
            />
          ))}
      </div>
    </Container>
  );
};
