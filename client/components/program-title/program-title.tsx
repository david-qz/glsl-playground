import { FormEvent, ReactElement, useState } from 'react';
import Input from '../form-controls/input';
import EditIcon from '@mui/icons-material/Edit';
import styles from './program-title.module.css';
import Button from '../form-controls/button';

type Props = {
  editable: boolean,
  title: string,
  onChange: (title: string) => void
};

export default function ProgramTitle({ editable, title, onChange }: Props): ReactElement {
  const [editing, setEditing] = useState<boolean>(false);

  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newTitle = formData.get('new-title') as string;

    onChange(newTitle.trim());
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
          pattern='\s*\S+\s*'
          title='A valid title must not be empty or only whitespace.'
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
          {editable && <Button className={styles.editButton} onClick={() => setEditing(true)}>
            <EditIcon />
          </Button>}
        </span>
      </>
    );
}
