import { PropsWithChildren, ReactElement, ReactNode } from 'react';
import styles from './editor.module.css';

type Props = {
  children: ReactNode
};

export default function TabBar({ children }: Props): ReactElement {
  return (
    <div className={styles.tabBar}>
      {children}
    </div>
  );
}
