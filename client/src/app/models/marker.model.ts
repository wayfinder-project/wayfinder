import { Waypoint } from './waypoint.model';
import { AnnotatedWaypoint } from './annotated-waypoint.model';

export interface Marker {
  location: google.maps.LatLngLiteral;
  address?: string;
  label?: string;
  waypointId?: number;
  draggable?: boolean;
  placeId?: string;
  icon?: string;
  updateIcon?: google.maps.Icon;
  infoWindow?: boolean;
  comments?: string[];
  saved?: boolean;
}

export function markerToWaypoint(marker: Marker): Waypoint {
  return {
    latitude: marker.location.lat,
    longitude: marker.location.lng,
    placeId: marker.placeId,
  };
}

export function markerToAnnotatedWayPoint(marker: Marker): AnnotatedWaypoint {
  return {
    latitude: marker.location.lat,
    longitude: marker.location.lng,
    address: marker.address || '',
    placeId: marker.placeId,
    name: marker.label || '',
    comments: marker.comments || [], // change this
    iconUrl: marker.updateIcon.url || '',
  };
}
