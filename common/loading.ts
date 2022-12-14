import type { Result } from './result';

export enum LoadingState {
  LOADING,
  LOADED,
  ERROR,
}

type VariantLoading = { state: LoadingState.LOADING };
type VariantLoaded<T> = { state: LoadingState.LOADED, value: T };
type VariantError = { state: LoadingState.ERROR, error: Error };

export type Loading<T> =
  | VariantLoading
  | VariantLoaded<T>
  | VariantError;

export type Loader<T> = () => Promise<Result<T>>;

export function isLoading<T>(loading: Loading<T>): loading is VariantLoading {
  return loading.state === LoadingState.LOADING;
}

export function isLoaded<T>(loading: Loading<T>): loading is VariantLoaded<T> {
  return loading.state === LoadingState.LOADED;
}

export function loadingDidError<T>(loading: Loading<T>): loading is VariantError {
  return loading.state === LoadingState.ERROR;
}
