import { type ReactElement, type CSSProperties, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/use-auth-context';
import { logOut } from '../../services/auth-service';
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

  async function handleLogOut() {
    if (await logOut()) {
      setUser(null);
    }
  }

  const userSlot = user
    ? (
      <Menu>
        <MenuTitle>
          {`Signed in as ${user.email}`}
        </MenuTitle>
        <MenuDivider />
        <MenuItem onClick={() => navigate('/dashboard')}>
          Dashboard
        </MenuItem>
        <MenuItem onClick={handleLogOut}>
          <span className={styles.redText}>Log Out</span>
        </MenuItem>
      </Menu>
    )
    : (
      <>
        <Button className={styles.headerButton} onClick={() => navigate('/auth/sign-up')}>Sign Up</Button>
        <Button className={styles.headerButton} onClick={() => navigate('/auth/log-in')}>Log In</Button>
      </>
    );

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
