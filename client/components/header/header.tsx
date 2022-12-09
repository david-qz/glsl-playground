import type { ReactNode } from 'react';
import { type ReactElement, type CSSProperties } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/use-auth-context';
import navigationLinks from '../../navigation-links';
import { logOut } from '../../services/auth-service';
import Button from '../form-controls/button';
import Menu, { MenuItem, MenuDivider, MenuTitle } from '../menu/menu';
import styles from './header.module.css';

type Props = {
  style?: CSSProperties,
  children?: ReactNode
};

export default function Header({ style, children }: Props): ReactElement {
  const { user, setUser, userHasLoaded } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogOut(): Promise<void> {
    if (await logOut()) {
      setUser(null);
    }
  }

  const navigationLinksToShow = navigationLinks.filter(nl => !nl.hidePattern.exec(location.pathname));

  let userSlot: ReactNode = <></>;
  if (user) {
    userSlot = (
      <Menu>
        <MenuTitle>
          {`Signed in as ${user.email}`}
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
  } else if (userHasLoaded && !user) {
    userSlot = (
      <>
        <Button className={styles.headerButton} onClick={() => navigate('/auth/sign-up')}>Sign Up</Button>
        <Button className={styles.headerButton} onClick={() => navigate('/auth/log-in')}>Log In</Button>
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
