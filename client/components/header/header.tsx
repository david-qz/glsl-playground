import { type ReactElement, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/auth-context';
import { logOut } from '../../services/auth-service';
import Button from '../form-controls/button';
import styles from './header.module.css';

type Props = {
  style?: CSSProperties
};

export default function Header({ style }: Props): ReactElement {
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
      <div>
        GLSL Playground
      </div>
      <div>
        {userSlot}
      </div>
    </div>
  );
}
