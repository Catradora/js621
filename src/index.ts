// node_modules
import Bottleneck from "bottleneck";

// typing helpers
import { StateInfo } from "./models/interfaces";
import { JS621ConstructorArgs } from "./models/argumentTypes";

// models
import { Notes } from "./models/notes";
import { Pools } from "./models/pools";
import { Posts } from "./models/posts";
import { TagAliases } from "./models/tagAliases";
import { Tags } from "./models/tags";

export class JS621 {
  public notes: Notes;
  public pools: Pools;
  public posts: Posts;
  public tagAliases: TagAliases;
  public tags: Tags;

  private stateInfo = {} as StateInfo;
  private ratelimiter: Bottleneck;
  private userAgent: string;
  private username: string;
  private api_key: string;

  /**
   * JS621 class; entrypoint into the JS621 API wrapper.
   * @param {string} userAgent - A descriptive user-agent. Should contain contact info.
   * @returns {JS621} - A JS621 object, from which calls to the e621.net api can be made by accessing its attributes.
   */
  constructor(userAgent: string) {
    this.userAgent = userAgent;
    this.ratelimiter = new Bottleneck({ minTime: 1000 });

    this.update_state_info();
    this.setup_models();
  }

  private update_state_info = () => {
    this.stateInfo = {
      ratelimiter: this.ratelimiter,
      userAgent: this.userAgent,
      username: this.username,
      api_key: this.api_key,
    };
  };

  /**
   * Creates new models; used primarily to keep state_info synchronized across all worker objects.
   */
  private setup_models = () => {
    this.notes = new Notes(this.stateInfo);
    this.pools = new Pools(this.stateInfo);
    this.posts = new Posts(this.stateInfo);
    this.tagAliases = new TagAliases(this.stateInfo);
    this.tags = new Tags(this.stateInfo);
  };

  /**
   * Logs-in to the e621.net API; used to gather results behind universal blacklist,
   * or for any requests which modify data (e.g. voting, creating a post, etc.)
   * @param {string} username - The user's e621.net username.
   * @param {string} api_key - The user's API key, as generated on e621.net's account page.
   */
  public login = (username: string, api_key: string) => {
    this.stateInfo.username = username;
    this.stateInfo.api_key = api_key;

    this.update_state_info();
    this.setup_models();
  };

  /**
   * Logs out of the e621.net API.
   */
  public logout = () => {
    this.stateInfo.username = undefined;
    this.stateInfo.api_key = undefined;

    this.update_state_info();
    this.setup_models();
  };
}
