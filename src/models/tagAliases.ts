import { Model } from "./model";
import { StateInfo } from "./interfaces";
import { TagAliasListArgs } from "./argumentTypes";

export class TagAliases extends Model {
  constructor(stateInfo: StateInfo) {
    super(stateInfo);
  }

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
