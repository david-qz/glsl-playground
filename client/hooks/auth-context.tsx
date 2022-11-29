import { createContext, ReactElement, ReactNode, useContext, useEffect, useState } from 'react';
import { UserToken } from '../../common/api-types';
import { getUser } from '../services/auth-service';

type AuthContextValue = [UserToken | null, (user: UserToken) => void];

const AuthContext = createContext<AuthContextValue>([null, () => {}]);

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
    <AuthContext.Provider value={[user, setUser]}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  return useContext(AuthContext);
}
