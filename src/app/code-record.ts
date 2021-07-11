export interface CodeRecord {
  uid: string,
  title: string,
  language: string,
  preview_content: string,
  author_name: string,
  tagItems: string[],
  filename: string
}

export interface FullCodeRecord {
  full_content: string,
  info: CodeRecord
}

export interface NewCodeRecord {
  title: string,
  language: string,
  tagItems: string[],
  filename: string,
  full_content: string
}
