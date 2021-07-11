import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {CodeRecord} from "../../code-record";
import {AngularFireDatabase} from "@angular/fire/database";
import {AngularFireAuth} from "@angular/fire/auth";
import {mergeMap} from "rxjs/operators";

@Component({
  selector: 'app-list-codes',
  templateUrl: './list-codes.component.html',
  styleUrls: ['./list-codes.component.scss']
})
export class ListCodesComponent implements OnInit {

  items: Observable<CodeRecord[]>

  constructor(db: AngularFireDatabase, afAuth: AngularFireAuth) {
    // @ts-ignore
    this.items = afAuth.user.pipe(mergeMap(user => {
      let uid: string = user?.uid ?? "null"
      return db.list(`users/${uid}/records`).valueChanges()
    }))
  }

  ngOnInit(): void {

  }

}

