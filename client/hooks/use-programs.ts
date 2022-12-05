import { useEffect, useState } from 'react';
import { ProgramData } from '../../common/api-types';
import * as ProgramsService from '../services/programs-service';

export default function usePrograms() {
  const [programs, setPrograms] = useState<Array<ProgramData>>([]);

  useEffect(() => {
    (async () => {
      const result = await ProgramsService.getUsersPrograms();

      if (!result) return;

      result.sort((a, b) => {
        const dateA = new Date(a.modifiedAt);
        const dateB = new Date(b.modifiedAt);
        return dateA < dateB ? 1 : dateA > dateB ? -1 : 0;
      });
      setPrograms(result);
    })();
  }, []);

  return programs;
}
