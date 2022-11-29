import { createContext, ReactElement, ReactNode, useContext, useEffect, useState } from 'react';
import { UserToken } from '../../common/users';
import { getUser } from '../services/auth-service';

const AuthContext = createContext<UserToken | null>(null);

export function AuthContextProvider({ children }: { children: ReactNode }): ReactElement {
  const [user, setUser] = useState<UserToken | null>(null);
  const [responseReceived, setResponseReceived] = useState<boolean>(false);

  useEffect(() => {
    getUser().then(user => {
      setUser(user);
      setResponseReceived(true);
    });
  }, []);

  if (!responseReceived) {
    return <></>;
  }

  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): UserToken | null {
  const user = useContext(AuthContext);
  return user;
}
