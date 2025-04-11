import { useState, FormEvent } from 'react';
import { useRoomSocket } from '../context/room-state.context';
import { Card, Form, Input, Button, Title, Text } from '../ui';

export const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useRoomSocket();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(username);
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <Title>Join Game</Title>
      <Text>Enter a username to get started</Text>
      
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          autoFocus
        />
        <Button type="submit" disabled={isLoading || !username.trim()}>
          {isLoading ? 'Joining...' : 'Join Game'}
        </Button>
      </Form>
    </Card>
  );
};