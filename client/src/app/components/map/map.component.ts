import { Component, ViewChild, OnInit, AfterViewInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MapsAPILoader, AgmMap, LatLngBounds } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user/user.service';
import { AnnotatedWaypoint } from '../../models/annotated-waypoint.model';
import { AnnotateMarkerModalComponent } from '../annotate-marker-modal/annotate-marker-modal.component';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Marker, markerToAnnotatedWayPoint, markerToWaypoint } from '../../models/marker.model';
import { Place } from '../../models/place.model';
import { Circle } from '../../models/circle.model';
import { Trip } from '../../models/trip.model';
import { GeocodeService } from '../../services/geocode/geocode.service';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [
    NgbTabset
  ]
})
export class MapComponent implements OnInit, OnChanges, AfterViewInit {

  public origin: google.maps.LatLngLiteral;
  public destination: google.maps.LatLngLiteral;
  geocoder: any;

  @Input()
  trip: Trip;

  @Output()
  save = new EventEmitter<Trip>();

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

  public renderOptionsForLongLeg = {
    suppressMarkers: true,
    draggable: false,
    visible: false,
    polylineOptions: {
      strokeColor: 'green',
      strokeWeight: 5,
      zIndex: 1,
      clickable: true
    }
  };


  markers: Marker[] = [

  ];

  circles: Circle[] = [

  ];

  polyPoints: any[] = [

  ];

  waypoints: Marker[] = [

  ];

  legs: any[] = [

  ];

  longLeg: any = undefined;


  @ViewChild(AgmMap) map: AgmMap;
  @ViewChild(NgbTabset)
  private tabset: NgbTabset;

  @ViewChild(AnnotateMarkerModalComponent)
  annotateMarker: AnnotateMarkerModalComponent;

  // Logan Smith's Variables (To be added to service)
  savedPlaces: Marker[];
  controlmap;
  locationSearchTypes: string[] = ['lodging', 'restaurant', 'gas_station', 'supermarket', 'rv_park', 'parking', 'park'];
  currentLocationSearchType: string = this.locationSearchTypes[0];

  currentMarkers: Marker[] = [];
  savedMarkers: Marker[] = [];
  currentPlace: Place = null;
  startup = false;

  constructor(private http: HttpClient, private userService: UserService, private geocodeService: GeocodeService) {

  }

  circleRadius = 500; // Radius of the place radius
  // public location: LocationModel;
  public directions: any;
  public directionInfo: any;

  public bigLegInfo: any;
  public legInfo: any; // single leg info

  ngOnInit() {
    // this.getLocation();
    this.getDirection();
  }

  ngOnChanges() {
    console.log('Changing:', this.trip);
    // Store the trip data into this component's instance variables.
    if (this.trip.route.origin) {
      this.origin = {
        lat: this.trip.route.origin.latitude,
        lng: this.trip.route.origin.longitude,
      };
    }
    if (this.trip.route.destination) {
      this.destination = {
        lat: this.trip.route.destination.latitude,
        lng: this.trip.route.destination.longitude,
      };
    }
    this.waypoints = this.trip.route.waypoints.map(waypoint => ({
      location: {
        lat: waypoint.latitude,
        lng: waypoint.longitude,
      }
    }));
    this.getDirection();
  }

  ngAfterViewInit() {
    this.map.mapReady.subscribe(map => {
      this.controlmap = map;
      this.setStartingPoint();
    });
  }

  setStartingPoint() {
    console.log('here');
    const bounds = new google.maps.LatLngBounds();
    const point1: google.maps.LatLngLiteral = { lat: 39.01331613984985, lng: -77.50444177391341 };
    const point2: google.maps.LatLngLiteral = { lat: 39.02291890790844, lng: -77.05537561180404 };
    const point3: google.maps.LatLngLiteral = { lat: 38.71992170806351, lng: -77.07146618896485 };
    const point4: google.maps.LatLngLiteral = { lat: 38.718844051434246, lng: -77.5030315209961 };

    bounds.extend(point1);
    bounds.extend(point2);
    bounds.extend(point3);
    bounds.extend(point4);
    this.controlmap.fitBounds(bounds);
  }

  // Adds a waypoint to the map
  public addWaypoint(event: any) {
    console.log(event.coords.lat + ' ' + event.coords.lng);
    if (this.origin != null && this.destination != null) {
      const way: Marker = {
        location: {
          lat: event.coords.lat,
          lng: event.coords.lng
        },
      };
      this.waypoints.push(way);
      this.markers.push(
        {
          location: way.location,
          waypointId: this.waypoints.length - 1,
          draggable: true
        }
      );
    } else {
      if (this.origin == null) {
        this.origin = {
          lat: event.coords.lat,
          lng: event.coords.lng
        };
      } else if (this.destination == null) {
        this.destination = {
          lat: event.coords.lat,
          lng: event.coords.lng
        };
      }
    }
    this.getDirection();
  }

