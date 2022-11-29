import { ReactElement, type DetailedHTMLProps, type InputHTMLAttributes } from 'react';
import { classes } from '../../utils/style-utils';
import styles from './form-controls.module.css';

type Props = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export default function Input(props: Props): ReactElement {
  const extendedClassName = classes(
    props.className || false,
    styles.control,
    styles.input
  );

  return (
    <input {...props} className={extendedClassName} />
  );
}
