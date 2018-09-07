export interface Waypoint {
  id: number;
  latitude: number;
  longitude: number;
  /**
   * A user-readable address string.
   */
  address: string;
}
