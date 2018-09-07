import { Component, Input, ViewChild, NgZone, OnInit } from '@angular/core';
import { MapsAPILoader, AgmMap, LatLngBounds, LatLngBoundsLiteral } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';


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
  controlmap;

  constructor(private http: HttpClient) {

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
    //console.log(this);
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
    this.getPlaces.bind(this)();
    this.getDirection();
  }

  getPlaces() {
    var pyrmont = new google.maps.LatLng(-33.8665433, 151.1956316);

    // var nmap = new google.maps.Map(document.getElementById('map'), {
    //    center: this.origin,
    //    zoom: 15
    //  });

    var request = {
      location: this.destination,
      radius: '500',
      types: ['lodging']
    };

    console.log(this.controlmap);

    var service = new google.maps.places.PlacesService(this.controlmap);
    service.nearbySearch(request, this.callback.bind(this));
  }

 callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
      this.createMarkers.bind(this)(results);
      console.log(results);
  }
}
createMarkers(places) {
  const bounds: LatLngBounds = new google.maps.LatLngBounds();
  //var placesList = document.getElementById('places');

  for (var i = 0, place; place = places[i]; i++) {

    let image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    let marker = new google.maps.Marker({
      map: this.controlmap,
      icon: image,
      title: place.name,
      position: place.geometry.location
    });
    bounds.extend(place.geometry.location);
  }
  this.controlmap.fitBounds(bounds);
}

getLatLong(placeid: string, map: any, fn) {
  let placeService = new google.maps.places.PlacesService(map);
  placeService.getDetails({
    placeId: placeid
  }, function (result, status) {
    console.log(result.geometry.location.lat());
    console.log(result.geometry.location.lng())
  });
}
mapReady($event: any) { 
  // here $event will be of type google.maps.Map 
  // and you can put your logic here to get lat lng for marker. I have just put a sample code. You can refactor it the way you want.
  //this.getLatLong('ChIJN1t_tDeuEmsRUsoyG83frY4', $event, null);
  this.controlmap = $event;
}


}
