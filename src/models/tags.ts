import { Model } from "./model";
import { StateInfo } from "./interfaces";
import { TagListArgs } from "./argumentTypes";

export class Tags extends Model {
  /**
   * Calls to parent class constructor with state_info.
   * @param stateInfo - A dictionary containing a user-agent, rate-limiter, and username/API key if logged in.
   */
  constructor(stateInfo: StateInfo) {
    super(stateInfo);
  }

  /**
   * Produces a list of tags, filtered by parameters given
   * @param {string} [name_matches] - optional; a string against which to match the tags. Permits wildcards, e.g. "horse*"
   * @param {string} [category] - optional; the category to which the tag belongs: one of 'general', 'artist', 'copyright', 'character', 'species', 'meta', or 'lore'
   * @param {string} [order] - optional; the order of tags returned: one of 'date', 'count', 'name.'
   * @param {boolean} [hide_empty] - optional; whether to hide empty tags (true), or to show empty tags (false)
   * @param {boolean} [has_wiki] - optional; whether the tag has a wiki (true), or not (false)
   * @param {boolean} [has_artist] - optional; whether there is an artist associated with the tag (true), or not (false)
   * @param {number} [limit] - optional; the number of tags to return. Requests of limit greater than 1,000 default to a maximum of 1,000.
   * @param {number} [before_page] - optional; limits returned tags to ID numbers lesser than before_page
   * @param {number} [after_page] - optional; limits returned tags to ID numbers greater than after_page
   * @returns a JSON dictionary of tags, containing information thereabout (e.g. id, name, post_count, etc.)
   */
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
      query_args["search[category]"] = this.parse_category(category!);
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

  private parse_category(category: string) {
    const valid_categories: { [index: string]: number } = {
      general: 0,
      artist: 1,
      copyright: 3,
      character: 4,
      species: 5,
      meta: 7,
      lore: 8,
    };
    return valid_categories[category];
  }
}
