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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MapComponent,
    NavbarComponent
  ],
  imports: [
    AgmCoreModule.forRoot({apiKey: 'AIzaSyBrZkV0T-ZJncle1r0SqiwQ2MJB6Qxz3mU'}),
    BrowserModule,
    FormsModule,
    AgmDirectionModule,
    NgbModule.forRoot()
  ],
  providers: [
    GoogleMapsAPIWrapper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
