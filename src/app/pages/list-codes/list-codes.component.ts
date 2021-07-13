import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {CodeRecord} from "../../code-record";
import {AngularFireDatabase} from "@angular/fire/database";
import {AngularFireAuth} from "@angular/fire/auth";
import {map, mergeMap} from "rxjs/operators";

@Component({
  selector: 'app-list-codes',
  templateUrl: './list-codes.component.html',
  styleUrls: ['./list-codes.component.scss']
})
export class ListCodesComponent implements OnInit {
  items: Observable<[CodeRecord, { display: string, value: string, readonly: boolean, removable: boolean }[]][]>

  constructor(db: AngularFireDatabase, afAuth: AngularFireAuth) {
    this.items = afAuth.user.pipe(mergeMap(user => {
      // get current user uid
      let uid: string = user?.uid ?? "null"
      console.log(uid)
      // load from db
      return (<Observable<CodeRecord[]>>db.list(`/users/${uid}/records`).valueChanges())
    }), map(e => {
      // transform tags
      return e.map(cr => [cr, cr.tagItems.map(tag => {
        return {display: tag, value: tag, readonly: true, removable: false}
      })])
    }))
  }

  ngOnInit(): void {

  }

}

