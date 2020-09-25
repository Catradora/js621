import Bottleneck from "bottleneck";
import { Posts } from "./models/posts";
import { StateInfo } from "./models/stateinfo";

export class JS621 {
  public posts: Posts;

  private stateInfo = {} as StateInfo;
  private rateLimiter: Bottleneck;
  private userAgent: string;
  private username: string;
  private api_key: string;

  constructor(userAgent: string, username?: string, api_key?: string) {
    this.rateLimiter = new Bottleneck({
      mintime: 1000,
      maxConcurrent: 1,
    });
    this.userAgent = userAgent;
    if (username) this.username = username;
    if (api_key) this.api_key = api_key;

    this.update_state_info();
  }

  update_state_info() {
    this.stateInfo = {
      rateLimiter: this.rateLimiter,
      userAgent: this.userAgent,
      username: this.username,
      api_key: this.api_key,
    };
  }
}
