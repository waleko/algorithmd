import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AngularFireAuth} from "@angular/fire/auth";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private http: HttpClient, private afAuth: AngularFireAuth) {
  }

  /**
   * Request custom firebase token from backend
   */
  async signInViaAuth0(): Promise<void> {
    const {token} = await this.http.post<{ token: string }>(`${environment.apiUrl}/v1/convertToken`,
      {},
      {})
      .toPromise()
    await this.afAuth.signInWithCustomToken(token)
  }
}
