import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AngularFireAuth } from "@angular/fire/auth";
import { environment } from "../environments/environment";
import { map, mergeMap, take } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { CodeRecord, CodeRecordView } from "./code-record";
import { AngularFireDatabase } from "@angular/fire/database";
import { UploadQuota } from "./upload-quota";

@Injectable({
  providedIn: "root",
})
export class FirebaseService {
  /**
   * Realtime code record view list for authenticated user (or else empty)
   */
  public codeRecordViews: Observable<CodeRecordView[]>;

  public quota: Observable<UploadQuota | undefined | null>;

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {
    this.codeRecordViews = this.getCodeRecordsViews();
    this.quota = this.getQuota();
  }

  /**
   * Request custom firebase token from backend
   *
   * @param auth0UID Current auth0 uid of logged in user. If matches current firebase uid of logged in user,
   * then no signing in is performed.
   */
  async signInViaAuth0(auth0UID: string | null = null): Promise<void> {
    // get current firebase user
    const currentUserUID = await this.getCurrentUID();

    // if already logged in as that user
    if (auth0UID == currentUserUID) {
      console.log(`Logging in skipped for ${auth0UID}`);
      return;
    }

    const { token } = await this.http
      .post<{ token: string }>(`${environment.apiUrl}/v1/convertToken`, {}, {})
      .toPromise();
    await this.afAuth.signInWithCustomToken(token);
    console.log(`Logged in as ${await this.getCurrentUID()}`);
  }

  /**
   * Sign out of firebase
   */
  async signOut(): Promise<void> {
    if ((await this.getCurrentUID()) != null) {
      await this.afAuth.signOut();
      console.log("Logged out!");
    }
  }

  /**
   * Gets realtime code records of signed in user (or else empty)
   *
   * @private
   */
  private getCodeRecordsViews(): Observable<CodeRecordView[]> {
    return this.afAuth.user.pipe(
      mergeMap((user) => {
        // get current user uid
        let uid = user?.uid;
        if (uid == null) return of([]);
        // load from db
        return <Observable<CodeRecord[]>>(
          this.db.list(`/users/${uid}/records`).valueChanges()
        );
      }),
      map((e) => {
        // transform tags to tagviews
        return e.map((cr) => {
          return {
            codeRecord: cr,
            tagViews:
              cr.tagItems?.map((tag) => {
                return {
                  display: tag,
                  value: tag,
                  readonly: true,
                  removable: false,
                };
              }) ?? [],
          };
        });
      }),
      map((arr) => arr.reverse())
    );
  }

  /**
   * Gets realtime quota for current firebase user
   * @private
   */
  private getQuota(): Observable<UploadQuota | undefined | null> {
    return this.afAuth.user.pipe(
      mergeMap((user) => {
        // get user uid
        let uid = user?.uid;
        // if not authenticated return null
        if (uid == null) return of(null);
        // try to get custom quota
        return (<Observable<UploadQuota | undefined | null>>(
          this.db.object(`/limits/customQuotas/${uid}`).valueChanges()
        )).pipe(
          mergeMap((customQuota) => {
            if (customQuota == null)
              // if no custom quota is present, return default quota
              return <Observable<UploadQuota>>(
                this.db.object(`/limits/defaultLimit`).valueChanges()
              );
            else return of(customQuota);
          })
        );
      })
    );
  }

  /**
   * Get firebase uid of currently logged in person. Returns `undefined` if not logged in.
   *
   * @private
   */
  private async getCurrentUID(): Promise<string | undefined> {
    const currentUser = await this.afAuth.user.pipe(take(1)).toPromise();
    return currentUser?.uid;
  }
}
