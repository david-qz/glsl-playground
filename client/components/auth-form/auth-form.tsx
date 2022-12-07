import Input from '../form-controls/input';
import Button from '../form-controls/button';
import css from './auth-form.module.css';
import { useAuthContext } from '../../hooks/use-auth-context';
import { FormEvent, ReactElement, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { logIn, signUp } from '../../services/auth-service';
import { UserToken } from '../../../common/api-types';

type Method = 'log-in' | 'sign-up';
type Props = { method: Method };

export default function AuthForm({ method }: Props): ReactElement {
  const { user, setUser }  = useAuthContext();
  const [errorMessage, setErrorMessage] = useState<string>();

  if (user) {
    return <Navigate to="/" replace={true} />;
  }

  const [actionPhrase, alternativePhrase, alternativePath, authFunction] = derivedValues[method];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email: string = formData.get('email') as string;
    const password: string = formData.get('password') as string;

    const response = await authFunction(email, password);
    if (typeof response === 'string') {
      setErrorMessage(response);
    } else {
      setUser(response);
    }
  }

  return (
    <div className={css.layout}>
      <form className={css.form} onSubmit={handleSubmit}>
        <div>
          <h1 className={css.bigText}>{actionPhrase}</h1>
        </div>
        <label>
          <span className={css.mediumText}>Email</span>
          <Input className={css.smallText} name='email' type='email' />
        </label>
        <label>
          <span className={css.mediumText}>Password</span>
          <Input className={css.smallText} name='password' type="password" />
        </label>
        <span className={css.smallText + ' ' + css.error}>{errorMessage}</span>
        <div className={css.grow}></div>
        <Button className={css.mediumText}>{actionPhrase}</Button>
        <span className={css.smallText}>
          <Link to={alternativePath}>{alternativePhrase}</Link>
        </span>
      </form>
    </div>
  );
}

type AuthFunction = (email: string, password: string) => Promise<UserToken | string>;
const derivedValues: Record<Method, [string, string, string, AuthFunction]> = {
  'log-in': [
    'Log In',
    'Need to create an account? Sign up.',
    '/auth/sign-up',
    logIn
  ],
  'sign-up': [
    'Sign Up',
    'Already have an account? Log in.',
    '/auth/log-in',
    signUp
  ]
};
