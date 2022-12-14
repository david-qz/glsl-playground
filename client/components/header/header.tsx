import type { ReactNode } from 'react';
import { type ReactElement, type CSSProperties } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { isLoaded } from '../../../common/loading';
import { useAuthContext } from '../../hooks/use-auth-context';
import navigationLinks from '../../navigation-links';
import { logOut } from '../../services/auth-service';
import type { AuthMethod } from '../auth-form/auth-form';
import Button from '../form-controls/button';
import Menu, { MenuItem, MenuDivider, MenuTitle } from '../menu/menu';
import styles from './header.module.css';

type Props = {
  style?: CSSProperties,
  children?: ReactNode
};

export default function Header({ style, children }: Props): ReactElement {
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [_, setSearchParams] = useSearchParams();

  async function handleLogOut(): Promise<void> {
    if (await logOut()) {
      setUser(null);
    }
  }

  function handleAuthButtonClick(method: AuthMethod): void {
    // If we're already on the auth page, we should preserve the current search params when switching methods.
    if (location.pathname !== '/auth') {
      navigate('/auth?method=' + method, { replace: true });
    } else {
      setSearchParams(searchParams => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('method', method);
        return newParams;
      });
    }
  }

  const navigationLinksToShow = navigationLinks.filter(nl => !nl.hidePattern.exec(location.pathname));

  let userSlot: ReactNode = <></>;
  if (isLoaded(user) && user.value) {
    userSlot = (
      <Menu>
        <MenuTitle>
          {`Signed in as ${user.value.email}`}
        </MenuTitle>
        <MenuDivider />
        {navigationLinksToShow.map(nl => (
          <MenuItem key={nl.path} onClick={() => navigate(nl.path)}>
            {nl.text}
          </MenuItem>
        ))}
        <MenuItem onClick={handleLogOut}>
          <span className={styles.redText}>Log Out</span>
        </MenuItem>
      </Menu>
    );
  } else if (isLoaded(user) && !user.value) {
    userSlot = (
      <>
        <Button className={styles.headerButton} onClick={() => handleAuthButtonClick('sign-up')}>Sign Up</Button>
        <Button className={styles.headerButton} onClick={() => handleAuthButtonClick('log-in')}>Log In</Button>
      </>
    );
  }

  return (
    <div className={styles.header} style={style}>
      <div className={styles.left}>
        <Link className={styles.siteName} to='/'>GLSL Playground</Link>
      </div>
      <div>
        {children}
      </div>
      <div className={styles.right}>
        {userSlot}
      </div>
    </div>
  );
}
