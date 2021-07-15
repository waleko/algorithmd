import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {getMimeByFilename} from "../../registered-languages";
import {NewCodeRecord} from "../../code-record";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";
import {AuthService} from "@auth0/auth0-angular";
import {take} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";


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
  codeEditorLanguage = "null"
  codeEditorContent = ""
  submitted: boolean = false

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.submitted = false
  }

  filenameChanged() {
    // acquire filename
    const filename = this.filenameControl.value; // TODO: do this automatically via `FormControl.registerOnChange

    // get MIME type for the filename
    const mime = getMimeByFilename(filename);
    // pass mime to codemirror
    this.codeEditorLanguage = mime.length ? mime[mime.length - 1] : "null"
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

    // get form values
    const title = this.titleControl.value;
    const filename = this.filenameControl.value;

    // prepare code record json body
    const newCodeRecord: NewCodeRecord = {
      title: title,
      filename: filename,
      tagItems: this.tagItems.map(e => e.value),
      language: this.codeEditorLanguage,
      full_content: this.codeEditorContent
    };

    // start spinner in 500ms unless response has been already received by that point
    let responseReceived = false
    setTimeout(() => {
      if (!responseReceived)
        this.spinner.show()
    }, 500)

    // upload code record to API
    const response = await this.http
      .post<{ uid: string }>(`${environment.apiUrl}/v1/upload`, newCodeRecord, {})
      .toPromise()
      .catch( cause => {
        // if request was unsuccessful log error
        console.error(cause)
      })
      .finally(() => {
        responseReceived = true
        // hide spinner; is done in 50ms to prevent non-atomic behavior
        setTimeout(() => {
          this.spinner.hide()
        }, 50)
      })

    // check if response is void (meaning an error was caught)
    if (!(response instanceof Object))
      return

    // get uid
    // @ts-ignore
    const {uid} = response

    // navigate to next page
    await this.router.navigate(["view", uid])
  }
}
