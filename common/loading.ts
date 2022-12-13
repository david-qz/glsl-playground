import type { Result } from './result';

export enum LoadingState {
  LOADED,
  LOADING,
  ERROR,
}

export type Loading<T> =
  | { state: LoadingState.LOADED, value: T }
  | { state: LoadingState.LOADING }
  | { state: LoadingState.ERROR, error: Error };

export type Loader<T> = () => Promise<Result<T>>;

export function isLoaded<T>(loading: Loading<T>): boolean {
  return loading.state === LoadingState.LOADED;
}

export function isLoading<T>(loading: Loading<T>): boolean {
  return loading.state === LoadingState.LOADING;
}

export function loadingDidError<T>(loading: Loading<T>): boolean {
  return loading.state === LoadingState.ERROR;
}
