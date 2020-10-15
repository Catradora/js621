import { Model } from "./model";
import { StateInfo } from "./interfaces";
import {
  NotesListArgs,
  NotesCreateArgs,
  NotesUpdateArgs,
  NotesRevertArgs,
} from "./argumentTypes";

export class Notes extends Model {
  /**
   * Calls to parent class constructor with state_info.
   * @param stateInfo - A dictionary containing a user-agent, rate-limiter, and username/API key if logged in.
   */
  constructor(stateInfo: StateInfo) {
    super(stateInfo);
  }

  /**
   * Gathers a list of notes, as filtered through parameters.
   * @param {string} [body_matches] - optional; query string to match the note body against. Permits wildcards, e.g. "horse*"
   * @param {number} [post_id] - optional; the ID number of the post to which the note corresponds.
   * @param {[string]} [post_tags_match] - optional; a list of strings representing tags the note's corresponding post should match. Permits wildcards, e.g. "horse*"
   * @param {string} [creator_name] - optional; the username of the note's creator
   * @param {number} [creator_id] - optional; the ID number of the note's creator
   * @param {boolean} [is_active] - optional; true if the note is active, false if not
   * @param {number} [limit] - optional; the number of notes to return. limited to a maximum of 1,000; calls over 1,000 will simply return 1,000 results.
   * @returns a dictionary of information about the note, e.g. it's ID, created_at, updated_at, etc.
   */
  list = async ({
    /**query string to match the note body against. Permits wildcards, e.g. "horse*"*/
    body_matches,
    /**the ID number of the post to which the note corresponds.*/
    post_id,
    /**a list of strings representing tags the note's corresponding post should match. Permits wildcards, e.g. "horse*" */
    post_tags_match,
    /**the username of the note's creator*/
    creator_name,
    /**the ID number of the note's creator */
    creator_id,
    /** true if the note is active, false if not*/
    is_active,
    /** the number of notes to return. limited to a maximum of 1,000; calls over 1,000 will simply return 1,000 results.*/
    limit,
  }: NotesListArgs) => {
    let query_args = {} as any;
    let query_url: string;

    if (limit !== undefined) {
      if (limit > 1000) {
        query_args["limit"] = 1000;
      } else {
        query_args["limit"] = limit!;
      }
    }
    if (body_matches !== undefined) {
      query_args["search[body_matches]"] = body_matches!;
    }
    if (creator_id !== undefined) {
      query_args["search[creator_id]"] = creator_id!;
    }
    if (creator_name !== undefined) {
      query_args["search[creator_name]"] = creator_name!;
    }
    if (is_active !== undefined) {
      query_args["search[is_active]"] = is_active!;
    }
    if (post_id !== undefined) {
      query_args["search[post_id]"] = post_id!;
    }
    if (post_tags_match !== undefined) {
      query_args["search[post_tags_match]"] = post_tags_match!.join(" ");
    }
    query_url = "notes.json?" + this.generate_query_url(query_args);

    return this.submit_request({ query_url: query_url, method: "get" });
  };

  /**
   * Create a new note. All arguments are required.
   * @param {number} post_id - the ID number of the post to which the note corresponds
   * @param {number} x - x coordinate of the note's top-left corner, as measured in pixels from the top left corner of the post
   * @param {number} y - y coordinate of the note's top-left corner, as measured in pixels from the top left corner of the post
   * @param {number} width - the width of the note's box
   * @param {number} height - the height of the note's box
   * @param {string} body - the text body of the note
   * @returns a dictionary of information about the note, e.g. it's ID, created_at, updated_at, etc.
   */
  create = async ({
    /**the ID number of the post to which the note corresponds*/
    post_id,
    /**x coordinate of the note's top-left corner, as measured in pixels from the top left corner of the post*/
    x,
    /**y coordinate of the note's top-left corner, as measured in pixels from the top left corner of the post*/
    y,
    /**the height of the note's box */
    width,
    /** the width of the note's box*/
    height,
    /**the text body of the note */
    body,
  }: NotesCreateArgs) => {
    if (!this.is_logged_in()) {
      throw new Error("Must be logged in to create a note.");
    }

    let query_args = {} as any;
    let query_url: string;

    query_args["note[body]"] = body;
    query_args["note[height]"] = height;
    query_args["note[post_id]"] = post_id;
    query_args["note[width]"] = width;
    query_args["note[x]"] = x;
    query_args["note[y]"] = y;
    query_url = "notes.json?" + this.generate_query_url(query_args);

    return this.submit_request({ query_url: query_url, method: "post" });
  };

  /**
   * Updates given information about a note, given it's ID. All arguments are required.
   * @param {number} note_id - the ID number of the note to update.
   * @param {number} x - x coordinate of the note's top-left corner, as measured in pixels from the top left corner of the post
   * @param {number} y - y coordinate of the note's top-left corner, as measured in pixels from the top left corner of the post
   * @param {number} width - the width of the note's box
   * @param {number} height - the height of the note's box
   * @param {string} body - the text body of the note
   * @returns a dictionary of information about the note, e.g. it's ID, created_at, updated_at, etc.
   */
  update = async ({
    /**the ID number of the note to update.*/
    note_id,
    /** x coordinate of the note's top-left corner, as measured in pixels from the top left corner of the post*/
    x,
    /** y coordinate of the note's top-left corner, as measured in pixels from the top left corner of the post*/
    y,
    /** the width of the note's box*/
    width,
    /** the height of the note's box*/
    height,
    /** the text body of the note*/
    body,
  }: NotesUpdateArgs) => {
    if (!this.is_logged_in()) {
      throw new Error("Must be logged in to update a note.");
    }
    const query_args = {} as any;
    let query_url: string = "notes/" + note_id + ".json?";

    query_args["note[body]"] = body;
    query_args["note[height]"] = height;
    query_args["note[width]"] = width;
    query_args["note[x]"] = x;
    query_args["note[y]"] = y;

    query_url += this.generate_query_url(query_args);
    return this.submit_request({ query_url: query_url, method: "put" });
  };

  /**
   * Given a note's ID, deletes the note.
   * @param {number} note_id - the ID number of the note to delete.
   */
  delete = async (note_id: number) => {
    if (!this.is_logged_in()) {
      throw new Error("Must be logged in to delete a note.");
    }
    this.submit_request({
      query_url: "notes/" + note_id + ".json?",
      method: "delete",
    });
  };

  /**
   * Given a note's version_id, reverts the note to the state of that version.
   * @param {number} note_id - the ID number of the note
   * @param {number} version_id - the version number of the note
   */
  revert = async ({
    /**the ID number of the note*/
    note_id,
    /** the version number of the note*/
    version_id,
  }: NotesRevertArgs) => {
    if (!this.is_logged_in()) {
      throw new Error("Must be logged in to revert a note.");
    }
    const query_url: string =
      "notes/" + note_id + "/revert.json?version_id=" + version_id;

    return this.submit_request({ query_url: query_url, method: "put" });
  };
}
