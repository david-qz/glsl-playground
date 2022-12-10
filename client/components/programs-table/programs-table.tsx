import type { ReactElement } from 'react';
import type { ProgramData } from '../../../common/api-types';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '../form-controls/icon-button';
import styles from './programs-table.module.css';

type Props = {
  programs: Array<ProgramData>
  handleDelete?: (id: string) => void
  handleEdit?: (id: string) => void
};

export default function ProgramsTable({ programs, handleDelete, handleEdit }: Props): ReactElement {
  const shouldShowActionsColumn = !!handleDelete || !!handleEdit;

  function tableRow(program: ProgramData): ReactElement {
    return <tr key={program.id}>
      <td>{program.title}</td>
      <td>{program.didCompile.toString()}</td>
      <td>{new Date(program.modifiedAt).toLocaleString()}</td>
      <td>{new Date(program.createdAt).toLocaleString()}</td>
      {shouldShowActionsColumn && <td className={styles.buttons}>
        {!!handleEdit && <IconButton onClick={() => handleEdit(program.id)}>
          <EditIcon />
        </IconButton>}
        {!!handleDelete && <IconButton className={styles.deleteButton} onClick={() => handleDelete(program.id)}>
          <DeleteIcon />
        </IconButton>}
      </td>}
    </tr>;
  }

  return (
    <table className={styles.programsTable}>
      <thead>
        <tr>
          <td>Title</td>
          <td>Compiled</td>
          <td>Last Modified</td>
          <td>Created</td>
          {shouldShowActionsColumn && <td>Actions</td>}
        </tr>
      </thead>
      <tbody>
        {programs.map(p => tableRow(p))}
      </tbody>
    </table>
  );
}
