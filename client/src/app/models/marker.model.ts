export interface Marker {
  lat: number;
  lng: number;
  label?: string;
  waypointId?: number;
  draggable?: boolean;
  placeId?: string;
  icon?: string;
  updateIcon?: google.maps.Icon;
  infoWindow?: boolean;
}
