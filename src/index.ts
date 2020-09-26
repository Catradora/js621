import { Posts } from "./models/posts";
import { StateInfo } from "./models/interfaces";
import Bottleneck from "bottleneck";
import { Notes } from "./models/notes";
import { Pools } from "./models/pools";
import { TagAliases } from "./models/tagAliases";
import { Tags } from "./models/tags";

export class JS621 {
  public posts: Posts;
  public notes: Notes;
  public pools: Pools;
  public tagAliases: TagAliases;
  public tags: Tags;

  private stateInfo = {} as StateInfo;
  private ratelimiter: Bottleneck;
  private userAgent: string;
  private username: string;
  private api_key: string;

  constructor(userAgent: string, username?: string, api_key?: string) {
    this.userAgent = userAgent;
    this.ratelimiter = new Bottleneck({ minTime: 1000 });
    if (username) this.username = username;
    if (api_key) this.api_key = api_key;

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

  private setup_models = () => {
    this.posts = new Posts(this.stateInfo);
    this.notes = new Notes(this.stateInfo);
    this.pools = new Pools(this.stateInfo);
    this.tagAliases = new TagAliases(this.stateInfo);
    this.tags = new Tags(this.stateInfo);
  };

  public login = (username: string, api_key: string) => {
    this.stateInfo.username = username;
    this.stateInfo.api_key = api_key;
  };

  public logout = () => {
    this.stateInfo.username = undefined;
    this.stateInfo.api_key = undefined;
  };
}
