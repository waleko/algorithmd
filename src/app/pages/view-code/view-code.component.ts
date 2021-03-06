import { Component, OnInit } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFireAuth } from "@angular/fire/auth";
import { map, mergeMap, take } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { FullCodeRecord } from "../../code-record";
import { TagView } from "../../tag-view";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-view-code",
  templateUrl: "./view-code.component.html",
})
export class ViewCodeComponent implements OnInit {
  // code uid
  uid: Observable<string>;
  // code object
  fullCodeRecord: Observable<FullCodeRecord>;
  // tags to be displayed
  tagItems: TagView[] = [];

  constructor(
    db: AngularFireDatabase,
    afAuth: AngularFireAuth,
    route: ActivatedRoute,
    router: Router
  ) {
    // get code uid
    this.uid = route.params.pipe(map((p) => p.uid));

    // load info
    const rawLoaded = this.uid.pipe(
      mergeMap(
        (uid) =>
          <Observable<FullCodeRecord>>(
            db.object(`/records/${uid}`).valueChanges()
          )
      )
    );

    // if record is null (no such code record exists), navigate to 404
    this.fullCodeRecord = rawLoaded.pipe(
      mergeMap(async (e) => {
        if (e == null)
          await router.navigate(["404"], { skipLocationChange: true });
        return e;
      })
    );

    // transform tags to `TagView`
    this.fullCodeRecord
      .pipe(
        map(
          (r) =>
            r?.info?.tagItems?.map((e) => {
              return { display: e, value: e, readonly: true, removable: false };
            }) ?? []
        )
      )
      .subscribe((val) => (this.tagItems = val));
  }

  ngOnInit(): void {}

  private async getFullContent(): Promise<string> {
    return await this.fullCodeRecord
      .pipe(
        take(1),
        map((fcr) => fcr.full_content)
      )
      .toPromise();
  }

  async copyCode() {
    const content: string = await this.getFullContent();
    await navigator.clipboard.writeText(content);
  }

  async downloadCode() {
    const uid: string = await this.uid.pipe(take(1)).toPromise();
    window.open(`${environment.apiUrl}/v1/download/${uid}`);
  }
}
