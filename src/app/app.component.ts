import {Component, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {FirebaseService} from "./firebase.service";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  title = 'algorithmd';

  year = new Date().getFullYear()

  // Flag if user observable has been loaded
  isDataLoaded: boolean  // TODO: do this cleaner

  constructor(public auth: AuthService, private fs: FirebaseService) {
    this.isDataLoaded = false

    // signal that the page has loaded
    auth.user$.toPromise().then(_ => {
      this.isDataLoaded = true
    })

    // sign in into firebase
    auth.user$.pipe(take(1)).subscribe(user => {
      if (user != null)
        fs.signInViaAuth0()
    })
  }

  ngOnInit(): void {

  }
}
