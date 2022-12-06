import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import styles from './not-found.module.css';

export default function NotFound(): ReactElement {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <p className={styles.title}>404</p>
        <p className={styles.message}>The requested resource was not found.</p>
        <Link to="/" className={styles.link}>Go home?</Link>
      </div>
    </div>
  );
}
