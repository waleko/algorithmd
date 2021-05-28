import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { FormsModule } from '@angular/forms';

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
import {NbFirebaseAuthModule, NbFirebasePasswordStrategy} from "@nebular/firebase-auth";
import {NbAuthModule} from "@nebular/auth";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NbIconModule, NbLayoutModule, NbThemeModule} from "@nebular/theme";
import {NbEvaIconsModule} from "@nebular/eva-icons";

@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
    NewCodeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CodemirrorModule,
    NgbModule,
    AppRoutingModule,

    AngularFireModule.initializeApp(environment.firebaseConf),
    AngularFireDatabaseModule,
    AngularFireAuthModule,

    NbFirebaseAuthModule,
    NbAuthModule.forRoot({
      forms: {
        login: {
          strategy: "password",
          rememberMe: true,
          socialLinks: [],
        },
        register: {
          strategy: "password",
          terms: true,
          socialLinks: [],
        },
        logout: {
          strategy: "password",
        },
        requestPassword: {
          strategy: "password",
          socialLinks: [],
        },
        resetPassword: {
          strategy: "password",
          socialLinks: [],
        },
        validation: {
          password: {
            required: true,
            minLength: 6,
            maxLength: 50,
          },
          email: {
            required: true,
          },
          fullName: {
            required: false,
            minLength: 4,
            maxLength: 50,
          },
        },
      },
      strategies: [
        NbFirebasePasswordStrategy.setup({
          name: "password",
          login: {
            redirect: {
              success: "/",
            },
          },
          register: {
            redirect: {
              success: "/",
            },
          },
          logout: {
            redirect: {
              success: "/auth/login",
            },
          },
          requestPassword: {
            redirect: {
              success: "/auth/login",
            },
          },
          resetPassword: {
            redirect: {
              success: "/auth/login",
            },
          },
        }),
        // NbFirebaseGoogleStrategy.setup({
        //   name: 'google',
        // }),
      ],
    }),
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbIconModule,
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
