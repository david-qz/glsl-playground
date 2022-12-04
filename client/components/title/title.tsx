import { FormEvent, ReactElement, useState } from 'react';
import Input from '../form-controls/input';
import EditIcon from '@mui/icons-material/Edit';
import styles from './title.module.css';

type Props = {
  title: string
  onChange: (title: string) => void
};

export default function Title({ title, onChange }: Props): ReactElement {
  const [editing, setEditing] = useState<boolean>(false);

  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newTitle = formData.get('new-title') as string;

    onChange(newTitle);
    setEditing(false);
  }

  return editing
    ? (
      <form onSubmit={handleFormSubmit} onBlur={() => setEditing(false)}>
        <Input
          className={styles.titleInput}
          defaultValue={title}
          name='new-title'
          required
          maxLength={50}
          autoComplete='off'
          autoFocus={true}
          size={50}
        />
      </form>
    )
    : (
      <>
        <span className={styles.title}>
          {title}
          <div className={styles.editButton} onClick={() => setEditing(true)}>
            <EditIcon />
          </div>
        </span>
      </>
    );
}
