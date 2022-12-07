import { ReactElement, type ButtonHTMLAttributes, type DetailedHTMLProps } from 'react';
import { classes } from '../../utils/style-utils';
import styles from './form-controls.module.css';

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export default function Button(props: Props): ReactElement {
  const extendedClassName = classes(
    styles.control,
    styles.button,
    props.className
  );

  return (
    <button {...props} className={extendedClassName} />
  );
}
