import { Leg } from './leg.model';

export interface Route {
  id?: number;
  /**
   * Always ordered from start to finish.
   */
  legs: Leg[];
}
