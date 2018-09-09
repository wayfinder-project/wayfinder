/**
 * A specific type of error which can be returned by the API.
 */
export enum ApiErrorType {
  /**
   * The user is not logged in.
   */
  NotLoggedIn = 'NOT_LOGGED_IN',
  /**
   * The user is logged in, but does not have permission to access an endpoint.
   */
  Unauthorized = 'UNAUTHORIZED',
}

/**
 * An error returned from the backend API.
 */
export interface ApiError {
  /**
   * The HTTP status that accompanied the error. This is not returned by the
   * API, but is provided as a convenience by the ErrorInterceptor.
   */
  status: number;
  /**
   * The type of the error, if a specific type can be associated.
   */
  type?: ApiErrorType;
  /**
   * The primary message describing the error.
   */
  message: string;
  /**
   * Any additional details that may be present.
   */
  details: string[];
}
