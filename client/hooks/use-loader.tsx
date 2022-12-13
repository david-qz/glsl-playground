import type { DependencyList } from 'react';
import { useEffect, useState } from 'react';
import { isError } from '../../common/result';
import type { Loader, Loading } from '../../common/loading';
import { LoadingState } from '../../common/loading';

export default function useLoader<T>(loader: Loader<T>, dependencies?: DependencyList): Loading<T> {
  const [loadingResource, setLoadingResource] = useState<Loading<T>>({ state: LoadingState.LOADING });

  useEffect(() => {
    loader()
      .then(result => {
        if (!isError(result)) {
          setLoadingResource({ value: result, state: LoadingState.LOADED });
        } else {
          setLoadingResource({ error: result, state: LoadingState.ERROR });
        }
      });
  }, dependencies);

  return loadingResource;
}
