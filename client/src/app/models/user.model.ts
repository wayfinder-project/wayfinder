import { Trip } from './trip.model';

export interface User {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  trips: Trip[];
}

/**
 * New users can omit certain "required" properties which will be provided by
 * default or by the backend.
 */
export type NewUser = Overwrite<User, { trips?: Trip[] }>;
