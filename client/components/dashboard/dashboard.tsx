import { ReactElement } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ProgramData } from '../../../common/api-types';
import { useAuthContext } from '../../hooks/use-auth-context';
import usePrograms from '../../hooks/use-programs';
import styles from './dashboard.module.css';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '../form-controls/icon-button';
import * as ProgramsService from '../../services/programs-service';

export default function Dashboard(): ReactElement {
  const { user, userHasLoaded } = useAuthContext();
  const { programs, setPrograms } = usePrograms();

  if (userHasLoaded && !user) {
    return <Navigate to='/auth/log-in' replace={true} />;
  }

  async function handleDelete(programId: string) {
    const result = await ProgramsService.deleteProgram(programId);
    if (!result) return;
    setPrograms(programs.filter(p => p.id !== programId));
  }

  return (
    <div className={styles.layout}>
      <section className={styles.section}>
        <h2 className={styles.heading}>Your Programs</h2>
        <table className={styles.programsTable}>
          <thead>
            <tr>
              <td>Title</td>
              <td>Compiled</td>
              <td>Last Modified</td>
              <td>Created</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {programs.map(p => tableRowFromProgram(p, handleDelete))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function tableRowFromProgram(program: ProgramData, handleDelete: (programId: string) => void) {
  return <tr key={program.id}>
    <td>
      <Link to={`/program/${program.id}`}>
        {program.title}
      </Link>
    </td>
    <td>{program.didCompile.toString()}</td>
    <td>{new Date(program.modifiedAt).toLocaleDateString()}</td>
    <td>{new Date(program.createdAt).toLocaleDateString()}</td>
    <td>
      <IconButton onClick={() => handleDelete(program.id)}>
        <DeleteIcon />
      </IconButton>
    </td>
  </tr>;
}
