import { Model } from "./models/model";
import Bottleneck from "bottleneck";

const limiter: Bottleneck = new Bottleneck({
  mintime: 1000,
  maxconcurrent: 1,
});

const stateInfo = {
  rateLimiter: limiter,
  userAgent: "hood.noah@gmail.com | JS621 Dev",
  // username: "pye621Dev",
  // api_key: "67d73dd26774e29e8c41a6924053e7e8",
};

let modelObj: Model = new Model(stateInfo);

async function makeRequests() {
  for (let i = 0; i < 10; i++) {
    try {
      let result = await modelObj.submit_request(
        "https://www.e621.net/posts.json?limit=1",
        "get"
      );
      console.log(result.data.posts[0].id + "|" + Date.now());
    } catch (err) {
      console.log(err);
    }
  }
}
makeRequests();
