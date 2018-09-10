import { Route } from './route.model';
import { AnnotatedWaypoint } from './annotated-waypoint.model';

export interface Trip {
  id: number;
  /**
   * As a UTC timestamp in the format "yyyy-MM-dd'T'HH:mm:ss'Z'"; e.g.
   * "2018-09-06T21:45:45Z".
   */
  creationDate: string;
  route: Route;
  /**
   * Any points of interested that the user has saved. These are not in any
   * particular order.
   */
  pointsOfInterest: AnnotatedWaypoint[];
}
