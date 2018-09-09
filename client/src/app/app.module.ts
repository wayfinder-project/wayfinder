import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MapComponent } from './components/map/map.component';
import { UserpageComponent } from './components/userpage/userpage.component';

import { FormsModule } from '@angular/forms';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AgmDirectionModule } from 'agm-direction';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './utils/jwt.interceptor';
import { ErrorInterceptor } from './utils/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MapComponent,
    NavbarComponent,
    HomeComponent,
    UserpageComponent,
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBrZkV0T-ZJncle1r0SqiwQ2MJB6Qxz3mU',
      libraries: ['places'],
    }),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AgmDirectionModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    GoogleMapsAPIWrapper,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
