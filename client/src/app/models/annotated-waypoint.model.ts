import { Waypoint } from './waypoint.model';

export interface AnnotatedWaypoint extends Waypoint {
  name?: string;
  comments: string[];
  /**
   * The URL of an icon representing the type of this waypoint.
   */
  iconUrl: string;
}
