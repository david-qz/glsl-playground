import { FormEvent, ReactElement, useRef, useState } from 'react';
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
  const [lastBlur, setLastBlur] = useState<number>(0);
  const formRef = useRef<HTMLFormElement>(null);

  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newTitle = formData.get('new-title') as string;

    onChange(newTitle.trim());
    setEditing(false);
  }

  function handleBlur() {
    if (!formRef.current) return;
    const form = formRef.current;

    if (Date.now() - lastBlur < 1000) {
      setEditing(false);
      setLastBlur(0);
      return;
    }

    if (form.checkValidity()) {
      form.requestSubmit();
      setLastBlur(0);
    } else {
      form.reportValidity();
      setLastBlur(Date.now());
    }
  }

  return editing
    ? (
      <form ref={formRef} onSubmit={handleFormSubmit} onBlur={handleBlur}>
        <Input
          className={styles.titleInput}
          defaultValue={title}
          name='new-title'
          required
          pattern='[\w\s]*\S+[\w\s]*'
          title='A valid title must not be empty or only whitespace.'
          autoComplete='off'
          autoFocus={true}
          maxLength={50}
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
