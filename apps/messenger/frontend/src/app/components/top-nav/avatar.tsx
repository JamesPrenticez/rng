import styled from '@emotion/styled';
import clsx from 'clsx';
import { useAuth } from '../auth/use-auth';
import { RightPopOutMenu } from './right-pop-out-menu';
import { useState } from 'react';
import multiavatar from '@multiavatar/multiavatar';

const Container = styled.div`
  margin-left: auto;
  display: flex;

  .header {
    margin-left: auto;
    display: flex;
    align-items: center;
    font-weight: 600;
    color: var(--color-text);
    text-align: right;

    h1 {
      font-size: 1.2rem;
      line-height: 1.2rem;
      color: var(--color-text);
    }

    h2 {
      font-size: 1rem;
      line-height: 1.2rem;
      color: var(--color-text);
    }
  }

  img {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    margin-left: 0.5rem;
  }
`;

interface AvatarProps {
  isRightMenuOpen: boolean;
  toggleRightMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Avatar = ({
  isRightMenuOpen,
  toggleRightMenuOpen,
}: AvatarProps) => {
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);

  const base64Avatar = `data:image/svg+xml;base64,${btoa(
    multiavatar(user?.email ?? '')
  )}`;

  return (
    <Container
      className={clsx({
        open: isRightMenuOpen,
      })}
    >
      <div className="header">
        <div>
          <h1 className="display-name">{user?.display_name}</h1>
          <h2 className="email">{user?.email}</h2>
        </div>
      </div>
      {/* <AvatarGenerator seed={user?.display_name} /> */}

      <img
        src={
          imageError || !user?.profile_picture
            ? base64Avatar
            : user?.profile_picture
        }
        alt={user?.display_name}
        onClick={() => toggleRightMenuOpen((prev) => !prev)}
        onError={() => setImageError(true)}
      />

      <RightPopOutMenu
        isRightMenuOpen={isRightMenuOpen}
        toggleRightMenuOpen={toggleRightMenuOpen}
      />
    </Container>
  );
};
