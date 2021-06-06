import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {getMimeByFilename} from "../../registered-languages";


@Component({
  selector: 'app-new-code',
  templateUrl: './new-code.component.html',
  styleUrls: ['./new-code.component.scss']
})
export class NewCodeComponent implements OnInit {

  constructor() { }

  tagItems: string[] = []

  titleControl = new FormControl('')
  filenameControl = new FormControl('')

  codeEditorLanguage = ''
  codeEditorContent = ''

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
}
