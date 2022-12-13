export type Result<T> = T | Error;

export function isError<T>(e: Result<T>): e is Error {
  if (e instanceof Error) {
    return true;
  }
  return false;
}
