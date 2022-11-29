import { createContext, ReactElement, ReactNode, useContext, useEffect, useState } from 'react';
import { UserToken } from '../../common/users';
import { getUser } from '../services/auth-service';

const dummyUser = { id: 'oops', email: 'something.went.wrong@mybad.com' };

const AuthContext = createContext<UserToken>(dummyUser);

export function AuthContextProvider({ children }: { children: ReactNode }): ReactElement {
  const [user, setUser] = useState<UserToken | null>(null);

  useEffect(() => {
    getUser().then(user => setUser(user));
  }, []);

  if (!user) {
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
