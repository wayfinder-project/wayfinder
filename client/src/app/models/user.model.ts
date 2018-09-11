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
 * A user with an ID; that is, a user that already has a representation on the
 * back-end.
 */
export type UserWithId = Overwrite<User, { id: number }>;

/**
 * New users can omit certain "required" properties which will be provided by
 * default or by the backend.
 */
export type NewUser = Overwrite<User, { trips?: Trip[] }>;
