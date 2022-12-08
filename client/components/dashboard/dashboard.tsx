import { ReactElement, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/use-auth-context';
import usePrograms from '../../hooks/use-programs';
import styles from './dashboard.module.css';
import * as ProgramsService from '../../services/programs-service';
import ProgramsTable from '../programs-table/programs-table';
import Button from '../form-controls/button';
import Modal from '../modal/modal';
import Confirmation from '../../confirmation/confirmation';
import { ProgramData } from '../../../common/api-types';

export default function Dashboard(): ReactElement {
  const { user, userHasLoaded } = useAuthContext();
  const { programs, setPrograms } = usePrograms();
  const [programToDelete, setProgramToDelete] = useState<ProgramData | null>(null);
  const navigate = useNavigate();

  if (userHasLoaded && !user) {
    return <Navigate to='/auth/log-in' replace={true} />;
  }

  async function handleDelete() {
    if (!programToDelete) return;

    const programId = programToDelete.id;
    const result = await ProgramsService.deleteProgram(programId);

    if (!result) return;

    setPrograms(programs.filter(p => p.id !== programId));
    setProgramToDelete(null);
  }

  function handleDeleteButtonPressed(programId: string) {
    const program = programs.find(p => p.id === programId);
    if (!program) return;
    setProgramToDelete(program);
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
          ? <ProgramsTable
            programs={programs}
            handleDelete={handleDeleteButtonPressed}
            handleEdit={handleEdit}
          />
          : <p>You don't have any programs yet.</p>}
        <Button
          className={styles.newProgramButton}
          onClick={() => navigate('/')}
        >
          New Program
        </Button>
      </section>
      <Modal open={!!programToDelete}>
        <Confirmation
          message={`Are you sure you want to delete "${programToDelete?.title}"?`}
          onConfirm={() => handleDelete()}
          onCancel={() => setProgramToDelete(null)}
          destructive
        />
      </Modal>
    </div>
  );
}
