import { type ReactElement, type CSSProperties } from 'react';
import styles from './header.module.css';

type Props = {
  style?: CSSProperties
};

export default function Header({ style }: Props): ReactElement {
  return (
    <div className={styles.header} style={style}>GLSL Playground</div>
  );
}
