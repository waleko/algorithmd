import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {getMimeByFilename} from "../../registered-languages";
import {NewCodeRecord} from "../../code-record";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";
import {AngularFireDatabase} from "@angular/fire/database";


@Component({
  selector: 'app-new-code',
  templateUrl: './new-code.component.html',
  styleUrls: ['./new-code.component.scss']
})
export class NewCodeComponent implements OnInit {

  tagItems: { display: string, value: string }[] = []
  titleControl = new FormControl('')
  filenameControl = new FormControl('')
  codeEditorLanguage = ''
  codeEditorContent = ''

  constructor(private http: HttpClient, private router: Router, private db: AngularFireDatabase) {
  }

  ngOnInit(): void {
  }

  filenameChanged() {
    // acquire filename
    let filename = this.filenameControl.value // TODO: do this automatically via `FormControl.registerOnChange

    // get MIME type for the filename
    let mime = getMimeByFilename(filename)
    let res: string
    if (!mime)
      res = ""
    else
      res = mime[mime.length - 1]

    // pass mime to codemirror
    this.codeEditorLanguage = res
  }

  async publish() {
    let title = this.titleControl.value
    let filename = this.filenameControl.value

    let newCodeRecord: NewCodeRecord = {
      title: title,
      filename: filename,
      tagItems: this.tagItems.map(e => e.value),
      language: this.codeEditorLanguage,
      full_content: this.codeEditorContent
    }

    // TODO: validation
    const {uid} = await this.http.post<{ uid: string }>(`${environment.apiUrl}/v1/new_code`, newCodeRecord, {}).toPromise()

    await this.router.navigate(["view", uid])
  }
}
