import { APP_INITIALIZER, ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CodemirrorModule } from "@ctrl/ngx-codemirror";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import * as Sentry from "@sentry/angular";

import { AppComponent } from "./app.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { NotfoundComponent } from "./pages/notfound/notfound.component";
import { NewCodeComponent } from "./pages/new-code/new-code.component";
import { AppRoutingModule } from "./app-routing.module";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../environments/environment";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AuthHttpInterceptor, AuthModule } from "@auth0/auth0-angular";
import { TagInputModule } from "ngx-chips";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularFireAnalyticsModule } from "@angular/fire/analytics";
import { ListCodesComponent } from "./pages/list-codes/list-codes.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ViewCodeComponent } from "./pages/view-code/view-code.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { Ng2SearchPipeModule } from "ng2-search-filter";

@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
    NewCodeComponent,
    ListCodesComponent,
    ViewCodeComponent,
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
    AngularFireAnalyticsModule,

    AuthModule.forRoot({
      domain: "algorithmd-p1.eu.auth0.com",
      clientId: "Wa4HW0vLbAIffwirtPXGSrGzPqIzs0TE",
      useRefreshTokens: true,
      cacheLocation: "localstorage",
      audience: "https://api.algorithmd.wlko.me",
      scope: "read:firebase_token",
      httpInterceptor: {
        allowedList: [`${environment.apiUrl}/*`],
      },
    }),

    BrowserAnimationsModule,
    HttpClientModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
