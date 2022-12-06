import { useCallback, useEffect, useState } from 'react';
import { ProgramData } from '../../common/api-types';
import * as ProgramsService from '../services/programs-service';

export default function usePrograms() {
  const [programs, setPrograms] = useState<Array<ProgramData>>([]);

  const setProgramsSorted = useCallback((programs: Array<ProgramData>) => {
    setPrograms(sortProgramsByDateModified(programs));
  }, []);

  useEffect(() => {
    (async () => {
      const result = await ProgramsService.getUsersPrograms();

      if (!result) return;

      setProgramsSorted(result);
    })();
  }, []);

  return { programs, setPrograms: setProgramsSorted };
}

function sortProgramsByDateModified(programs: Array<ProgramData>): Array<ProgramData> {
  const copy =  [...programs];
  copy.sort((a, b) => {
    const dateA = new Date(a.modifiedAt);
    const dateB = new Date(b.modifiedAt);
    return dateA < dateB ? 1 : dateA > dateB ? -1 : 0;
  });
  return copy;
}
