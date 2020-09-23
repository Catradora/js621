import Bottleneck from "bottleneck";

export class JS621 {
  private stateInfo = {};
  private rateLimiter: Bottleneck = new Bottleneck({
    mintime: 1000,
    maxConcurrent: 1,
  });
  private userAgent: string;
  private username: string;
  private api_key: string;

  constructor(userAgent: string, username?: string, api_key?: string) {
    this.userAgent = userAgent;
    if (username) this.username = username;
    if (api_key) this.api_key = api_key;

    this.stateInfo = {
      ratelimiter: this.rateLimiter,
      userAgent: this.userAgent,
      username: this.username,
      api_key: this.api_key,
    };
  }
}
