import type { DependencyList, Dispatch } from 'react';
import { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { isError } from '../../common/result';
import type { Loader, Loading } from '../../common/loading';
import { LoadingState } from '../../common/loading';

export type LoadingStateUpdater<T> = (prev: T | undefined) => T | undefined;
export type LoadingStateAction<T> = T | LoadingStateUpdater<T>;

export default function useLoader<T>(loader: Loader<T>, dependencies?: DependencyList): [Loading<T>, Dispatch<LoadingStateAction<T>>] {
  const [loadingResource, setLoadingResource] = useState<Loading<T>>({ state: LoadingState.LOADING });

  useEffect(() => {
    loader()
      .then(result => {
        if (!isError(result)) {
          setLoadingResource({ value: result, state: LoadingState.LOADED });
        } else {
          if (typeof result === 'function') throw new Error('Please don\'t use useLoader to load function types');
          setLoadingResource({ error: result, state: LoadingState.ERROR });
        }
      });
  }, dependencies);

  const setResource = useCallback((update: LoadingStateAction<T>) => {
    if (update instanceof Function) {
      // NOTE: T in this context could itself be a function type. I don't know why TypeScript doesn't recognize that.
      //       There's no reason we should support loading functions asynchronously, so we simple disallow it and
      //       assume any function passed in here is a state updater function. See error thrown above.
      setLoadingResource(prevLoading => {
        const prevValue = prevLoading.state === LoadingState.LOADED ? prevLoading.value : undefined;
        const updatedResource = update(prevValue);
        if (!updatedResource) return prevLoading;
        return { value: updatedResource, state: LoadingState.LOADED };
      });
    } else {
      setLoadingResource({ value: update, state: LoadingState.LOADED });
    }
  }, []);

  return [loadingResource, setResource];
}
