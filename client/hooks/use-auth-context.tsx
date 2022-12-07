import { createContext, ReactElement, ReactNode, useContext, useEffect, useState } from 'react';
import { UserToken } from '../../common/api-types';
import { getUser } from '../services/auth-service';

type UserSetter = (user: UserToken | null) => void;
type AuthContextValue = {
  user: UserToken | null,
  userId: string,
  setUser: UserSetter
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  userId: 'anon',
  setUser: () => {}
});

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
    <AuthContext.Provider value={{ user, userId: user?.id || 'anon', setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  return useContext(AuthContext);
}
