import { Model } from "./model";
import { StateInfo } from "./interfaces";
import { TagAliasListArgs } from "./argumentTypes";

export class TagAliases extends Model {
  /**
   * Calls to parent class constructor with state_info.
   * @param stateInfo - A dictionary containing a user-agent, rate-limiter, and username/API key if logged in.
   */
  constructor(stateInfo: StateInfo) {
    super(stateInfo);
  }

  /**
   * Gets a list of tag aliases, as filtered by parameters
   * @param {string} [name_matches] - optional; a string against which to match the tag_alias. Permits wildcards, e.g. "horse*"
   * @param {string} [status] - optional; one of 'approved', 'active', 'pending', 'deleted', 'retired', 'processing', 'queued', or 'blank'.
   * @param {string} [order] - optional; one of 'status', 'created_at', 'updated_at', 'name', or 'tag_count.' Default, if not provided, is 'status'.
   * @param {string} [antecedent_tag_category] - optional; the tag category to which the original tag belonged: one of 'approved', 'active', 'pending', 'deleted', 'retired', 'processing', or 'queued'.
   * @param {string} [consequent_tag_category] - optional; the tag catgeory to which the new tag belongs: one of 'approved', 'active', 'pending', 'deleted', 'retired', 'processing', or 'queued'.
   * @param {number} [limit] - optional; the number of tag_aliases to return; limits greater than 1,000 default to a maximum of 1,000, per the API.
   * @param {number} [page] - optional; the page of tag_aliases to return (pages are defined as traunches of size 'limit.' Defaults to 75.)
   * @param {number} [before_page] - optional; limits results to ID numbers lesser than before_page
   * @param {number} [after_page] - optional; limits results to ID numbers greater than after_page
   * @returns a JSON dictionary listing tag_aliases meeting the criteria given, and information thereabout (e.g. id, status, etc.)
   */
  list = async ({
    name_matches,
    status,
    order,
    antecedent_tag_category,
    consequent_tag_category,
    limit,
    page,
    before_page,
    after_page,
  }: TagAliasListArgs) => {
    let query_args = {} as any;
    let query_url: string;

    if (limit !== undefined) {
      if (limit > 1000) {
        query_args["limit"] = 1000;
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

    if (antecedent_tag_category !== undefined) {
      query_args["search[antecedent_tag][category]"] = this.parse_category(
        antecedent_tag_category!
      );
    }
    if (consequent_tag_category !== undefined) {
      query_args["search[consequent_tag][category]"] = this.parse_category(
        consequent_tag_category!
      );
    }

    if (name_matches !== undefined) {
      query_args["search[name_matches]"] = name_matches!;
    }
    if (order !== undefined) {
      query_args["search[order]"] = order!;
    }

    if (status !== undefined) {
      query_args["search[status]"] = status!;
    }

    query_url = "tag_aliases.json?" + this.generate_query_url(query_args);
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
