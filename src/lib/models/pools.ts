import { Model } from "./model";
import { StateInfo } from "./interfaces";
import {
  PoolsListArgs,
  PoolsCreateArgs,
  PoolsUpdateArgs,
  PoolsRevertArgs,
} from "./argumentTypes";

export class Pools extends Model {
  /**
   * Calls to parent class constructor with state_info.
   * @param stateInfo - A dictionary containing a user-agent, rate-limiter, and username/API key if logged in.
   */
  constructor(stateInfo: StateInfo) {
    super(stateInfo);
  }

  /**
   * Finds a list of posts, as filtered by given arguments
   * @param {string} name_matches - a string matching the name of the pools. Permits wildcards, e.g. "horse*"
   * @param {number} id - the ID of the pool
   * @param {string} description_matches - a string matching the description of the pools. Permits wildcards, e.g. "horse*"
   * @param {string} creator_name - the name of the pool's creator
   * @param {number} creator_id - the ID of the pool's creator.
   * @param {boolean} is_active - true if the pool is active, false if not.
   * @param {boolean} is_deleted - true if the pool is deleted, false if not.
   * @param {string} category - one of 'series' or 'collection' depending on the type of pool
   * @param {string} order - the order of the returned pools, one of 'name', 'created_at', 'updated_at', or 'post_count'. Default is 'updated_at' if not specified.
   * @param {number} limit - the number of pools to return; all requests over 1,000 default to a maximum of 1,000 per the API specification.
   * @returns a JSON dictionary containing information about the pools, e.g. their ID, name, created_at, etc.
   */
  list = async ({
    /**a string matching the name of the pools. Permits wildcards, e.g. "horse*"*/
    name_matches,
    /**the ID of the pool*/
    id,
    /**a string matching the description of the pools. Permits wildcards, e.g. "horse*"*/
    description_matches,
    /**the name of the pool's creator*/
    creator_name,
    /**the ID of the pool's creator.*/
    creator_id,
    /**true if the pool is active, false if not.*/
    is_active,
    /**true if the pool is deleted, false if not.*/
    is_deleted,
    /**one of 'series' or 'collection' depending on the type of pool*/
    category,
    /**the order of the returned pools, one of 'name', 'created_at', 'updated_at', or 'post_count'. Default is 'updated_at' if not specified.*/
    order,
    /**the number of pools to return; all requests over 1,000 default to a maximum of 1,000 per the API specification.*/
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

  /**
   * Creates a new pool. Only a name is required.
   * @param {string} name - the name of the pool
   * @param {string} [description] - optional; the description text of the pool
   * @param {string} [category] - optional; one of "series" or "collection" depending on the type of pool
   * @param {boolean} [is_locked] - optional; true if locked, false if not
   * @returns a JSON dictionary containing information about the pools, e.g. their ID, name, created_at, etc.
   */
  create = async ({
    /**the name of the pool*/
    name,
    /**the description text of the pool */
    description,
    /**one of "series" or "collection" depending on the type of pool*/
    category,
    /**true if locked, false if not*/
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
    if (description !== undefined) {
      query_args["pool[description]"] = description!;
    } else {
      query_args["pool[description]"] = "";
    }

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

  /**
   * Updates a pool. Provide only those parameters which are to be updated.
   * @param {number} id - the ID of the pool to update
   * @param {string} [name] - the name of the pool
   * @param {string} [description] - the description text of the pool
   * @param {[number]} [post_ids] - an array of ID numbers of posts to include in the pool
   * @param {boolean} [is_active] - true if the pool is active, false if not.
   * @param {string} [category] - one of "series" or "collection" depending on the type of pool
   * @returns a JSON dictionary containing information about the pools, e.g. their ID, name, created_at, etc.
   */
  update = async ({
    /**the ID of the pool to update */
    id,
    /**the name of the pool*/
    name,
    /**the description text of the pool */
    description,
    /**an array of ID numbers of posts to include in the pool */
    post_ids,
    /**true if the pool is active, false if not. */
    is_active,
    /**one of "series" or "collection" depending on the type of pool */
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

  /**
   * Reverts a pool to a given prior version of itself
   * @param {number} id - the ID of the pool
   * @param {number} version_id - the version ID to which the pool should be reverted
   */
  revert = async ({
    /**the ID of the pool */
    id,
    /**the version ID to which the pool should be reverted */
    version_id,
  }: PoolsRevertArgs) => {
    if (!this.is_logged_in()) {
      throw new Error("Must be logged in to revert a pool.");
    }
    const query_url: string =
      "pools/" + id + "/revert.json?version_id=" + version_id;

    this.submit_request({ query_url: query_url, method: "put" });
  };
}
