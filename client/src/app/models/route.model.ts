import { Waypoint } from './waypoint.model';

export interface Route {
  id?: number;
  /**
   * Always ordered from start to finish.
   */
  waypoints: Waypoint[];
}
