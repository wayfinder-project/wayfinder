import { Component, Input, ViewChild, NgZone, OnInit } from '@angular/core';
import { MapsAPILoader, AgmMap, LatLngBounds, LatLngBoundsLiteral } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { WaypointModel, LocationModel } from '../../models/mapwaypoint.model';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';


declare var google: any;


interface Marker {
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

interface Circle {
  lat: number;
  lng: number;
  radius: number;
  fillColor: string;
}





@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  public origin: any;
  public destination: any;
  geocoder: any;

  public renderOptions = {
    suppressMarkers: true,
    draggable: false,
    visible: false,
    polylineOptions: {
      strokeColor: '#6fa5fcD3',
      strokeWeight: 5,
      zIndex: -1,
      clickable: true
    }
  };

  markers: Marker[] = [

  ];

  circles: Circle[] = [

  ];

  legs: any[] = [

  ];

  polyPoints: any[] = [

  ];


  waypoints: any = [
  ];




  @ViewChild(AgmMap) map: AgmMap;

  // Logan Smith's Variables (To be added to service)
  controlmap;
  locationSearchTypes: string[] = ['lodging', 'restaurant', 'gas_station', 'supermarket', 'rv_park', 'parking', 'park'];
  currentLocationSearchType: string = this.locationSearchTypes[0];

  currentMarkers: Marker[] = [];

  constructor(private http: HttpClient) {

  }
  circleRadius: number; // Radius of the place radius
  public location: LocationModel;
  public waypoint: WaypointModel;
  public directions: any;
  public directionInfo: any;
  public legInfo: any; // single leg info

  ngOnInit() {
    this.circleRadius = 500;
    this.origin = { lat: 38.9586, lng: -77.3570 };
    this.destination = { lat: 38.9072, lng: -77.0369 };
    this.getLocation();
    this.getDirection();
  }


  // Adds a waypoint to the map
  public addWaypoint(event: any) {
    const loc: LocationModel = {
      lat: event.coords.lat,
      lng: event.coords.lng
    };
    const way: WaypointModel = {
      location: loc,
    };
    this.waypoints.push(way);
    this.markers.push(
      {
        lat: loc.lat,
        lng: loc.lng,
        waypointId: this.waypoints.length - 1,
        draggable: true
      }
    );
    this.getDirection();
  }

  // Creates a direction based on origin and destination. based on AGM Direction api
  getDirection() {
    this.origin = { lat: this.origin.lat, lng: this.origin.lng };
    this.destination = { lat: this.destination.lat, lng: this.destination.lng };
    if (this.markers.length === 0) {
      this.markers.push({
        lat: this.origin.lat,
        lng: this.origin.lng,
        draggable: true,
        label: 'START'
      });
      this.markers.push({
        lat: this.destination.lat,
        lng: this.destination.lng,
        draggable: true,
        label: 'END'
      });
    } else {
      this.markers[0].lat = this.origin.lat;
      this.markers[0].lng = this.origin.lng;

    }

  }
  // Gets called when a marker(waypoint) is dragged.
  moveWaypoint(index: number, event: any) {
    const marker = this.markers[index];
    marker.lat = event.coords.lat;
    marker.lng = event.coords.lng;
    const way = this.waypoints[this.markers[index].waypointId];
    if (way != null) {
      way.location.lat = marker.lat;
      way.location.lng = marker.lng;
    } else {
      this.markerDragEnd(this.markers[index], true);
    }
    this.getDirection();
  }

  // If a marker(origin/destination) is dragged.
  markerDragEnd(m: any, origin: boolean) {
    console.log(m);
    if (origin) {
      this.origin.lat = m.lat;
      this.origin.lng = m.lng;
    } else {
      this.destination.lat = m.lat;
      this.destination.lng = m.lng;
    }
    this.getDirection();
  }


