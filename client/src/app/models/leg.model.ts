import { Waypoint } from './waypoint.model';

export interface Leg {
  id: number;
  start: Waypoint;
  end: Waypoint;
  /**
   * In seconds.
   */
  travelTime: number;
  /**
   * In meters.
   */
  distance: number;
  /**
   * The zero-based index of this leg, to order it among other legs.
   */
  index: number;
}
