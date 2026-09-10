/**
 * Result<T, E> — Railway-oriented error handling.
 * Use cases return Result instead of throwing exceptions.
 */
export type Result<T, E = string> =
  | { success: true; value: T }
  | { success: false; error: E };

export const ok = <T>(value: T): Result<T, never> => ({
  success: true,
  value,
});

export const fail = <E = string>(error: E): Result<never, E> => ({
  success: false,
  error,
});

export const isOk = <T, E>(result: Result<T, E>): result is { success: true; value: T } =>
  result.success === true;

export const isFail = <T, E>(result: Result<T, E>): result is { success: false; error: E } =>
  result.success === false;
