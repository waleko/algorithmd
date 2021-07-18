import { Component, OnInit } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { FirebaseService } from "./firebase.service";
import { Observable, OperatorFunction } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { CodeRecordView } from "./code-record";
import { Ng2SearchPipe } from "ng2-search-filter";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
})
export class AppComponent implements OnInit {
  title = "algorithmd";

  year = new Date().getFullYear();

  // Flag if user observable has been loaded
  isDataLoaded: boolean; // TODO: do this cleaner

  constructor(
    public auth: AuthService,
    private fs: FirebaseService,
    private router: Router
  ) {
    this.isDataLoaded = false;

    // signal that the page has loaded
    auth.user$.subscribe((_) => {
      this.isDataLoaded = true;
    });

    // sign in into firebase
    auth.user$.subscribe(async (user) => {
      // if no user is signed in, sign out
      if (user == null) {
        await fs.signOut();
        return;
      }
      // else, user is authenticated
      // get auth0 uid
      const uid = user?.sub;
      // sign in into firebase with auth0 uid
      await fs.signInViaAuth0(uid);
    });
  }

  codeRecordSearchFormatter = (crv: CodeRecordView) => crv.codeRecord.title;

  codeRecordSearchSelect(crv: CodeRecordView): string {
    this.router.navigate(["view", crv.codeRecord.uid]).then((_) => {
      const el = <HTMLInputElement>document.getElementById("codeRecordSearch");
      el.value = "";
      el.blur();
    });
    return this.codeRecordSearchFormatter(crv);
  }

  codeRecordSearchFunction: OperatorFunction<
    string,
    readonly CodeRecordView[]
  > = (text$: Observable<string>) =>
    this.fs.codeRecordViews.pipe(
      mergeMap((codeRecordViews) =>
        text$.pipe(
          map(
            (text) =>
              <CodeRecordView[]>Ng2SearchPipe.filter(codeRecordViews, text)
          )
        )
      )
    );

  ngOnInit(): void {}

  async logout() {
    await this.fs.signOut();
    this.auth.logout({ returnTo: window.location.origin });
  }
}
