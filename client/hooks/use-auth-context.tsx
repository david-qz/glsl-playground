import type { ReactElement, ReactNode } from 'react';
import type { Dispatch } from 'react';
import { createContext, useContext } from 'react';
import type { UserToken } from '../../common/api-types';
import type { Loading, LoadingStateAction } from './use-loader';
import { getUser } from '../services/auth-service';
import { Loader } from './use-loader';

type AuthContextValue = {
  user: Loading<UserToken | null>,
  setUser: Dispatch<LoadingStateAction<UserToken | null>>
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export function AuthContextProvider({ children }: ProviderProps): ReactElement {
  const [user, setUser] = Loader.useLoader<UserToken| null>(() => getUser(), []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const value = useContext(AuthContext);
  if (value === undefined) throw new Error('Attempt to useAuthContext() outside of an AuthContext.Provider.');
  return value;
}