  // Gets the current location of the user.
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
    } else {
      console.log('error');
    }
  }
  showPosition(position) {
    this.origin.lat = position.coords.latitude;
    this.origin.lng = position.coords.longitude;
  }

  // Updates the direction info and updates the legs.
  directionChanged(event: any) {
    this.directions = event;
    console.log(this.directions);
    this.directionInfo = this.directions.routes[0].legs[0].distance.text;
    const routeLegs = this.directions.routes[0].legs;
    this.legs = [];
    for (let i = 0; i < routeLegs.length; i++) {
      this.legs.push(routeLegs[i]);
    }
    this.polyPoints = [];
  }



  // Creates buttons for each leg. Highlights and centers on the leg when pressed.
  legButton(i: number) {
    this.legInfo = this.legs[i];
    console.log(this.legInfo);
    const end = this.legs[i].end_location;
    const start = this.legs[i].start_location;
    this.controlmap.fitBounds({
      east: Math.max(start.lng(), end.lng()),
      north: Math.max(start.lat(), end.lat()),
      west: Math.min(start.lng(), end.lng()),
      south: Math.min(start.lat(), end.lat())
    });
    this.polyPoints = [];
    const legsLength = this.legs[i].steps.length;
    let count = 0;
    for (let q = 0; q < legsLength; q++) {
      const pathLength = this.legs[i].steps[q].path.length;
      if (pathLength < 1000) {
        for (let z = 0; z < pathLength; z++) {
          count++;
          const pathPoint = this.legs[i].steps[q].path[z];
          this.polyPoints.push({ lat: pathPoint.lat(), lng: pathPoint.lng() });
        }
      } else {
        const pathPoints: any[] = [];
        pathPoints.push(this.legs[i].steps[q].path[0]);
        pathPoints.push(this.legs[i].steps[q].path[1]);

        pathPoints.push(this.legs[i].steps[q].path[pathLength - 2]);
        pathPoints.push(this.legs[i].steps[q].path[pathLength - 1]);

        for (const p of pathPoints) {
          this.polyPoints.push({ lat: p.lat(), lng: p.lng() });
        }

      }
    }
    console.log(count);
  }

  // Tries to find the point in the path.
  findPointinPath(paths: any, point: any, round: number) {
    const pointIndex = paths.findIndex(x =>
      this.roundTo(x.lat(), round) === this.roundTo(point.lat(), round) &&
      this.roundTo(x.lng(), round) === this.roundTo(point.lng(), round)
    );
    if (pointIndex === -1 && (round - 1) > -1) {
      this.findPointinPath(paths, point, round - 1);
    }
    return pointIndex;
  }

  roundTo(x: number, r: number) {
    return (Math.round(x * (10 ** (r - 1))) / (10 ** (r - 1)));
  }

  getPlaces(coords: any) {


    // var nmap = new google.maps.Map(document.getElementById('map'), {
    //    center: this.origin,
    //    zoom: 15
    //  });

    const request = {
      location: coords,
      radius: this.circleRadius,
      types: [this.currentLocationSearchType]
    };

    const circle = {
      lat: coords.lat,
      lng: coords.lng,
      radius: this.circleRadius,
      fillColor: 'blue'
    };
    this.circles = [];
    this.circles.push(circle);

    this.currentMarkers = [];

    const service = new google.maps.places.PlacesService(this.controlmap);
    service.nearbySearch(request, this.callbackPlaces.bind(this));
  }

  callbackPlaces(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      this.createMarkers.bind(this)(results);
      console.log(results);
    }
  }
  createMarkers(places) {
    const bounds: LatLngBounds = new google.maps.LatLngBounds();

    for (let i = 0; i < places.length; i++) {

      let inputPlace = places[i];

      const image: google.maps.Icon = {
        url: inputPlace.icon,
        scaledSize: new google.maps.Size(30, 30)
      };

      this.currentMarkers.push({
        lat: inputPlace.geometry.location.lat(),
        lng: inputPlace.geometry.location.lng(),
        label: inputPlace.name,
        draggable: false,
        placeId: inputPlace.place_id,
        updateIcon: image,
        infoWindow: true
      }
      );
      bounds.extend(inputPlace.geometry.location);
    }
    this.controlmap.fitBounds(bounds);
  }
  getPlaceDetails(newPlaceId: string) {


    const request = {
      placeId: newPlaceId,
      fields: ['name', 'rating', 'formatted_phone_number', 'formatted_address', 'opening_hours', 'url', 'photo']
    }
    const service = new google.maps.places.PlacesService(this.controlmap);
    service.getDetails(request, this.callbackDetails.bind(this));

  }
  callbackDetails(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      //this.createMarkers.bind(this)(results);
      console.log(results);
    }
  }

  getLatLong(placeid: string, map: any, fn) {
    const placeService = new google.maps.places.PlacesService(map);
    placeService.getDetails({
      placeId: placeid
    }, function (result, status) {
      console.log(result.geometry.location.lat());
      console.log(result.geometry.location.lng());
    });
  }
  mapReady($event: any) {
    // here $event will be of type google.maps.Map
    // and you can put your logic here to get lat lng for marker. I have just put a sample code. You can refactor it the way you want.
    // this.getLatLong('ChIJN1t_tDeuEmsRUsoyG83frY4', $event, null);
    this.controlmap = $event;
    console.log(this.controlmap);
  }



  showMarkerPlaces(index: number) {
    this.getPlaces.bind(this)({ lat: this.markers[index].lat, lng: this.markers[index].lng });
  }


}




