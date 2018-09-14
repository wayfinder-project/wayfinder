import { Component, ViewChild, OnInit, AfterViewInit, Input, Output, EventEmitter, OnChanges, NgZone } from '@angular/core';
import { MapsAPILoader, AgmMap, LatLngBounds, AgmCircle } from '@agm/core';
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
import { MarkeroptionsModalComponent } from '../markeroptions-modal/markeroptions-modal.component';
import { WaypointModel } from '../../models/mapwaypoint.model';
import { ChecklistModalComponent } from '../checklist-modal/checklist-modal.component';
import { Checklist, ChecklistItemStatus } from '../../models/checklist.model';


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

  // public origin: google.maps.LatLngLiteral;
  // public destination: google.maps.LatLngLiteral;
  public origin: Marker = { location: null };
  public destination: Marker = { location: null };

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

  circle: Circle;

  polyPoints: any[] = [

  ];

  waypoints: Marker[] = [

  ];
  mapWaypoints: Marker[] = [

  ];

  legs: any[] = [

  ];

  longLeg: any = undefined;


  @ViewChild(AgmMap) map: AgmMap;
  @ViewChild(AgmCircle)
  mapCircle: AgmCircle;
  @ViewChild(NgbTabset)
  private tabset: NgbTabset;
  @ViewChild(MarkeroptionsModalComponent)
  private markerModal: MarkeroptionsModalComponent;
  @ViewChild(ChecklistModalComponent)
  private checklistmodal: ChecklistModalComponent;
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

  // Variables for address autocomplete
  public addrKeys: string[];
  public addr: object;

  constructor(private http: HttpClient, private geocodeService: GeocodeService, private zone: NgZone) {

  }

  circleRadius = 500; // Radius of the place radius
  // public location: LocationModel;
  public directions: any;
  public directionInfo: any;

  public bigLegInfo: any;
  public legInfo: any; // single leg info
  public selectedWaypoint = null;
  public deletedWayPointIndex = -1; // Index of recently deleted waypoint

  ngOnInit() {
    /* this.trip = {creationDate: '', route: { origin: null ,
    destination: null, waypoints: []}, pointsOfInterest: [], checklist: {items: []}}; */
  }

  // get address autocomplete result
  setOrigin(place) {
    // address object contains lat/lng to use
    this.zone.run(() => {
      // this.addr = addrObj;
      // this.addrKeys = Object.keys(addrObj);
      console.log(place);
      this.addOriginFromAddress(place);


    });
  }
  setDestination(place) {
    // address object contains lat/lng to use
    this.zone.run(() => {
      // this.addr = addrObj;
      // this.addrKeys = Object.keys(addrObj);

      console.log(place);
      this.addDestinationFromAddress(place);
    });
  }
  setWaypoint(place) {
    // address object contains lat/lng to use
    this.zone.run(() => {
      // this.addr = addrObj;
      // this.addrKeys = Object.keys(addrObj);

      console.log(place);
      this.addWaypointFromAddress(place);
    });
  }

  ngOnChanges() {
    console.log('Changing:', this.trip);
    // Store the trip data into this component's instance variables.
    if (this.trip.route.origin) {
      this.origin.location = {
        lat: this.trip.route.origin.latitude,
        lng: this.trip.route.origin.longitude,
      };
      this.origin.label = 'S';
      this.origin.draggable = true;
      this.origin.address = this.trip.route.origin.address;
    }
    if (this.trip.route.destination) {
      this.destination.location = {
        lat: this.trip.route.destination.latitude,
        lng: this.trip.route.destination.longitude,
      };
      this.destination.label = 'E';
      this.destination.draggable = true;
      this.destination.address = this.trip.route.destination.address;
    }
    const waypointImage: any = {
      url: 'assets/images/greenmarker.png',
      scaledSize: new google.maps.Size(40, 40)
    };
    console.log(this.trip.route.waypoints);
    this.waypoints = this.trip.route.waypoints.map(waypoint => (
      {
      location: {
        lat: waypoint.latitude,
        lng: waypoint.longitude,
      },
      icon: waypointImage,
      draggable: true,
      address: waypoint.address,
      placeId: waypoint.placeId
    }));
    console.log(this.waypoints);
    this.savedMarkers = this.trip.pointsOfInterest.map(marker => (
      {
      location: {
        lat: marker.latitude,
        lng: marker.longitude,
      },
      updateIcon: {
        url: marker.iconUrl,
        scaledSize: new google.maps.Size(30, 30)
      },
      draggable: true,
      placeId: marker.placeId,
      comments: marker.comments,
      address: marker.address
    }));
    this.getDirection();
    // this.setMarkerLabels(this.directions);
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

  convertWaypoints() {
    this.mapWaypoints = this.waypoints.map(waypoint => ({location: waypoint.location}));
  }

  // Adds a waypoint to the map
  public addWaypoint(event: any) {
    console.log("wat");
    if (this.origin.location != null && this.destination.location != null) {
      const image: any = {
        url: 'assets/images/greenmarker.png',
        scaledSize: new google.maps.Size(40, 40)
      };
      const way: Marker = {
        location: {
          lat: event.coords.lat,
          lng: event.coords.lng,
        },
        waypointId: this.directions.routes[0].waypoint_order.length,
        draggable: true,
        icon: image
      };
      this.waypoints.push(way);
    } else {
      if (this.origin.location == null) {
        this.origin = {location: {
          lat: event.coords.lat,
          lng: event.coords.lng
        },
        draggable: true,
        label: 'S'
      };
      } else if (this.destination.location == null) {
        this.destination = {location: {
          lat: event.coords.lat,
          lng: event.coords.lng
        },
        draggable: true,
        label: 'E'
      };
      }
    }
    this.getDirection();
  }

  public addWaypointFromAddress(addressObject: any) {
    // console.log(addressObject. + ' ' + event.coords.lng);
      console.log("normal");
      const image: any = {
        url: 'assets/images/greenmarker.png',
        scaledSize: new google.maps.Size(40, 40)
      };
      const way: Marker = {
        location: {
          lat: addressObject.geometry.location.lat(),
          lng: addressObject.geometry.location.lng()
        },
        address: addressObject.formatted_address,
        draggable: true,
        icon: image,
        waypointId: this.waypoints.length - 1
      };
      this.waypoints.push(way);
      this.getDirection();
    }
    public addOriginFromAddress(addressObject: any) {
      console.log("origin");
        this.origin = {location: {
          lat: addressObject.geometry.location.lat(),
          lng: addressObject.geometry.location.lng()
        },
        draggable: true,
        label: 'E',
        address: addressObject.formatted_address
      };
      this.getDirection();
    }
    public addDestinationFromAddress(addressObject: any) {
      console.log("destination");
        this.destination = {location: {
          lat: addressObject.geometry.location.lat(),
          lng: addressObject.geometry.location.lng()
        },
        draggable: true,
        label: 'E',
        address: addressObject.formatted_address
      };
      this.getDirection();
    }
  //     else {
  //     if (this.origin.location == null) {
  //       console.log("origin");
  //       this.origin = {location: {
  //         lat: addressObject.geometry.location.lat(),
  //         lng: addressObject.geometry.location.lng()
  //       },
  //       draggable: true,
  //       label: 'E',
  //       address: addressObject.formatted_address
  //     };
  //     } else if (this.destination.location == null) {
  //       console.log("destination");
  //       this.destination = {location: {
  //         lat: addressObject.geometry.location.lat(),
  //         lng: addressObject.geometry.location.lng()
  //       },
  //       draggable: true,
  //       label: 'E',
  //       address: addressObject.formatted_address
  //     };
  //     }
  //   }
  //   this.getDirection();
  // }

  setMarkerLabels(direction: any) {
    if (this.deletedWayPointIndex > -1) {
      this.normalizeMarkerId();
    }
    for (let i = 0; i < this.waypoints.length; i++) {
      if (i > 0 && this.waypoints[i].waypointId === this.waypoints[i - 1].waypointId) {
        this.waypoints[i].waypointId++; // ..Checks for duplicate waypointId. Duplicates happen if user clicks too fast.
      }
      // Sets the label to the index of the waypoint in the waypoint_order array in the direction object.
      this.waypoints[i].label = '' + (direction.routes[0].waypoint_order.indexOf(this.waypoints[i].waypointId) + 1);
    }
  }

  // When waypoint id is deleted, makes sure waypointId's can still be found in waypoint_order array
  // By making sure waypointId's are less than waypoint_order.lenght.
  normalizeMarkerId() {
    for (let i = 0; i < this.waypoints.length; i++) {
      if (this.waypoints[i].waypointId >= this.deletedWayPointIndex) {
        this.waypoints[i].waypointId -= 1;
      }
    }
    this.deletedWayPointIndex = -1;
  }

  // Creates a direction based on origin and destination. based on AGM Direction api
  getDirection() {
    this.origin.location = this.origin.location && { lat: this.origin.location.lat, lng: this.origin.location.lng };
    this.destination.location = this.destination.location && { lat: this.destination.location.lat, lng: this.destination.location.lng };
    if (this.markers[0] == null && this.origin.location != null) {
      this.markers.push({
        location: {
          lat: this.origin.location.lat,
          lng: this.origin.location.lng
        },
        draggable: true,
        label: 'S'
      });
    } else if (this.markers[1] == null && this.destination.location != null) {
      this.markers.push({
        location: {
          lat: this.destination.location.lat,
          lng: this.destination.location.lng
        },
        draggable: true,
        label: 'E'
      });
    }
    this.convertWaypoints();
  }
  // Gets called when a marker(waypoint) is dragged.
  moveWaypoint(marker: Marker, event: any) {
    marker.location = { lat: event.coords.lat, lng: event.coords.lng };
    this.currentMarkers = [];
    this.currentPlace = null;
    this.circle = null;
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
    this.origin.location = { lat: position.coords.latitude, lng: position.coords.longitude };
  }

  // Checks if valid direction.
  onResponse(response) {
    if (response.status === 'ZERO_RESULTS') {
      alert('this route is IMPOSSIBLE!');
    }
  }

  // Updates the direction info and updates the legs.
  directionChanged(event: any) {
    this.directions = event;
    console.log(this.trip);
    console.log(this.directions);
    console.log(this.trip);
    this.directionInfo = this.directions.routes[0].legs[0].distance.text;
    const routeLegs = this.directions.routes[0].legs;
    this.legs = [];
    let totalDistance = 0;
    let totalDuration = 0;
    for (let i = 0; i < routeLegs.length; i++) {
      this.legs.push(routeLegs[i]);
      totalDistance += routeLegs[i].distance.value;
      totalDuration += routeLegs[i].duration.value;
    }
    this.polyPoints = [];
    totalDistance *= 0.000621371192;
    totalDistance = this.roundTo(totalDistance, 2);
    this.bigLegInfo = {distance: {text: totalDistance}, duration: {text: this.ConvertSectoDay(totalDuration)}, steps: [] };
    this.destroyLongLeg();
    this.setMarkerLabels(this.directions);
    this.legInfo = null;
    this.selectedWaypoint = null;
    if (this.tabset.activeId === 'directions') {
      this.tabset.select('routes');
    }
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

  clearLegs() {
    this.destroyLongLeg();
    this.polyPoints = [];
    this.renderOptions.polylineOptions.strokeColor = '#6fa5fcD3';
    this.legInfo = null;
    this.tabset.select('routes');
  }

  totalLegsButton() {
    const end = this.destination;
    const start = this.origin;
    this.controlmap.fitBounds({
      east: this.directions.routes[0].bounds.b.f,
      north: this.directions.routes[0].bounds.f.f,
      west: this.directions.routes[0].bounds.b.b,
      south: this.directions.routes[0].bounds.f.b
    });
    this.polyPoints = [];
    this.destroyLongLeg();
    const pathLength = this.directions.routes[0].overview_path.length;
    this.legInfo = {distance: this.bigLegInfo.distance, duration: this.bigLegInfo.duration, steps: []};
    for (let i = 0; i < this.directions.routes[0].legs.length; i++) {
      for (let q = 0; q < this.directions.routes[0].legs[i].steps.length; q++) {
        this.legInfo.steps.push({instructions: this.directions.routes[0].legs[i].steps[q].instructions});
      }
    }
    // this.legInfo = this.bigLegInfo;
    this.tabset.select('directions');

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
    console.log(this.savedMarkers);
    const request = {
      location: coords,
      radius: this.circleRadius,
      types: [this.currentLocationSearchType]
    };

    this.circle = {
      lat: coords.lat,
      lng: coords.lng,
      radius: this.circleRadius,
      fillColor: 'blue'
    };

    this.currentMarkers = [];

    const service = new google.maps.places.PlacesService(this.controlmap);
    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log(results);
        if (results.length !== 0) {
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

            this.zoomToCircle(this.mapCircle);
          }
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
    // this.controlmap.fitBounds(bounds);
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
        latitude: this.origin.location.lat,
        longitude: this.origin.location.lng
      },
      destination: {
        latitude: this.destination.location.lat,
        longitude: this.destination.location.lng
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

  showMarkerPlaces(marker: Marker) {
    this.selectedWaypoint = marker;
    console.log(this.directions);
    // console.log(index);
    console.log(this.legs);
    this.getPlaces.bind(this)({ lat: marker.location.lat, lng: marker.location.lng });
    if (marker.waypointId != null) {
      console.log(this.waypoints);
      const waypointOrder = this.directions.routes[0].waypoint_order.indexOf(marker.waypointId) + 1;
      console.log(waypointOrder);
      console.log(this.legs[waypointOrder]);
    } else {
      // console.log(this.legs[index]);
    }
  }

  rightTest(index: number) {
  }


  collapseButton() {
    const myGroup = ('#myGroup');

  }

  updateZoomLevel() {
    if (this.controlmap.zoom <= 12) {
      this.currentMarkers = [];
      this.currentPlace = null;
      this.circle = null;
    }
  }

  openAnnotationModal(): void {
    this.annotateMarker.open(this.currentPlace.marker);
  }

  openOptionsModal(index: number): void {
    this.markerModal.open(this.waypoints[index]);
  }

  openChecklistModal(): void {
    console.log('a');
    console.log(this.trip);
    this.checklistmodal.open(this.trip.checklist);
  }

  deleteMarker() {
    const marker = this.selectedWaypoint;
    const waypointIndex = this.waypoints.indexOf(marker);
    this.deletedWayPointIndex = waypointIndex;
    this.waypoints.splice(waypointIndex, 1);
    this.getDirection();
  }





  /**
   * Zooms the map in on the given circle.
   */
  zoomToCircle(circle: AgmCircle): void {
    circle.getBounds().then(bounds => this.controlmap.fitBounds(bounds));
  }

  ConvertSectoDay(seconds: number) {
        const day = Math.round(seconds / (24 * 3600));
        seconds = seconds % (24 * 3600);
        const hour = Math.round(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.round(seconds / 60);
        seconds %= 60;
        if (day > 0) {
          return day + ' day(s) ' + hour + ' hour(s)';
        } else if (hour > 0) {
          return hour + ' hour(s) ' + minutes + ' minute(s)';
        } else {
          return minutes + ' min(s)';
        }
    }
}
