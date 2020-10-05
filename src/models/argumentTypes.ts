import { Method } from "./interfaces";
import fs from "fs";
import FormData from "form-data";

export interface ModelRequestArgs {
  query_url: string;
  method: Method;
  multipart?: FormData;
}

export interface PostCreateArgs {
  tag_string: string[];
  file?: fs.ReadStream;
  filename?: string;
  rating: "s" | "q" | "e";
  direct_url?: string;
  source?: string;
  description?: string;
  parent_id?: number;
  referer_url?: string;
  md5_confirmation?: string;
  as_pending?: boolean;
}

export interface PostUpdateArgs {
  description?: string;
  edit_reason?: string;
  has_embedded_notes?: boolean;
  is_note_locked?: boolean;
  is_rating_locked?: boolean;
  old_description?: string;
  old_parent_id?: number;
  old_rating?: "s" | "q" | "e";
  parent_id?: number;
  post_id: number;
  rating?: "s" | "q" | "e";
  source_diff?: string[];
  tag_string_diff?: string[];
}

export interface PostListArgs {
  limit?: number;
  tags?: string[];
  page?: number;
  before_page?: number;
  after_page?: number;
}
