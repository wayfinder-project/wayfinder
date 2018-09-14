import { Waypoint } from './waypoint.model';

export interface Route {
  id?: number;
  origin: Waypoint;
  destination: Waypoint;
  /**
   * Always ordered from start to finish.
   */
  waypoints: Waypoint[];
}
