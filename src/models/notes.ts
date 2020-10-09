import { Model } from "./model";
import { StateInfo } from "./interfaces";
import { NotesListArgs } from "./argumentTypes";

export class Notes extends Model {
  constructor(stateInfo: StateInfo) {
    super(stateInfo);
  }

  list = async ({
    body_matches,
    post_id,
    post_tags_match,
    creator_name,
    creator_id,
    is_active,
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
      query_args["search[post_tags_match]"] = post_tags_match!;
    }
    query_url = "notes.json?" + this.generate_query_url(query_args);

    return this.submit_request({ query_url: query_url, method: "get" });
  };
}
