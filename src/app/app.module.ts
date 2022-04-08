import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Page404Component } from './page404/page404.component';
import { LayoutModule } from './layout/layout.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { SocialLoginModule,SocialAuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { SharedModule } from './shared/shared.module';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { TokenInterceptor } from './shared/interceptors/token.interceptor';
import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = {
	url: environment.socketUrl, // socket server url;
	options: {}
}

@NgModule({
  declarations: [
    AppComponent,
    Page404Component
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      preventDuplicates: true
    }),
    SocialLoginModule,
    SharedModule,
    JwtModule.forRoot({ // for JwtHelperService
      config: {
        tokenGetter: () => {
          return '';
        }
      }
    }),
    SocketIoModule.forRoot(config),
  ],
  providers: [
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              "736558026480-fpcfouck6c8lrfo73thclk3o382t4o0t.apps.googleusercontent.com"
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('3389277134632978')
          }
        ]
      } as SocialAuthServiceConfig
    },
    JwtHelperService,
    {  
      provide: HTTP_INTERCEPTORS,  
      useClass: TokenInterceptor,  
      multi: true  
    },
    CookieService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
