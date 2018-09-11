import { Waypoint } from './waypoint.model';

export interface AnnotatedWaypoint extends Waypoint {
  name?: string;
  comments: string[];
}
