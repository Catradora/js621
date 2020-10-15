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
  /**
   * Calls to parent class constructor with state_info.
   * @param stateInfo - A dictionary containing a user-agent, rate-limiter, and username/API key if logged in.
   */
  constructor(stateInfo: StateInfo) {
    super(stateInfo);
  }

  /**
   * Creates a post, given either the URL of an image to download, or a stream of the image file itself.
   * Must provide the file (either through URL or stream), tags, and a rating.
   * @param {[string]} tag_string - a list of strings representing the tags of the post
   * @param {Stream} [file] - optional (if direct_url is provided); a stream of the image file
   * @param {string} [filename] - optional (if direct_url is provided); the name of the image file, including extension.
   * @param {string} rating - one of 's', 'q', or 'e,' representing safe, questionable, and explicit, respectively.
   * @param {string} [direct_url] - optional (if file and filename are provided); the URL of the image to upload
   * @param {string} [source] - optional; the source text for the post
   * @param {string} [description] - optional; the description text for the post
   * @param {number} [parent_id] - optional; the ID of this post's parent post
   * @param {string} [referer_url] - unclear in API documentation
   * @param {string} [md5_confirmation] - optional; the MD5 checksum of the file to be uploaded
   * @param {boolean} [as_pending] - true if pending, false if not.
   * @returns a dictionary containing success if successful, failure if unsuccessful, among other information.
   */
  create = async ({
    /**a list of strings representing the tags of the post */
    tag_string,
    /**optional (if direct_url is provided); a stream of the image file */
    file,
    /**optional (if direct_url is provided); the name of the image file, including extension. */
    filename,
    /**one of 's', 'q', or 'e,' representing safe, questionable, and explicit, respectively. */
    rating,
    /**optional (if file and filename are provided); the URL of the image to upload */
    direct_url,
    /**the source text for the post */
    source,
    /**the description text for the post */
    description,
    /**the ID of this post's parent post */
    parent_id,
    /**unclear in API documentation */
    referer_url,
    /**the MD5 checksum of the file to be uploaded */
    md5_confirmation,
    /**true if pending, false if not. */
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

  /**
   * Updates a given post by its ID. Supply only those parameters to be changed.
   * @param {string} [description] - optional; the description text of the post
   * @param {string} [edit_reason] - optional; the reason for editing the post
   * @param {boolean} [has_embedded_notes] - optional; true if the post has notes embedded in it, false if not
   * @param {boolean} [is_note_locked] - optional; true if notes cannot be submitted, false if they can
   * @param {boolean} [is_rating_locked] - optional; true if the rating cannot be changed, false if it can
   * @param {string} [old_description] - optional; the description of the post prior to being updated
   * @param {number} [old_parent_id] - optional; the ID of the post's parent, prior to being updated
   * @param {string} [old_rating] - optional; one of 's', 'q', or 'e', representing safe, questionable, or explicit, respectively
   * @param {number} [parent_id] - optional; the ID number of this post's parent post
   * @param {number} post_id - the ID number of the post to update
   * @param {string} [rating] - optional; one of 's', 'q', or 'e', representing safe, questionable, or explicit, respectively
   * @param {[string]} [source_diff] - optional; a list of strings representing changes to the post's sources
   * @param {[string]} [tag_string_diff] - optional; a list of strings representing changes to the post's tags
   * @returns unknown; API documentation unclear
   */
  update = async ({
    /**the description text of the post */
    description,
    /**the reason for editing the post */
    edit_reason,
    /**true if the post has notes embedded in it, false if not */
    has_embedded_notes,
    /**true if notes cannot be submitted, false if they can */
    is_note_locked,
    /**true if the rating cannot be changed, false if it can */
    is_rating_locked,
    /**the description of the post prior to being updated */
    old_description,
    /**the ID of the post's parent, prior to being updated */
    old_parent_id,
    /**one of 's', 'q', or 'e', representing safe, questionable, or explicit, respectively */
    old_rating,
    /**the ID number of this post's parent post */
    parent_id,
    /**the ID number of the post to update */
    post_id,
    /**one of 's', 'q', or 'e', representing safe, questionable, or explicit, respectively */
    rating,
    /**a list of strings representing changes to the post's sources */
    source_diff,
    /**a list of strings representing changes to the post's tags */
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

  /**
   * Lists posts, as filtered by arguments
   * @param {number} [limit] - optional; the number of posts to return. All requests with a limit greater than 320 default to 320.
   * @param {[string]} [tags] - optional; a list of tags to filter the post, as you would type into e621.net. (Note: tags like "order:score" work)
   * @param {number} [page] - optional; the page number of posts to return (if limit is 320, each 320 posts will flow onto another page).
   * @param {number} [before_page] - optional; used to filter by post ID number. Whatever is provided for before_page will limit posts returned to post ID numbers lesser
   * @param {number} [after_page] - optional; the inverse of before_page; lists posts with post ID's higher than the after_page provided.
   * @returns a JSON array containing a list of posts, and information corresponding to those posts (e.g. ID, url, size, etc.)
   */
  list = async ({
    /**the number of posts to return. All requests with a limit greater than 320 default to 320. */
    limit,
    /**a list of tags to filter the post, as you would type into e621.net. (Note: tags like "order:score" work) */
    tags,
    /**the page number of posts to return (if limit is 320, each 320 posts will flow onto another page). */
    page,
    /**used to filter by post ID number. Whatever is provided for before_page will limit posts returned to post ID numbers lesser */
    before_page,
    /**the inverse of before_page; lists posts with post ID's higher than the after_page provided. */
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

  /**
   * Given one or all arguments, returns a list of flags related to the post/creator
   * @param {number} [post_id] - optional; the ID of the post whose flags are to be returned
   * @param {number} [creator_id] - optional; the ID of the flag's creator
   * @param {string} [creator_name] - optional; the name of the flag's creator
   */
  list_flags = async ({
    /**the ID of the post whose flags are to be returned */
    post_id,
    /**the ID of the flag's creator */
    creator_id,
    /**the name of the flag's creator */
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

  /**
   * Creates a flag for a given post
   * @param {number} post_id - the ID of the post for which the flag is to be created
   * @param {string} reason_name - the reason for creating the flag, e.g. "inferior"
   * @param {number} [parent_id] - optional; the ID of the superior post, when flagging the post as inferior
   */
  create_flag = async ({
    /**the ID of the post for which the flag is to be created */
    post_id,
    /**the reason for creating the flag, e.g. "inferior" */
    reason_name,
    /**the ID of the superior post, when flagging the post as inferior */
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

  /**
   * Votes on a post
   * @param {number} post_id - the ID of the post on which to vote
   * @param {number} score - 1 to upvote, -1 to downvote
   * @param {boolean} [no_unvote] - optional; true has this score replace the old score (e.g. if previously downvoted, upvoting with no_unvote being false simply reverts the vote to 0)
   * @returns a json dictionary with information about the post's vote, e.g. the number of upvotes, downvotes, and the user's score.
   */
  vote = async ({
    /**the ID of the post on which to vote */
    post_id,
    /**1 to upvote, -1 to downvote */
    score,
    /**true has this score replace the old score (e.g. if previously downvoted, upvoting with no_unvote being false simply reverts the vote to 0) */
    no_unvote,
  }: PostVoteArgs) => {
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
