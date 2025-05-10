import { useState } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import { Button } from '@shared/ui/components/buttons';

const Container = styled.div``;
const Card = styled.div``;
const CardContent = styled.div``;
const Label = styled.label``;

const Input = styled.input``;

export const AppLayoutAdmin = () => {
  const [title, setTitle] = useState('');
  const [permissions, setPermissions] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateConversation = async () => {
    if (!title) {
      setMessage('Name is required');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/conversations', {
        title,
        permissions: permissions
          ? permissions.split(',').map((p) => p.trim())
          : null,
      });

      setMessage(response.data.message);
      setTitle('');
      setPermissions('');
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || 'Failed to create conversation'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <CardContent>
          <h2>Create Conversation</h2>
          <div>
            <Label htmlFor="title">Conversation Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter conversation Title"
            />
          </div>
          <div>
            <Label htmlFor="permissions">Permissions (comma-separated)</Label>
            <Input
              id="permissions"
              type="text"
              value={permissions}
              onChange={(e) => setPermissions(e.target.value)}
              placeholder="Enter permissions (optional)"
            />
          </div>
          <Button onClick={handleCreateConversation} disabled={loading}>
            {loading ? 'Creating...' : 'Create Conversation'}
          </Button>
          {message && <p>{message}</p>}
        </CardContent>
      </Card>
    </Container>
  );
};
