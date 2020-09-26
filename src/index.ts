import { Posts } from "./models/posts";
import { StateInfo } from "./models/interfaces";
import Bottleneck from "bottleneck";

export class JS621 {
  public posts: Posts;

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

  private update_state_info() {
    this.stateInfo = {
      ratelimiter: this.ratelimiter,
      userAgent: this.userAgent,
      username: this.username,
      api_key: this.api_key,
    };
  }

  private setup_models() {
    this.posts = new Posts(this.stateInfo);
  }
}
