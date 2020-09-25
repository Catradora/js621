import Bottleneck from "bottleneck";

export interface StateInfo {
  rateLimiter: Bottleneck;
  userAgent: string;
  username?: string;
  api_key?: string;
}
