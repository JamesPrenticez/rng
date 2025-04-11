import { useRoomSocket } from '../context/room-state.context';
import { Card, List, ListItem, DangerButton, Title, Text, HostBadge } from '../ui';
import { User } from '../models';

export const Room = () => {
  const { user, currentRoom, roomUsers, leaveRoom, kickUser } = useRoomSocket();

  const isHost = user && currentRoom && user.id === currentRoom.hostId;

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom();
    } catch (error) {
      console.error('Error leaving room:', error);
      alert('Failed to leave room. Please try again.');
    }
  };

  const handleKickUser = async (userId: string) => {
    if (!isHost) return;
    
    try {
      await kickUser(userId);
    } catch (error) {
      console.error('Error kicking user:', error);
      alert('Failed to kick user. Please try again.');
    }
  };

  if (!currentRoom) {
    return null;
  }

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Title>{currentRoom.name}</Title>
        <DangerButton onClick={handleLeaveRoom}>Leave Room</DangerButton>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Text>{isHost ? 'You are the host of this room' : 'You joined this room'}</Text>
      </div>

      <div>
        <Title style={{ fontSize: '1.5rem' }}>Players ({roomUsers.length})</Title>
        <List>
          {roomUsers.map((roomUser: User) => (
            <ListItem key={roomUser.id}>
              <div>
                {roomUser.username}
                {roomUser.id === currentRoom.hostId && (
                  <HostBadge>Host</HostBadge>
                )}
              </div>
              
              {isHost && roomUser.id !== user?.id && (
                <DangerButton onClick={() => handleKickUser(roomUser.id)}>
                  Kick
                </DangerButton>
              )}
            </ListItem>
          ))}
        </List>
      </div>
    </Card>
  );
};