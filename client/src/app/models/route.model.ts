import { Leg } from './leg.model';

export interface Route {
  id: number;
  /**
   * As a UTC timestamp in the format "yyyy-MM-dd'T'HH:mm:ss'Z'"; e.g.
   * "2018-09-06T21:45:45Z".
   */
  creationDate: string;
  /**
   * Always ordered from start to finish.
   */
  legs: Leg[];
}
