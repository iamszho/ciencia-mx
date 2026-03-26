export type DCCreator = string | { '@id'?: string; '#text': string };

export interface RecordItem {
  creator: string;
  date: string;
  datestamp: string;
  description: string;
  format: string;
  id: string;
  identifier: string[];
  repository: string;
  rights: string[];
  setSpec: string[];
  subject: string[];
  subject_other?: string[];
  title: string;
  type: string;
  slug: string;
}

export interface AdvancedQuery {
  title: string;
  creator: string;
  subject: string;
  description: string;
  date: string;
}

export interface SearchRecords {
  count: number;
  results: RecordItem[];
}

export interface Resource {
  title: string;
  creator: string | string[];
  date: string;
  description: string;
  format: string[];
  id: number;
  identifier: string[];
  language: string;
  repository: string;
  rights: string[];
  slug: string;
  subject: string[];
  subject_other?: string[];
  type: string;
};

export interface searchParams {
  q?: string;
  title?: string;
  creator?: string;
  subject?: string;
  description?: string;
  date?: string;
}
