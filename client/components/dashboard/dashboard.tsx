import { ReactElement } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/use-auth-context';
import usePrograms from '../../hooks/use-programs';
import styles from './dashboard.module.css';
import * as ProgramsService from '../../services/programs-service';
import ProgramsTable from '../programs-table/programs-table';
import Button from '../form-controls/button';

export default function Dashboard(): ReactElement {
  const { user, userHasLoaded } = useAuthContext();
  const { programs, setPrograms } = usePrograms();
  const navigate = useNavigate();

  if (userHasLoaded && !user) {
    return <Navigate to='/auth/log-in' replace={true} />;
  }

  async function handleDelete(programId: string) {
    const result = await ProgramsService.deleteProgram(programId);
    if (!result) return;
    setPrograms(programs.filter(p => p.id !== programId));
  }

  function handleEdit(programId: string) {
    navigate('/program/' + programId);
  }

  return (
    <div className={styles.layout}>
      <section className={styles.section}>
        <div>
          <h2 className={styles.heading}>Your Programs</h2>
        </div>
        {programs.length !== 0
          ? <ProgramsTable programs={programs} handleDelete={handleDelete} handleEdit={handleEdit} />
          : <p>You don't have any programs yet.</p>}
        <Button
          className={styles.newProgramButton}
          onClick={() => navigate('/')}
        >
          New Program
        </Button>
      </section>
    </div>
  );
}
