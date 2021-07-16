import {Component, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {FirebaseService} from "./firebase.service";

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
    auth.user$.subscribe(_ => {
      this.isDataLoaded = true
    })

    // sign in into firebase
    auth.idTokenClaims$.subscribe(async idTokenClaims => {
      // if no user is signed in, sign out
      if (idTokenClaims == null) {
        await fs.signOut()
        return
      }
      // else, user is authenticated
      // get auth0 uid
      const uid = idTokenClaims?.sub
      // sign in into firebase with auth0 uid
      await fs.signInViaAuth0(uid)
    })
  }

  ngOnInit(): void {

  }
}
