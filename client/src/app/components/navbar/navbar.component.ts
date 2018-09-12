import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { GeocodeService } from '../../services/geocode/geocode.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  lat: number;
  lng: number;

  constructor(private authService: AuthService, private router: Router, private geocodeService: GeocodeService) {}

  ngOnInit() {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['login']);
  }
  testGeocode() {
    this.geocodeService.geocode('Reston, VA').subscribe(result => {
      this.lat = result[0].geometry.location.lat();
      this.lng = result[0].geometry.location.lng();
      this.geocodeService.reverseGeocode(new google.maps.LatLng(this.lat, this.lng)).subscribe(addressArr => {
        console.log(addressArr);
      });
    });
  }
}
