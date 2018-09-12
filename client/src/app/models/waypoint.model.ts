export interface Waypoint {
  id?: number;
  latitude: number;
  longitude: number;
  /**
   * A user-readable address string.
   */
  address?: string;
  /**
   * The place ID, as defined by Google.
   */
  placeId?: string;
}
