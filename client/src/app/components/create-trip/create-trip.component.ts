import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Trip } from '../../models/trip.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.css'],
})
export class CreateTripComponent implements OnInit {
  trip: Trip = {
    creationDate: new Date().toISOString(),
    route: {
      origin: null,
      destination: null,
      waypoints: []
    },
    pointsOfInterest: [],
    checklist: { items: [] },
  };

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {}

  saveTrip(trip: Trip) {
    // Make sure that we're making a new trip.
    trip.id = null;
    // Update the creation date with the actual save date.
    trip.creationDate = new Date().toISOString();
    this.userService.getCurrentUser().subscribe(user => {
      user.trips.push(trip);
      this.userService.update(user).subscribe(_ => {
        console.log(_);
        // User has been updated with the new trip; redirect to trips page.
        this.router.navigate(['home', 'trips']);
      });
    });
  }
}
