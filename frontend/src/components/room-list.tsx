import { useEffect, useState } from 'react';
import { useRoomSocket } from '../context/room-state.context';
import { Card, List, ListItem, Button, Subtitle, Text } from '../ui';
import type { Room } from '../models';

export const RoomsList = () => {
  const { availableRooms, getRooms, joinRoom } = useRoomSocket();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [joiningRoomId, setJoiningRoomId] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      await getRooms();
    } catch (error) {
      console.error('Error fetching rooms:', error);
      alert('Failed to fetch rooms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    setJoiningRoomId(roomId);
    try {
      await joinRoom(roomId);
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Failed to join room. Please try again.');
    } finally {
      setJoiningRoomId(null);
    }
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Subtitle>Available Rooms</Subtitle>
        <Button onClick={fetchRooms} disabled={isLoading}>
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {availableRooms.length === 0 ? (
        <Text>No rooms available. Create one!</Text>
      ) : (
        <List>
          {availableRooms.map((room: Room) => (
            <ListItem key={room.id}>
              <div>
                <span>{room.name}</span>
                <span style={{ marginLeft: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  ({room.users.length} {room.users.length === 1 ? 'player' : 'players'})
                </span>
              </div>
              <Button 
                onClick={() => handleJoinRoom(room.id)}
                disabled={joiningRoomId === room.id}
              >
                {joiningRoomId === room.id ? 'Joining...' : 'Join'}
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Card>
  );
};