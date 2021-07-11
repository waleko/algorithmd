import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {AngularFireAuth} from "@angular/fire/auth";
import {map, mergeMap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
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
  tagItems: { display: string, value: string, readonly: boolean }[] = []

  constructor(db: AngularFireDatabase, afAuth: AngularFireAuth, route: ActivatedRoute) {
    // get code uid
    this.uid = route.params.pipe(map(p => p.uid))

    // load info
    //@ts-ignore
    this.fullCodeRecord = this.uid.pipe(mergeMap(uid => db.object(`/records/${uid}`).valueChanges()))

    // transform tags
    this.fullCodeRecord.pipe(map(r => r.info.tagItems.map(e => {
      return {display: e, value: e, readonly: true}
    }))).subscribe(val => this.tagItems = val)
  }

  ngOnInit(): void {
  }

}
