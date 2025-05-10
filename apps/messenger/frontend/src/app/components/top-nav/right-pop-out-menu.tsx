import styled from '@emotion/styled';
import { rightNavListFlattened } from '../../constants/right-nav-constants';
import { Button, ButtonVariants } from '@shared/ui/components/buttons';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { LogOut } from 'lucide-react';
import { useAppDispatch } from '../../redux/hooks';
import { logoutUser, useLogoutMutation } from '@shared/state-management';

const Container = styled.div`
  position: absolute;
  inset: 5rem 0 0 0;
  background-color: rgba(var(--color-black-80-opacity), 0.8);
  backdrop-filter: blur(0.2rem);
  display: none;

  &.open {
    display: block;
  }
`;

interface RightMenu {
  isRightMenuOpen: boolean;
  toggleRightMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RightPopOutMenu = ({
  isRightMenuOpen,
  toggleRightMenuOpen,
}: RightMenu) => {
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutUser());
      window.location.reload();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  return (
    <Container
      className={clsx({
        open: isRightMenuOpen,
      })}
    >
      {rightNavListFlattened.map((item) => (
        <NavLink key={item.key} to={item.key}>
          <Button variant={ButtonVariants.RIGHT_NAV}>
            {item.icon} {item.title.toUpperCase()}
          </Button>
        </NavLink>
      ))}

      <Button
        className="button"
        variant={ButtonVariants.RIGHT_NAV}
        onClick={() => handleLogout()}
      >
        {<LogOut />}SIGN OUT
      </Button>
    </Container>
  );
};
