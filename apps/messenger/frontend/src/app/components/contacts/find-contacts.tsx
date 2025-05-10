import React, { useMemo, useState } from 'react';
import { useGetUsersQuery } from '@shared/state-management';
import { useAppSelector } from '../../redux/hooks';
import { User } from '@supabase/supabase-js';
import { ContactCard } from './contact-card';
import styled from '@emotion/styled';
import { useAuth } from '../auth/use-auth';
import { useAddContactMutation } from '../../redux/contactsApi';

const Container = styled.div`
  .title {
    color: var(--color-secondary);
    font-size: 1.8rem;
    line-height: 1.2rem;
    font-weight: 900;
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

export const FindContacts = () => {
  // const [searchQuery, setSearchQuery] = useState<string>('');
  // const { data: users, error } = useGetUsersQuery(searchQuery);
  const [addFriend, { isLoading: isAddingFriend }] = useAddContactMutation();

  const { isLoading, error } = useGetUsersQuery('');
  const { user } = useAuth();
  const userId = useMemo(() => user?.id as User['id'], [user]); // Cast userId to string
  const data = useAppSelector((state) => state.users.data);
  const [errorMessage, setErrorMessage] = useState('');
  if (!data) return <div>Loading...</div>;

  // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchQuery(event.target.value);
  // };

  // const handleAddFriend = async (friendId: string) => {
  if (!userId) return;

  const addToContactsList = async (contactId: string) => {
    try {
      const res = await addFriend({ userId, contactId }).unwrap();
      // console.log('Success: added to friends list', res);
    } catch (err: any) {
      console.error('Add Friend Error:', err);
      setErrorMessage(err.data?.message || 'An unknown error occurred.');
    }
  };

  return (
    <Container>
      <h1 className="title">Find Contacts</h1>
      {/* <input
        type="text"
        placeholder="Search for friends..."
        value={searchQuery}
        onChange={handleSearchChange}
      /> */}

      {/* {error && <p>Error fetching users: {JSON.stringify(error.message)}</p>} */}

      <div className="contacts-list">
        {data
          ?.filter((item: User) => item.id !== user!.id)
          .map((item) => (
            <ContactCard
              key={item.id}
              type="stranger"
              user={item}
              onClick={() => addToContactsList(item.id)}
            />
          ))}
      </div>
    </Container>
  );
};
