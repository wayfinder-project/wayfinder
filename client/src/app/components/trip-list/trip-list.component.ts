import { Component, OnInit } from '@angular/core';
import { Trip } from '../../models/trip.model';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { Waypoint } from '../../models/waypoint.model';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css'],
})
export class TripListComponent implements OnInit {
  trips: Trip[];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      console.log('User trips:', user.trips);
      this.trips = user.trips;
    });
  }

  handleClick(trip: Trip): void {
    console.log('Handling click on trip:', trip);
    this.router.navigate(['home', 'trips', trip.id]);
  }

  /**
   * Formats a waypoints address, either by using the address itself or by
   * constructing a string out of its geographical coordinates.
   *
   * @param waypoint the waypoint whose address to format
   */
  formatAddress(waypoint: Waypoint): string {
    return (
      waypoint.address ||
      `${this.formatCoordinate(waypoint.latitude)} N ${this.formatCoordinate(
        waypoint.longitude
      )} W`
    );
  }

  /**
   * Formats a coordinate in degrees-minutes-seconds format.
   *
   * @param coordinate the coordinate (latitude or longitude) to format
   */
  private formatCoordinate(coordinate: number): string {
    if (coordinate < 0) {
      return `-${this.formatCoordinate(-coordinate)}`;
    }
    const degrees = Math.floor(coordinate);
    coordinate = (coordinate - degrees) * 60;
    const minutes = Math.floor(coordinate);
    coordinate = (coordinate - minutes) * 60;
    const seconds = Math.floor(coordinate);
    return `${degrees}°${minutes}′${seconds}″`;
  }
}
