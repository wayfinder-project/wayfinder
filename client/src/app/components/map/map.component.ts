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
  draggable: boolean;
}





@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  public lat: Number;
  public lng: Number;
  public origin: any;
  public destination: any;
  geocoder: any;

  public renderOptions = {
    suppressMarkers: false,
    draggable: true,
    visible: true
  };

  markers: Marker[] = [
  ];

  directions: any = [];


 waypoints: any = [
 ];


  @ViewChild(AgmMap) map: AgmMap;

  // Logan Smith's Variables (To be added to service)
  controlmap;
  locationSearchTypes: string[] = ['lodging', 'restaurant', 'gas_station', 'supermarket', 'rv_park', 'parking', 'park'];
  currentLocationSearchType: string = this.locationSearchTypes[0];
  currentMarkers: google.maps.Marker[] = [];

  constructor(private http: HttpClient) {

  }

  public location: LocationModel;
  public waypoint: WaypointModel;

  public change(event: any) {
    console.log(this.location);
    const  loc: LocationModel = {
      lat : 5,
      lng : 3
    };
    loc.lat = event.coords.lat;
    loc.lng = event.coords.lng;
    const way: WaypointModel = {
      location : null,
    };
    way.location = loc;
   this.waypoints.push(way);
    console.log(way);
    console.log(this.waypoints);
    this.getDirection();
  }

  ngOnInit() {
    this.lat = 38.9586;
    this.lng = -77.3570;
    console.log(this.lat);
    this.origin = { lat: 38.9586, lng: -77.3570 };
    this.destination = { lat: 38.9072, lng: -77.0369 };
    console.log(this.origin);
    this.getLocation();
    this.getDirection();
  }

  getDirection() {
    this.origin = { lat: this.origin.lat, lng: this.origin.lng };
    this.destination = { lat: this.destination.lat, lng: this.destination.lng };
    this.map.triggerResize();
    this.getPlaces.bind(this)();
  }

  markerDragEnd(m: any, origin: boolean) {
    if (origin) {
      this.origin.lat = m.coords.lat;
      this.origin.lng = m.coords.lng;
    } else {
      this.destination.lat = m.coords.lat;
      this.destination.lng = m.coords.lng;
    }
    this.getPlaces.bind(this)();
    this.getDirection();
  }

  mapClicked($event) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
    console.log(this.markers[0]);
    if (this.markers.length % 2 === 0 ) {
      this.directions.push({
        origin: this.markers[this.markers.length - 2],
        destination: this.markers[this.markers.length - 1]
      });
    }
    console.log(this.directions);
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
    } else {
      console.log('error');
    }
  }

  getPlaces() {


    // var nmap = new google.maps.Map(document.getElementById('map'), {
    //    center: this.origin,
    //    zoom: 15
    //  });

    const request = {
      location: this.destination,
      radius: '500',
      types: [this.currentLocationSearchType]
    };

    console.log(this.controlmap);

    for (let i = 0; i < this.currentMarkers.length; i++) {
      this.currentMarkers[i].setMap(null);
    }
    this.currentMarkers = [];

    const service = new google.maps.places.PlacesService(this.controlmap);
    service.nearbySearch(request, this.callback.bind(this));
  }

 callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
      this.createMarkers.bind(this)(results);
      console.log(results);
  }
}
createMarkers(places) {
  const bounds: LatLngBounds = new google.maps.LatLngBounds();
  // var placesList = document.getElementById('places');

  for (let i = 0, place; place = places[i]; i++) {

    const image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    const marker = new google.maps.Marker({
      map: this.controlmap,
      icon: image,
      title: place.name,
      position: place.geometry.location
    });

    this.currentMarkers.push(marker);

    bounds.extend(place.geometry.location);
  }
  this.controlmap.fitBounds(bounds);
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
}

  showPosition(position) {
    console.log('Latitude: ' + position.coords.latitude +
      'Longitude: ' + position.coords.longitude);
    this.origin.lat = position.coords.latitude;
    this.origin.lng = position.coords.longitude;
  }

}




