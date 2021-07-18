import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { getMimeByFilename } from "../../registered-languages";
import { NewCodeRecord } from "../../code-record";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";
import { AuthService } from "@auth0/auth0-angular";
import { map, mergeMap, take } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
import { FirebaseService } from "../../firebase.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { UploadQuota } from "../../upload-quota";

@Component({
  selector: "app-new-code",
  templateUrl: "./new-code.component.html",
})
export class NewCodeComponent implements OnInit {
  tagItems: { display: string; value: string }[] = [];
  titleControl = new FormControl("", [
    Validators.required,
    Validators.maxLength(100),
  ]);
  filenameControl = new FormControl("", [
    Validators.required,
    Validators.maxLength(100),
    Validators.pattern(/^[\w\-.\s]+$/),
  ]);
  codeEditorLanguage = "null";
  codeEditorContent = "";
  submitted: boolean = false;

  maxCodeLengthByQuota: Observable<number>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,
    private spinner: NgxSpinnerService,
    public fs: FirebaseService,
    private modalService: NgbModal
  ) {
    this.maxCodeLengthByQuota = fs.quota.pipe(
      map((quota) => {
        if (quota == null) return 1e6;
        else return (quota.max_upload_size_KB * 1024) / 2;
      })
    );
  }

  ngOnInit(): void {
    this.submitted = false;
  }

  filenameChanged() {
    // acquire filename
    const filename = this.filenameControl.value; // TODO: do this automatically via `FormControl.registerOnChange

    // get MIME type for the filename
    const mime = getMimeByFilename(filename);
    // pass mime to codemirror
    this.codeEditorLanguage = mime.length ? mime[mime.length - 1] : "null";
  }

  // Modal things
  @ViewChild("modalContent")
  private modalContent!: TemplateRef<any>;
  errorText: string = "Something went wrong. Please try again.";

  /**
   * Opens simple templated modal with given text
   * @param text Text to be displayed
   * @private
   */
  private openModal(text: string) {
    this.errorText = text;
    this.modalService.open(this.modalContent, {
      centered: true,
      animation: true,
    });
  }

  /**
   * Validates user input for new code record creation. Performs simple checks and checks against quota.
   * @return `True` if input is valid and can be sent to API; otherwise `False`
   * @private
   */
  private async validateUserInput(): Promise<boolean> {
    // Simple checks
    if (
      this.titleControl.invalid ||
      this.filenameControl.invalid ||
      this.codeEditorContent.length == 0
    )
      return false;

    // get quota (or null if user refused to authenticate)
    const quota: UploadQuota | undefined | null =
      await this.auth.isAuthenticated$
        .pipe(
          // take first from observable
          take(1),
          mergeMap(async (isAuthenticated) => {
            // check auth0 auth status
            if (isAuthenticated) {
              // if user is authenticated, get current quota
              return await this.fs.quota.pipe(take(1)).toPromise();
            } else {
              // if user is not authenticated, prompt him to sign in
              await this.auth
                .loginWithPopup()
                .toPromise()
                .catch((_) => {}); // e.g. user has closed the popup

              // check if user has completed authorizing
              const isNewlyAuthenticated = await this.auth.isAuthenticated$
                .pipe(take(1))
                .toPromise();
              if (isNewlyAuthenticated) {
                // if user is now authenticated get quota

                // show spinner as the process might take a couple of seconds
                this.showSpinner();
                // INFO: `take(2)` is here, as quota is `null` at first
                // and only after successful token exchange it is properly initialized
                return await this.fs.quota.pipe(take(2)).toPromise();
              } else {
                // if user has refused to authenticate, stop
                return null;
              }
            }
          })
        )
        .toPromise();

    this.hideSpinner(); // TODO: avoid spinner reappearing on success

    // if failed to load quota, stop
    // it shall happen only when user has refused authenticating
    if (quota == null) {
      return false;
    } else {
      // check if code does not exceed maximum length
      // INFO: `return false;` is here, as `text-danger` for this case is present in the html
      if (this.codeEditorContent.length * 2 > quota.max_upload_size_KB * 1024)
        return false;
      // check if amount of code records is not exceeded
      if (quota.cur_amount >= quota.max_amount) {
        this.openModal(
          `Cannot upload new codes. Your code quota of ${quota.max_amount} has been reached. Contact administrator to increase your quota.`
        );
        return false;
      }
    }
    // validation was successful
    return true;
  }

  async publish() {
    // activate text-danger errors if any are present
    this.submitted = true;

    // validate user input
    const isValid = await this.validateUserInput();
    if (!isValid) return;

    // get form values
    const title = this.titleControl.value;
    const filename = this.filenameControl.value;

    // prepare code record json body
    const newCodeRecord: NewCodeRecord = {
      title: title,
      filename: filename,
      tagItems: this.tagItems.map((e) => e.value),
      language: this.codeEditorLanguage,
      full_content: this.codeEditorContent,
    };

    // upload the code record
    await this.uploadCode(newCodeRecord);
  }

  private async uploadCode(newCodeRecord: NewCodeRecord) {
    // show spinner, as API may require a cold start
    this.showSpinner();

    await this.http
      .post<{ uid: string }>(
        `${environment.apiUrl}/v1/upload`,
        newCodeRecord,
        {}
      )
      .toPromise()
      .then(async (response) => {
        // get uid of the delivered code record
        const { uid } = response;
        // navigate to next page
        await this.router.navigate(["view", uid]);
      })
      .finally(() => {
        this.hideSpinner();
      });
  }

  loadingComplete: boolean = true;
  private showSpinner() {
    // start spinner in 500ms unless response has been already received by that point
    this.loadingComplete = false;
    setTimeout(() => {
      if (!this.loadingComplete) this.spinner.show();
    }, 500);
  }

  private hideSpinner() {
    this.loadingComplete = true;
    // hide spinner; is done in 50ms to prevent non-atomic behavior
    setTimeout(() => {
      this.spinner.hide();
    }, 50);
  }
}
