import Input from '../form-controls/input';
import Button from '../form-controls/button';
import css from './auth-form.module.css';
import { useAuthContext } from '../../hooks/auth-context';
import { ReactElement } from 'react';
import { Link, Navigate, NavLink } from 'react-router-dom';

type Method = 'log-in' | 'sign-up';
type Props = { method: Method };

export default function AuthForm({ method }: Props): ReactElement {
  const user = useAuthContext();

  if (user) {
    return <Navigate to="/" />;
  }

  const [actionPhrase, alternativePhrase, alternativePath] = methodDerivedValues[method];
  return (
    <div className={css.layout}>
      <form className={css.form}>
        <div>
          <h1 className={css.bigText}>{actionPhrase}</h1>
        </div>
        <label htmlFor='email'>
          <span className={css.mediumText}>Email</span>
          <Input className={css.smallText} id='email' type='email' />
        </label>
        <label htmlFor='password'>
          <span className={css.mediumText}>Password</span>
          <Input className={css.smallText} id='password' type="password" />
        </label>
        <div className={css.grow}></div>
        <Button className={css.mediumText}>{actionPhrase}</Button>
        <span className={css.smallText}>
          <Link to={alternativePath}>{alternativePhrase}</Link>
        </span>
      </form>
    </div>
  );
}

const methodDerivedValues: Record<Method, [string, string, string]> = {
  'log-in': ['Log In', 'Need to create an account? Sign up.', '/auth/sign-up'],
  'sign-up': ['Sign Up', 'Already have an account? Log in.', '/auth/log-in']
};
