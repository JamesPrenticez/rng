import styled from '@emotion/styled';
import { useAuth } from '../components/auth/use-auth';

const Container = styled.div`
  height: 100dvh;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  .app-body {
    display: grid;
    grid-template-columns: 33rem 1fr;
    flex-grow: 1;
  }
`;

export interface Conversation {
  id: string;
  name: string;
  access: string[];
}

// const mockConverstation: Conversation[] = [
//   { id: '0001', name: 'Public', access: ['all'] },
//   { id: '0002', name: 'The Boys', access: ['user-1', 'user-2', 'user-3'] },
//   { id: '0003', name: 'Serious Business', access: ['user-1', 'user-2'] },
// ];

export const AppLayoutDesktop = () => {
  // const { data } = useAppSelector((state) => state.user);
  // if (!data) return;
  // const { email, id: userId } = data;

  const { user, isLoading } = useAuth();

  if (!user) return;

  const displayName = user?.user_metadata.full_name || user?.user_metadata.name;
  const profilePicture = user?.user_metadata.avatar_url;

  // TODO Temp solution to test setup... this should be migrated to redux
  // const [conversationId, setConversationId] = useState<string | null>(null);
  // const [conversations, setConversations] = useState<Conversation[]>([]);

  // useEffect(() => {
  //   const fetchConversation = async () => {
  //     if (state !== 'loading') setState('loading');

  //     try {
  //       const response = await axios.get(`/api/conversations`);
  //       console.log(response.data);
  //       setConversations(response.data.conversations);
  //       setState('success');
  //     } catch (error: any) {
  //       console.error('Error fetching conversation:', error.message);
  //       setState('error');
  //     }
  //   };

  //   fetchConversation();
  // }, [data]);

  // if (state === 'loading') return <div>Loading ....</div>;

  return (
    <Container>
      <h1
        style={{
          fontSize: '4rem',
          fontWeight: 600,
        }}
      >
        Desktop not supported. Please use a mobile screen size
        {/* <ContactCard user={user} />
        <FriendsList user={user} /> */}
        {/* TODO List of users in contacts list showing their online status */}
      </h1>

      <div className="app-body">
        {/* <ConversationList
          setConversationId={setConversationId}
          conversationsList={conversations}
        />  */}

        {/* {conversationId && <Messenger conversationId={conversationId} />} */}
      </div>
    </Container>
  );
};
