import { Model } from "./model";
import { StateInfo } from "./interfaces";
import {
  PoolsListArgs,
  PoolsCreateArgs,
  PoolsUpdateArgs,
  PoolsRevertArgs,
} from "./argumentTypes";

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

  create = async ({
    name,
    description,
    category,
    is_locked,
  }: PoolsCreateArgs) => {
    if (!this.is_logged_in()) {
      throw new Error("Must be logged in to create a pool.");
    }
    const query_args = {} as any;
    let query_url: string;

    if (category !== undefined) {
      query_args["pool[category]"] = category!;
    }
    query_args["pool[description]"] = description;
    if (is_locked !== undefined) {
      if (is_locked) {
        query_args["pool[is_locked]"] = 1;
      } else {
        query_args["pool[is_locked]"] = 0;
      }
    }
    query_args["pool[name]"] = name;

    query_url = "pools.json?" + this.generate_query_url(query_args);

    return this.submit_request({ query_url: query_url, method: "post" });
  };

  update = async ({
    id,
    name,
    description,
    post_ids,
    is_active,
    category,
  }: PoolsUpdateArgs) => {
    if (!this.is_logged_in()) {
      throw new Error("Must be logged in to update a pool.");
    }
    const query_args = {} as any;
    let query_url: string;

    query_url = "pools/" + id + ".json?";

    if (category !== undefined) {
      query_args["pool[category]"] = category;
    }
    if (description !== undefined) {
      query_args["pool[description]"] = description!;
    }
    if (is_active !== undefined) {
      if (is_active) {
        query_args["pool[is_active]"] = 1;
      } else {
        query_args["pool[is_active]"] = 0;
      }
    }
    if (name !== undefined) {
      query_args["pool[name]"] = name!;
    }
    if (post_ids !== undefined) {
      query_args["pool[post_ids]"] = post_ids.join(" ")!;
    }
    query_url += this.generate_query_url(query_args);
    return this.submit_request({ query_url: query_url, method: "put" });
  };

  revert = async ({ id, version_id }: PoolsRevertArgs) => {
    if (!this.is_logged_in()) {
      throw new Error("Must be logged in to revert a pool.");
    }
    const query_url: string =
      "pools/" + id + "/revert.json?version_id=" + version_id;

    this.submit_request({ query_url: query_url, method: "put" });
  };
}
