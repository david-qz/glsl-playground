export type Result<T> = T | Error;

export function isError<T>(e: Result<T>): e is Error {
  return e instanceof Error;
}
