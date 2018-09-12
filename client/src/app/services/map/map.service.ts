import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { AnnotatedWaypoint } from '../../models/annotated-waypoint.model';
import { Waypoint } from '../../models/waypoint.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  savedPointsOfInterest: AnnotatedWaypoint[] = [];
  savedWayPoints: Waypoint[] = [];

  constructor(private userService: UserService) { }


}
