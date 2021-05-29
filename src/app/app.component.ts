import {Component, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {Observable} from "rxjs";
import {User} from "@auth0/auth0-spa-js";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  title = 'algorithmd';

  // Flag if user observable has been loaded
  isDataLoaded: boolean  // TODO: do this cleaner

  constructor(public auth: AuthService) {
    this.isDataLoaded = false

    auth.user$.subscribe(user => {
      this.isDataLoaded = true
    })
  }

  ngOnInit(): void {

  }
}
