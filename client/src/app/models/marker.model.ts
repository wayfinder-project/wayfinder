export interface Marker {
  location: google.maps.LatLngLiteral;
  label?: string;
  waypointId?: number;
  draggable?: boolean;
  placeId?: string;
  icon?: string;
  updateIcon?: google.maps.Icon;
  infoWindow?: boolean;
  notes?: string[];
}

