import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MapComponent } from './components/map/map.component';

import { FormsModule } from '@angular/forms';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AgmDirectionModule } from 'agm-direction';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MapComponent,
    NavbarComponent,
    HomeComponent
  ],
  imports: [
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyBrZkV0T-ZJncle1r0SqiwQ2MJB6Qxz3mU' }),
    BrowserModule,
    FormsModule,
    AgmDirectionModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    GoogleMapsAPIWrapper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
