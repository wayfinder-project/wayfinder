import { Component, OnInit } from '@angular/core';
import { Trip } from '../../models/trip.model';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';

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
}
