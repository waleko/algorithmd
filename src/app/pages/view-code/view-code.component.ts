import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {AngularFireAuth} from "@angular/fire/auth";
import {map, mergeMap} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {FullCodeRecord} from "../../code-record";


@Component({
  selector: 'app-view-code',
  templateUrl: './view-code.component.html',
  styleUrls: ['./view-code.component.scss']
})
export class ViewCodeComponent implements OnInit {
  // code uid
  uid: Observable<string>
  // code object
  fullCodeRecord: Observable<FullCodeRecord>
  // tags to be displayed
  tagItems: { display: string, value: string, readonly: boolean, removable: boolean }[] = []

  constructor(db: AngularFireDatabase, afAuth: AngularFireAuth, route: ActivatedRoute, router: Router) {
    // get code uid
    this.uid = route.params.pipe(map(p => p.uid))

    // load info
    // @ts-ignore
    const rawLoaded: Observable<FullCodeRecord> = this.uid.pipe(mergeMap(uid =>
      db.object(`/records/${uid}`).valueChanges())
    )

    this.fullCodeRecord = rawLoaded.pipe(mergeMap(async e => {
      if (e == null)
        await router.navigate(["404"], {skipLocationChange: true})
      return e
    }))

    // transform tags
    this.fullCodeRecord.pipe(map(r => r?.info?.tagItems.map(e => {
      return {display: e, value: e, readonly: true, removable: false}
    }))).subscribe(val => this.tagItems = val)
  }

  ngOnInit(): void {
  }

}
