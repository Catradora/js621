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

export interface PostListFlagsArgs {
  post_id?: number;
  creator_id?: number;
  creator_name?: string;
}

export interface PostCreateFlagArgs {
  post_id?: number;
  reason_name?: string;
  parent_id?: number;
}

export interface PostVoteArgs {
  post_id: number;
  score: 1 | -1;
  no_unvote?: boolean;
}

export interface TagListArgs {
  name_matches?: string;
  category?: string;
  order?: "date" | "count" | "name";
  hide_empty?: boolean;
  has_wiki?: boolean;
  has_artist?: boolean;
  limit?: number;
  page?: number;
  before_page?: number;
  after_page?: number;
}
