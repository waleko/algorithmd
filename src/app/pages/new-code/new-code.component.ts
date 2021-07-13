import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {getMimeByFilename} from "../../registered-languages";
import {NewCodeRecord} from "../../code-record";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";
import {AuthService} from "@auth0/auth0-angular";
import {take} from "rxjs/operators";


@Component({
  selector: 'app-new-code',
  templateUrl: './new-code.component.html',
  styleUrls: ['./new-code.component.scss']
})
export class NewCodeComponent implements OnInit {

  tagItems: { display: string, value: string }[] = []
  titleControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(100)
  ])
  filenameControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(100),
    Validators.pattern(/^[\w\-.\s]+$/)
  ])
  codeEditorLanguage = ''
  codeEditorContent = ''
  submitted: boolean = false

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) {
  }

  ngOnInit(): void {
    this.submitted = false
  }

  filenameChanged() {
    // acquire filename
    const filename = this.filenameControl.value; // TODO: do this automatically via `FormControl.registerOnChange

    // get MIME type for the filename
    const mime = getMimeByFilename(filename);
    let res: string
    if (!mime)
      res = ""
    else
      res = mime[mime.length - 1]

    // pass mime to codemirror
    this.codeEditorLanguage = res
  }

  async publish() {
    this.submitted = true

    if (this.titleControl.invalid || this.filenameControl.invalid || this.codeEditorContent.length == 0)
      return

    // check if user is authenticated
    let isAuthenticated: boolean = await this.auth.isAuthenticated$.pipe(take(1)).toPromise()

    // if not authenticated, prompt to sign in
    if (!isAuthenticated) {
      // popup login
      await this.auth.loginWithPopup().toPromise()
      // update user's auth status
      isAuthenticated = await this.auth.isAuthenticated$.pipe(take(1)).toPromise()
      // if user refused to sign in, stop
      if (!isAuthenticated)
        return
    }

    const title = this.titleControl.value;
    const filename = this.filenameControl.value;

    const newCodeRecord: NewCodeRecord = {
      title: title,
      filename: filename,
      tagItems: this.tagItems.map(e => e.value),
      language: this.codeEditorLanguage,
      full_content: this.codeEditorContent
    };

    const {uid} = await this.http.post<{ uid: string }>(`${environment.apiUrl}/v1/upload`, newCodeRecord, {}).toPromise()

    await this.router.navigate(["view", uid])
  }
}
