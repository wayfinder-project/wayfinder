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
}
