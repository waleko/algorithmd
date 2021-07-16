import { TagView } from "./tag-view";

export interface CodeRecord {
  uid: string;
  title: string;
  language: string;
  preview_content: string;
  tagItems?: string[];
  filename: string;
}

export interface FullCodeRecord {
  full_content: string;
  info: CodeRecord;
}

export interface NewCodeRecord {
  title: string;
  language: string;
  tagItems: string[];
  filename: string;
  full_content: string;
}

export interface CodeRecordView {
  codeRecord: CodeRecord;
  tagViews: TagView[];
}
