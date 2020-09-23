import Bottleneck from "bottleneck";

export class JS621 {
  // Create a rate-limiter object, limiting to 1 concurrent request every 1000 ms (1 second).
  private rateLimiter: Bottleneck = new Bottleneck({
    mintime: 1000,
    maxConcurrent: 1,
  });
  private userAgent: string;

  constructor(userAgent: string) {
    this.userAgent = userAgent;
  }
}