  // Creates a direction based on origin and destination. based on AGM Direction api
  getDirection() {
    this.origin = this.origin && { lat: this.origin.lat, lng: this.origin.lng };
    this.destination = this.destination && { lat: this.destination.lat, lng: this.destination.lng };
    if (this.markers[0] == null && this.origin != null) {
      this.markers.push({
        location: {
          lat: this.origin.lat,
          lng: this.origin.lng
        },
        draggable: true,
        label: 'START'
      });
    } else if (this.markers[1] == null && this.destination != null) {
      this.markers.push({
        location: {
          lat: this.destination.lat,
          lng: this.destination.lng
        },
        draggable: true,
        label: 'END'
      });
    }

  }
  // Gets called when a marker(waypoint) is dragged.
  moveWaypoint(index: number, event: any) {
    const marker = this.markers[index];
    marker.location = { lat: event.coords.lat, lng: event.coords.lng };
    const way = this.waypoints[this.markers[index].waypointId];
    if (way != null) {
      way.location = marker.location;
    } else {
      this.markerDragEnd(this.markers[index], index);
    }
    this.currentMarkers = [];
    this.currentPlace = null;
    this.circles = null;
    this.getDirection();
  }

  // If a marker(origin/destination) is dragged.
  markerDragEnd(m: Marker, index: number) {
    console.log(m);
    if (index === 0) { // Origin
      this.origin = m.location;
    } else { // Destination
      this.destination = m.location;
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
    this.origin = { lat: position.coords.latitude, lng: position.coords.longitude };
  }

  // Updates the direction info and updates the legs.
  directionChanged(event: any) {
    this.directions = event;

    this.trip.route = this.directions.routes[0]; // cache the directions on the map screen every time it's updated
    console.log(this.directions);
    console.log(this.trip);
    this.directionInfo = this.directions.routes[0].legs[0].distance.text;
    const routeLegs = this.directions.routes[0].legs;
    this.legs = [];
    let totalDistance = 0;
    for (let i = 0; i < routeLegs.length; i++) {
      this.legs.push(routeLegs[i]);
      totalDistance += routeLegs[i].distance.value;
    }
    this.polyPoints = [];
    totalDistance *= 0.000621371192;
    totalDistance = this.roundTo(totalDistance, 2);
    this.bigLegInfo = totalDistance;
    this.destroyLongLeg();
  }
  destroyLongLeg() {
    if (this.longLeg) {
      this.longLeg.visible = false;
    }
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
    this.destroyLongLeg();
    const legsLength = this.legs[i].steps.length;
    console.log(this.legs[i].distance.value);
    if (this.legs[i].distance.value < 350000) {
      for (let q = 0; q < legsLength; q++) {
        const pathLength = this.legs[i].steps[q].path.length;
        for (let z = 0; z < pathLength; z++) {
          const pathPoint = this.legs[i].steps[q].path[z];
          this.polyPoints.push({ lat: pathPoint.lat(), lng: pathPoint.lng() });
        }
      }
    } else {
      console.log('toobig');
      const or = { lat: this.legs[i].start_location.lat(), lng: this.legs[i].start_location.lng() };
      const de = { lat: this.legs[i].end_location.lat(), lng: this.legs[i].end_location.lng() };
      this.longLeg = ({ origin: or, destination: de, visible: true });
    }
    console.log(this.longLeg);
    this.tabset.select('directions');
  }

  totalLegsButton() {
    const end = this.destination;
    const start = this.origin;
    this.controlmap.fitBounds({
      east: Math.max(start.lat, end.lng),
      north: Math.max(start.lat, end.lat),
      west: Math.min(start.lng, end.lng),
      south: Math.min(start.lat, end.lat)
    });
    this.polyPoints = [];
    this.destroyLongLeg();
    const pathLength = this.directions.routes[0].overview_path.length;

    for (let q = 0; q < pathLength; q++) {
      const pathPoint = this.directions.routes[0].overview_path[q];
      this.polyPoints.push({ lat: pathPoint.lat(), lng: pathPoint.lng() });
    }

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
    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log(results);
        if (results.length != 0) {
          console.log("How");
          const bounds: LatLngBounds = new google.maps.LatLngBounds();
          bounds.extend(coords);
          for (let i = 0; i < results.length; i++) {

            const inputPlace = results[i];

            const image: google.maps.Icon = {
              url: inputPlace.icon,
              scaledSize: new google.maps.Size(30, 30)
            };

            this.currentMarkers.push({
              location: {
                lat: inputPlace.geometry.location.lat(),
                lng: inputPlace.geometry.location.lng()
              },
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
        else {

        }
      }
    });

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

      const inputPlace = places[i];

      const image: google.maps.Icon = {
        url: inputPlace.icon,
        scaledSize: new google.maps.Size(30, 30)
      };

      this.currentMarkers.push({
        location: {
          lat: inputPlace.geometry.location.lat(),
          lng: inputPlace.geometry.location.lng()
        },
        label: inputPlace.name,
        draggable: false,
        placeId: inputPlace.place_id,
        updateIcon: image,
        infoWindow: true,
        address: inputPlace.formatted_address
      }
      );
      bounds.extend(inputPlace.geometry.location);
    }
    //this.controlmap.fitBounds(bounds);
  }
  getPlaceDetails(newPlaceId: string, marker: Marker) {
    const request = {
      placeId: newPlaceId,
      fields: ['name', 'rating', 'formatted_phone_number', 'formatted_address', 'opening_hours', 'url', 'photo']
    };
    const service = new google.maps.places.PlacesService(this.controlmap);
    service.getDetails(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.currentPlace = {
          marker: marker,
          name: results.name,
          rating: results.rating,
          phoneNumber: results.formatted_phone_number,
          address: results.formatted_address,
          openNow: results.opening_hours && results.opening_hours.open_now,
          hours: {
            monday: results.opening_hours && results.opening_hours.weekday_text[0],
            tuesday: results.opening_hours && results.opening_hours.weekday_text[1],
            wednesday: results.opening_hours && results.opening_hours.weekday_text[2],
            thursday: results.opening_hours && results.opening_hours.weekday_text[3],
            friday: results.opening_hours && results.opening_hours.weekday_text[4],
            saturday: results.opening_hours && results.opening_hours.weekday_text[5],
            sunday: results.opening_hours && results.opening_hours.weekday_text[6]
          },
          url: results.url
        };
        console.log('currentplace ' + this.currentPlace);
        this.currentPlace.marker.address = this.currentPlace.address;
      }
    });
  }


  callbackDetails(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      this.currentPlace = {
        marker: null,
        name: results.name,
        rating: results.rating,
        phoneNumber: results.formatted_phone_number,
        address: results.formatted_address,
        openNow: results.opening_hours && results.opening_hours.open_now,
        hours: {
          monday: results.opening_hours && results.opening_hours.weekday_text[0],
          tuesday: results.opening_hours && results.opening_hours.weekday_text[1],
          wednesday: results.opening_hours && results.opening_hours.weekday_text[2],
          thursday: results.opening_hours && results.opening_hours.weekday_text[3],
          friday: results.opening_hours && results.opening_hours.weekday_text[4],
          saturday: results.opening_hours && results.opening_hours.weekday_text[5],
          sunday: results.opening_hours && results.opening_hours.weekday_text[6]
        },
        url: results.url
      };
      console.log('currentplace ' + this.currentPlace);
    }
  }

  saveTrip() {
    this.trip.route = {
      origin: {
        latitude: this.origin.lat,
        longitude: this.origin.lng
      },
      destination: {
        latitude: this.destination.lat,
        longitude: this.destination.lng
      },
      waypoints: this.waypoints.map(markerToWaypoint),
    };
    this.trip.pointsOfInterest = this.savedMarkers.map(markerToAnnotatedWayPoint);
    this.save.emit(this.trip);
  }

  saveMarker() {
    this.savedMarkers.push(this.currentPlace.marker);
    console.log(this.savedMarkers);
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
    this.controlmap = $event;
  }

  showMarkerPlaces(index: number) {
    console.log(this.directions);
    console.log(index);
    console.log(this.legs);
    this.getPlaces.bind(this)({ lat: this.markers[index].location.lat, lng: this.markers[index].location.lng });
    if (this.markers[index].waypointId != null) {
      console.log(this.waypoints);
      const waypointOrder = this.directions.routes[0].waypoint_order.indexOf(this.markers[index].waypointId) + 1;
      console.log(waypointOrder);
      console.log(this.legs[waypointOrder]);
    } else {
      console.log(this.legs[index]);
    }
  }

  delete(index: number) {
    console.log('a');
  }


  collapseButton() {
    const myGroup = ('#myGroup');

  }

  updateZoomLevel() {
    if (this.controlmap.zoom <= 12) {
      this.currentMarkers = [];
      this.currentPlace = null;
      this.circles = [];
    }
  }

  openAnnotationModal(): void {
    this.annotateMarker.open(this.currentPlace.marker);
  }


}
