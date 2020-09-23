import Bottleneck from "bottleneck";

export class JS621 {
  private rateLimiter: Bottleneck = new Bottleneck({
    mintime: 1000,
    maxConcurrent: 1,
  });
  constructor() {}
}
