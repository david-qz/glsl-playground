import { ReactElement } from 'react';
import { classes } from '../../utils/style-utils';
import styles from './editor.module.css';

type Props = {
  title: string,
  active: boolean,
  error: boolean,
  onClick: () => void,
};

export default function Tab({ title, active, error, onClick }: Props): ReactElement {
  return (
    <div
      className={classes(styles.tab, active && styles.active, error && styles.error)}
      onClick={onClick}
    >
      {title}
    </div>
  );
}
