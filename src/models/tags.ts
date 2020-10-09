import { Model } from "./model";
import { StateInfo } from "./interfaces";
import { TagListArgs } from "./argumentTypes";

export class Tags extends Model {
  constructor(stateInfo: StateInfo) {
    super(stateInfo);
  }

  list = async ({
    name_matches,
    category,
    order,
    hide_empty,
    has_wiki,
    has_artist,
    limit,
    page,
    before_page,
    after_page,
  }: TagListArgs) => {
    let query_args = {} as any;
    let query_url: string;

    if (limit !== undefined) {
      if (limit! > 1000) {
        query_args["limit"] = 1000;
      } else {
        query_args["limit"] = limit!;
      }
    }

    if (page !== undefined) {
      query_args["page"] = page!;
    } else if (before_page !== undefined) {
      query_args["page"] = "b" + before_page!;
    } else if (after_page !== undefined) {
      query_args["page"] = "a" + after_page!;
    }

    if (category !== undefined) {
      query_args["search[category]"] = category!;
    }
    if (has_artist !== undefined) {
      query_args["search[has_artist]"] = has_artist!;
    }
    if (has_wiki !== undefined) {
      query_args["search[has_wiki]"] = has_wiki!;
    }
    if (hide_empty !== undefined) {
      query_args["search[hide_empty]"] = hide_empty!;
    }
    if (name_matches !== undefined) {
      query_args["search[name_matches]"] = name_matches!;
    }
    if (order !== undefined) {
      query_args["search[order]"] = order!;
    }

    query_url = "tags.json?" + this.generate_query_url(query_args);

    return this.submit_request({ query_url: query_url, method: "get" });
  };
}
