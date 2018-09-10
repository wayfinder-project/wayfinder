import { Trip } from './trip.model';

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  trips: Trip[];
}
