import { Component, Input, ViewChild, NgZone, OnInit } from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { WaypointModel, LocationModel } from '../../models/waypoint.model';
declare var google: any;

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

interface Direction {
  origin: Marker;
  destination: Marker;

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
    suppressMarkers: true,
    draggable: true,
    visible: false
  };

  markers: Marker[] = [
  ];

  directions: Direction[] = [

  ];


 waypoints: any = [
 ];


  @ViewChild(AgmMap) map: AgmMap;

  constructor() {

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
  }

  markerDragEnd(m: any, origin: boolean) {
    if (origin) {
      this.origin.lat = m.coords.lat;
      this.origin.lng = m.coords.lng;
    } else {
      this.destination.lat = m.coords.lat;
      this.destination.lng = m.coords.lng;
    }
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

  showPosition(position) {
    console.log('Latitude: ' + position.coords.latitude +
      'Longitude: ' + position.coords.longitude);
    this.origin.lat = position.coords.latitude;
    this.origin.lng = position.coords.longitude;
  }

}




