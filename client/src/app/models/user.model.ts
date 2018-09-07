import { Route } from './route.model';

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  routes?: Route[];
}
