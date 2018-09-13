import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { HomeComponent } from '../components/home/home.component';
import { AccessGuard } from '../guards/access.guard';
import { UserpageComponent } from '../components/userpage/userpage.component';
import { MapComponent } from '../components/map/map.component';
import { TripListComponent } from '../components/trip-list/trip-list.component';
import { EditTripComponent } from '../components/edit-trip/edit-trip.component';
import { CreateTripComponent } from '../components/create-trip/create-trip.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
    children: [
      { path: 'account', component: UserpageComponent },
      { path: 'create', component: CreateTripComponent },
      {
        path: 'trips',
        children: [
          { path: ':id', component: EditTripComponent },
          { path: '', component: TripListComponent },
        ],
      },
      { path: '', redirectTo: 'trips', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  declarations: [],
  exports: [RouterModule],
})
export class AppRoutingModule {}
