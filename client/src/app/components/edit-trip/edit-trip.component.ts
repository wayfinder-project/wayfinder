import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Trip } from '../../models/trip.model';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-edit-trip',
  templateUrl: './edit-trip.component.html',
  styleUrls: ['./edit-trip.component.css'],
})
export class EditTripComponent implements OnInit {
  trip: Trip;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = parseInt(params.get('id'), 10);
      this.userService.getCurrentUser().subscribe(user => {
        // Find the trip with the given ID among the user's trips.
        this.trip = user.trips.find(trip => trip.id === id);
        if (!this.trip) {
          // Bad ID; take the user back to the trips list view.
          console.error(`No trip with ID ${id}.`);
          this.router.navigate(['home', 'trips']);
          return;
        }
      });
    });
  }

  /**
   * Handler method called when the map component signals that the user has
   * saved the trip.
   */
  updateTrip(trip: Trip): void {
    // This line is probably not strictly necessary, but is good in case future
    // changes affect the handling of the trip variable in the map component.
    console.log(trip.id);
    console.log(this.trip.id);
    this.trip = trip;
    // We need to ensure that we overwrite the trip object already in the user
    // object.
    this.userService.getCurrentUser().subscribe(user => {
      const idx = user.trips.findIndex(
        userTrip => userTrip.id === this.trip.id
      );
      if (idx < 0) {
        console.error(`Trip with ID ${this.trip.id} has been deleted!`);
        return;
      }
      user.trips[idx] = this.trip;
      this.userService.update(user).subscribe(_ => {
        console.log('Updated user:', user);
        this.router.navigate(['home', 'trips']);
      });
    });
  }
}
