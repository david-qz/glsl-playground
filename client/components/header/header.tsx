import { type ReactElement, type CSSProperties, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/auth-context';
import { logOut } from '../../services/auth-service';
import Button from '../form-controls/button';
import styles from './header.module.css';

type Props = {
  style?: CSSProperties,
  children?: ReactNode
};

export default function Header({ style, children }: Props): ReactElement {
  const [user, setUser] = useAuthContext();
  const navigate = useNavigate();

  async function handleLogOut() {
    if (await logOut()) {
      setUser(null);
    }
  }

  const userSlot = user
    ? <Button className={styles.headerButton} onClick={handleLogOut}>Log Out</Button>
    : (
      <>
        <Button className={styles.headerButton} onClick={() => navigate('/auth/sign-up')}>Sign Up</Button>
        <Button className={styles.headerButton} onClick={() => navigate('/auth/log-in')}>Log In</Button>
      </>
    );

  return (
    <div className={styles.header} style={style}>
      <div className={styles.left}>
        GLSL Playground
      </div>
      {children}
      <div className={styles.right}>
        {userSlot}
      </div>
    </div>
  );
}
