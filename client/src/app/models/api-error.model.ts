/**
 * An error returned from the backend API.
 */
export interface ApiError {
  /**
   * The primary message describing the error.
   */
  message: string;
  /**
   * Any additional details that may be present.
   */
  details: string[];
}
