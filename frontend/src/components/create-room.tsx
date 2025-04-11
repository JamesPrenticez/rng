import { useState, FormEvent } from 'react';
import { useRoomSocket } from '../context/room-state.context';
import { Card, Form, Input, Button, Subtitle } from '../ui';

export const CreateRoom = () => {
  const [roomName, setRoomName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { createRoom } = useRoomSocket();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!roomName.trim()) {
      alert('Please enter a room name');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await createRoom(roomName);
      setRoomName(''); // Reset form after successful creation
    } catch (error) {
      console.error('Room creation error:', error);
      alert('Failed to create room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <Subtitle>Create New Room</Subtitle>
      
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !roomName.trim()}>
          {isLoading ? 'Creating...' : 'Create Room'}
        </Button>
      </Form>
    </Card>
  );
};