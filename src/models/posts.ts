import { StateInfo } from "./interfaces";
import {
  PostCreateArgs,
  PostListArgs,
  PostUpdateArgs,
  PostListFlagsArgs,
  PostCreateFlagArgs,
  PostVoteArgs,
} from "./argumentTypes";
import { Model } from "./model";
import FormData from "form-data";
import * as fs from "fs";

export class Posts extends Model {
  constructor(stateInfo: StateInfo) {
    super(stateInfo);
  }

  create = async ({
    tag_string,
    file,
    filename,
    rating,
    direct_url,
    source,
    description,
    parent_id,
    referer_url,
    md5_confirmation,
    as_pending,
  }: PostCreateArgs) => {
    //Raise an error if not logged in
    if (!this.is_logged_in()) {
      throw new Error(
        "Must provide both username and api_key to create a post"
      );
    }

    const query_args = {} as any;
    let query_url: string;
    let formData: FormData | undefined = undefined;

    if (as_pending !== undefined) {
      query_args["upload[as_pending]"] = as_pending;
    }

    if (description !== undefined) {
      query_args["upload[description]"] = description;
    }

    if (this.is_direct_url(file, filename, direct_url)) {
      query_args["upload[direct_url]"] = direct_url!;
    } else {
      formData = new FormData();
      formData.append(filename!, file!);
    }

    if (md5_confirmation !== undefined) {
      query_args["upload[md5_confirmation]"] = md5_confirmation;
    }

    if (parent_id !== undefined) {
      query_args["upload[parent_id]"] = parent_id;
    }

    query_args["upload[rating]"] = rating;

    if (referer_url !== undefined) {
      query_args["upload[referer_url]"] = referer_url;
    }

    query_args["upload[source]"] = this.parse_source(source);

    let tags: string = tag_string.join(" ");
    query_args["upload[tag_string]"] = tags;

    query_url = "uploads.json?" + this.generate_query_url(query_args);

    return this.submit_request({
      query_url: query_url,
      method: "post",
      multipart: formData,
    });
  };

  update = async ({
    description,
    edit_reason,
    has_embedded_notes,
    is_note_locked,
    is_rating_locked,
    old_description,
    old_parent_id,
    old_rating,
    parent_id,
    post_id,
    rating,
    source_diff,
    tag_string_diff,
  }: PostUpdateArgs) => {
    if (!this.is_logged_in()) {
      throw new Error(
        "Must provide both username and api_key to update a post"
      );
    }

    const query_args = {} as any;
    let query_url: string;
    let query_url_base: string = "posts/" + post_id! + ".json?";

    if (description !== undefined) {
      query_args["post[description]"] = description!;
    }
    if (edit_reason !== undefined) {
      query_args["post[edit_reason]"] = edit_reason!;
    }
    if (has_embedded_notes !== undefined) {
      query_args["post[has_embedded_notes]"] = has_embedded_notes!;
    }
    if (is_note_locked !== undefined) {
      query_args["post[is_note_locked]"] = is_note_locked!;
    }
    if (is_rating_locked !== undefined) {
      query_args["post[is_rating_locked]"] = is_rating_locked!;
    }
    if (old_description !== undefined) {
      query_args["post[old_description]"] = old_description!;
    }
    if (old_parent_id !== undefined) {
      query_args["post[old_parent_id]"] = old_parent_id!;
    }
    if (old_rating !== undefined) {
      query_args["post[old_rating]"] = old_rating!;
    }
    if (parent_id !== undefined) {
      query_args["post[parent_id]"] = parent_id!;
    }
    if (rating !== undefined) {
      query_args["post[rating]"] = rating!;
    }
    if (source_diff !== undefined) {
      query_args["post[source_diff]"] = source_diff!.join("\n");
    }
    if (tag_string_diff !== undefined) {
      query_args["post[tag_string_diff]"] = tag_string_diff!.join(" ");
    }

    query_url = query_url_base + this.generate_query_url(query_args);

    return this.submit_request({
      query_url: query_url,
      method: "patch",
    });
  };

  list = async ({
    limit,
    tags,
    page,
    before_page,
    after_page,
  }: PostListArgs) => {
    const query_args = {} as any;
    let query_url: string;

    if (limit !== undefined) {
      if (limit > 320) {
        query_args["limit"] = 320;
      } else {
        query_args["limit"] = limit!;
      }
    }
    if (page !== undefined) {
      if (page > 750) {
        query_args["page"] = 750!;
      } else {
        query_args["page"] = page!;
      }
    } else if (before_page !== undefined) {
      query_args["page"] = "b" + before_page!;
    } else if (after_page !== undefined) {
      query_args["page"] = "a" + after_page!;
    }
    if (tags !== undefined) {
      query_args["tags"] = tags!.join(" ");
    }
    query_url = "posts.json?" + this.generate_query_url(query_args);

    return this.submit_request({ query_url: query_url, method: "get" });
  };

  list_flags = async ({
    post_id,
    creator_id,
    creator_name,
  }: PostListFlagsArgs) => {
    const query_args = {} as any;
    let query_url: string;

    if (creator_id !== undefined) {
      query_args["search[creator_id]"] = creator_id!;
    }
    if (creator_name !== undefined) {
      query_args["search[creator_name]"] = creator_name!;
    }
    if (post_id !== undefined) {
      query_args["search[post_id]"] = post_id!;
    }

    query_url = "post_flags.json?" + this.generate_query_url(query_args);

    return this.submit_request({ query_url: query_url, method: "get" });
  };

  create_flag = async ({
    post_id,
    reason_name,
    parent_id,
  }: PostCreateFlagArgs) => {
    if (!this.is_logged_in()) {
      throw new Error("Must provide both username and api_key to flag a post");
    }
    const query_args = {} as any;
    let query_url: string;

    query_args["post_flag[post_id]"] = post_id!;

    if (parent_id !== undefined) {
      query_args["post_flag[parent_id]"] = parent_id!;
    }

    query_args["post_flag[reason_name]"] = reason_name!;

    query_url = "post_flags.json?" + this.generate_query_url(query_args);

    return this.submit_request({ query_url: query_url, method: "post" });
  };

  vote = async ({ post_id, score, no_unvote }: PostVoteArgs) => {
    if (!this.is_logged_in()) {
      throw new Error("Must provide both username and api_key to flag a post");
    }
    let query_url: string = "posts/" + post_id + "/votes.json?";

    if (no_unvote !== undefined) {
      query_url += "no_unvote=" + no_unvote + "&";
    }

    query_url += "score=" + score;

    return this.submit_request({ query_url: query_url, method: "post" });
  };

  private is_logged_in = () => {
    if (
      this.stateInfo.username === undefined ||
      this.stateInfo.api_key === undefined
    ) {
      return false;
    }
    return true;
  };

  private is_direct_url = (
    file?: fs.ReadStream,
    filename?: string,
    direct_url?: string
  ) => {
    //Determine if even elligible
    if (
      file === undefined &&
      filename === undefined &&
      direct_url === undefined
    ) {
      throw new Error(
        "Either file and filename must be supplied, or direct_url must be supplied. Not none."
      );
    } else if (file !== undefined && filename === undefined) {
      throw new Error(
        "If file is provided, so too must filename be provided, e.g. 'image.png'"
      );
    } else if (file === undefined && filename !== undefined) {
      throw new Error(
        "If filename is provided, so too must file be provided, as an fs.ReadStream object."
      );
    }

    if (direct_url !== undefined) {
      return true;
    } else {
      return false;
    }
  };

  private parse_source = (source?: string) => {
    if (source === undefined) {
      return "";
    } else {
      return source!;
    }
  };
}
