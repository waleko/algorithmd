import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AngularFireAuth} from "@angular/fire/auth";
import {environment} from "../environments/environment";
import {take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private http: HttpClient, private afAuth: AngularFireAuth) {
  }

  /**
   * Get firebase uid of currently logged in person. Returns `undefined` if not logged in.
   *
   * @private
   */
  private async getCurrentUID(): Promise<string | undefined> {
    const currentUser = await this.afAuth.user.pipe(take(1)).toPromise()
    return currentUser?.uid
  }

  /**
   * Request custom firebase token from backend
   *
   * @param auth0UID Current auth0 uid of logged in user. If matches current firebase uid of logged in user,
   * then no signing in is performed.
   */
  async signInViaAuth0(auth0UID: string | null = null): Promise<void> {
    // get current firebase user
    const currentUserUID = await this.getCurrentUID()

    // if already logged in as that user
    if (auth0UID == currentUserUID) {
      console.log(`Logging in skipped for ${auth0UID}`)
      return
    }

    const {token} = await this.http.post<{ token: string }>(`${environment.apiUrl}/v1/convertToken`, {}, {})
      .toPromise()
    await this.afAuth.signInWithCustomToken(token)
    console.log(`Logged in as ${await this.getCurrentUID()}`)
  }

  async signOut(): Promise<void> {
    const currentUser = await this.afAuth.user.pipe(take(1)).toPromise()
    if (currentUser != null) {
      await this.afAuth.signOut()
      console.log("Logged out!")
    }
  }
}
