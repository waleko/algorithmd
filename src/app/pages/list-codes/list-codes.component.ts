import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { CodeRecordView } from "../../code-record";
import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFireAuth } from "@angular/fire/auth";
import { FirebaseService } from "../../firebase.service";

@Component({
  selector: "app-list-codes",
  templateUrl: "./list-codes.component.html",
  styleUrls: ["./list-codes.component.scss"],
})
export class ListCodesComponent implements OnInit {
  items: Observable<CodeRecordView[]>;

  constructor(fs: FirebaseService) {
    this.items = fs.codeRecordViews;
  }

  ngOnInit(): void {}
}
