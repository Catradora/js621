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
  category?:
    | "general"
    | "artist"
    | "copyright"
    | "character"
    | "species"
    | "meta"
    | "lore";
  order?: "date" | "count" | "name";
  hide_empty?: boolean;
  has_wiki?: boolean;
  has_artist?: boolean;
  limit?: number;
  page?: number;
  before_page?: number;
  after_page?: number;
}

export interface TagAliasListArgs {
  name_matches?: string;
  status?:
    | "approved"
    | "active"
    | "pending"
    | "deleted"
    | "retired"
    | "processing"
    | "queued";
  order?: "status" | "created_at" | "updated_at" | "name" | "tag_count";
  antecedent_tag_category?:
    | "general"
    | "artist"
    | "copyright"
    | "character"
    | "species"
    | "meta"
    | "lore";
  consequent_tag_category?:
    | "general"
    | "artist"
    | "copyright"
    | "character"
    | "species"
    | "meta"
    | "lore";
  limit?: number;
  page?: number;
  before_page?: number;
  after_page?: number;
}

export interface NotesListArgs {
  body_matches?: string;
  post_id?: number;
  post_tags_match?: string;
  creator_name?: string;
  creator_id?: number;
  is_active?: boolean;
  limit?: number;
}

export interface NotesCreateArgs {
  post_id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  body: string;
}

export interface NotesUpdateArgs {
  note_id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  body: string;
}

export interface NotesRevertArgs {
  note_id: number;
  version_id: number;
}

export interface PoolsListArgs {
  name_matches?: string;
  id?: number;
  description_matches?: string;
  creator_name?: string;
  creator_id?: number;
  is_active?: boolean;
  is_deleted?: boolean;
  category?: "series" | "collection";
  order?: "name" | "created_at" | "updated_at" | "post_count";
  limit?: number;
}

export interface PoolsCreateArgs {
  name: string;
  description: string;
  category?: "series" | "collection";
  is_locked?: boolean;
}

export interface PoolsUpdateArgs {
  id: number;
  name?: string;
  description?: string;
  post_ids?: number[];
  is_active?: boolean;
  category?: "series" | "collection";
}

export interface PoolsRevertArgs {
  id: number;
  version_id: number;
}
