import { ReactElement } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ProgramData } from '../../../common/api-types';
import { useAuthContext } from '../../hooks/auth-context';
import usePrograms from '../../hooks/use-programs';
import styles from './dashboard.module.css';

export default function Dashboard(): ReactElement {
  const [user] = useAuthContext();
  const programs = usePrograms();

  if (!user) {
    return <Navigate to='/auth/log-in' replace={true} />;
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
            </tr>
          </thead>
          <tbody>
            {programs.map(p => tableRowFromProgram(p))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function tableRowFromProgram(program: ProgramData) {
  return <tr key={program.id}>
    <td>
      <Link to={`/program/${program.id}`}>
        {program.title}
      </Link>
    </td>
    <td>{program.didCompile.toString()}</td>
    <td>{new Date(program.modifiedAt).toLocaleDateString()}</td>
    <td>{new Date(program.createdAt).toLocaleDateString()}</td>
  </tr>;
}
