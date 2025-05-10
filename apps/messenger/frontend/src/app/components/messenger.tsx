import styled from '@emotion/styled';
import { useEffect, useState } from 'react';

const Container = styled.div`
  display: grid;
  grid-template-rows: 1fr 15rem;
  flex-direction: column;
  flex-grow: 1;

  .messages {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background-color: rgba(var(--color-secondary-opacity), 0.01);
  }

  .messager {
    font-size: 10rem;
    color: white;
    padding: 1rem;
    display: flex;
    gap: 1rem;
    flex-grow: 1;
    /* background-color: rgba(var(--color-secondary-opacity), 0.4); */

    input {
      width: 100%;
      background-color: rgba(var(--color-secondary-opacity), 0.5);
      border-radius: 5rem;
      color: var(--color-text);
      padding: 5rem;
    }

    button {
      width: 50rem;
      color: var(--color-primary);
      background-color: rgba(var(--color-primary-opacity), 0.2);
      border: var(--color-primary) solid 0.5rem;
      border-radius: 5rem;
    }
  }
`;
const mockMessages = [
  { id: '1', content: 'Hello, how are you?' },
  { id: '2', content: "I'm good, thanks!" },
];

export const Messenger = ({ conversationId }: { conversationId: string }) => {
  // const [messages, setMessages] = useState(mockMessages);
  // const [newMessage, setNewMessage] = useState('');

  // const handleSendMessage = () => {
  //   if (newMessage.trim()) {
  //     const newMsg = { id: String(messages.length + 1), content: newMessage };
  //     setMessages((prevMessages) => [...prevMessages, newMsg]);
  //     setNewMessage(''); // Clear input after sending
  //   }
  // };

  return (
    <div>hi</div>
    // <Container>
    //     Hello
    //   <div className="messages">
    //     {/* <ul>
    //       {messages.map((msg) => (
    //         <li key={msg.id}>{msg.content}</li>
    //       ))}
    //     </ul>
    //   </div>

    //   <div className="messager">
    //     <input
    //       value={newMessage}
    //       onChange={(e) => setNewMessage(e.target.value)}
    //       placeholder="Type a message..."
    //     />
    //     <button onClick={handleSendMessage}>Send</button> */}
    //   </div>
    // </Container>
  );
};
