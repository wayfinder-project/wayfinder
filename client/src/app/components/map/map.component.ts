import { Component, Input, ViewChild, NgZone, OnInit } from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';

declare var google: any;




@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

public lat: Number = 24.799448;
public lng: Number = 120.979021;
public origin: any;
public destination: any;
  geocoder: any;

  public renderOptions = {
    suppressMarkers: true,
    draggable: true,
    visible: true
};


public waypoints: any = [];



  @ViewChild(AgmMap) map: AgmMap;

  constructor() {

  }

  public change(event: any) {
    this.waypoints = event.request.waypoints;
  }

  ngOnInit() {
    this.origin = { lat: 38.9586, lng: -77.3570 };
    this.destination = { lat: 38.9072, lng: -77.0369 };
    this.getDirection();
  }
  getDirection() {

        this.origin = { lat: this.origin.lat, lng: this.origin.lng};
        this.destination = { lat: this.destination.lat, lng: this.destination.lng};
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



}
