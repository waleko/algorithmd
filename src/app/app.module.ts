import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import * as Sentry from "@sentry/angular";

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {Router} from "@angular/router";
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { NewCodeComponent } from './pages/new-code/new-code.component';
import {AppRoutingModule} from "./app-routing.module";
import {AngularFireModule} from "@angular/fire";
import {environment} from "../environments/environment";
import {AngularFireDatabaseModule} from "@angular/fire/database";
import {AngularFireAuthModule} from "@angular/fire/auth";
import {AuthModule} from "@auth0/auth0-angular";
import {TagInputModule} from "ngx-chips";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
    NewCodeComponent
  ],
  imports: [
    BrowserModule,
    TagInputModule,
    FormsModule,
    ReactiveFormsModule,
    CodemirrorModule,
    NgbModule,
    AppRoutingModule,

    AngularFireModule.initializeApp(environment.firebaseConf),
    AngularFireDatabaseModule,
    AngularFireAuthModule,

    AuthModule.forRoot({
      domain: 'algorithmd.eu.auth0.com',
      clientId: 'X3riHlRCmbZU1HV2splhBswCZvI6p2oN',
      useRefreshTokens: true
    }),

    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: true,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
