import { Marker } from './marker.model';

export interface Place {
  marker: Marker;
  name: string;
  rating: number;
  phoneNumber: string;
  address: string;
  openNow: boolean;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  url: string;
  website?: string;
  photo?: any;
}
