import { Model } from "./model";
import { StateInfo } from "./interfaces";
import { PoolsListArgs } from "./argumentTypes";

export class Pools extends Model {
  constructor(stateInfo: StateInfo) {
    super(stateInfo);
  }

  list = async ({
    name_matches,
    id,
    description_matches,
    creator_name,
    creator_id,
    is_active,
    is_deleted,
    category,
    order,
    limit,
  }: PoolsListArgs) => {
    const query_args = {} as any;
    let query_url: string;

    if (limit !== undefined) {
      if (limit > 1000) {
        query_args["limit"] = 1000;
      } else {
        query_args["limit"] = limit!;
      }
    }
    if (category !== undefined) {
      query_args["search[category]"] = category!;
    }
    if (creator_id !== undefined) {
      query_args["search[creator_id]"] = creator_id!;
    }
    if (creator_name !== undefined) {
      query_args["search[creator_name]"] = creator_name!;
    }
    if (description_matches !== undefined) {
      query_args["search[description_matches]"] = description_matches!;
    }
    if (id !== undefined) {
      query_args["search[id]"] = id!;
    }
    if (is_active !== undefined) {
      query_args["search[is_active]"] = is_active!;
    }
    if (is_deleted !== undefined) {
      query_args["search[is_deleted]"] = is_deleted!;
    }
    if (name_matches !== undefined) {
      query_args["search[name_matches]"] = name_matches!;
    }
    if (order !== undefined) {
      query_args["search[order]"] = order!;
    }
    query_url = "pools.json?" + this.generate_query_url(query_args);

    return this.submit_request({ query_url: query_url, method: "get" });
  };
}
