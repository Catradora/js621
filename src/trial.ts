import { Model } from "./models/model";
import Bottleneck from "bottleneck";
import { ChallengeProblemSolver } from "./ChallengeProblemSolver";

const limiter: Bottleneck = new Bottleneck({ mintime: 1000, maxconcurrent: 1 });

const stateInfo = {
  rateLimiter: limiter,
  userAgent: "hood.noah@gmail.com | JS621 Dev",
  // username: "pye621Dev",
  // api_key: "67d73dd26774e29e8c41a6924053e7e8",
};

let modelObj: Model = new Model(stateInfo);

async function makeRequest(url: string) {
  try {
    let response = await modelObj.submit_request(url, "get");
    console.log(response.data.posts[0].id + "|" + Date.now());
    //console.log(Date.now());
  } catch (err) {
    console.log(err);
  }
}

const wrappedRequest = limiter.wrap(makeRequest);

let start = new Date();
for (let i = 0; i < 2; i++) {
  let result = wrappedRequest("https://www.e621.net/posts.json?limit=1");
  console.log(result.data.posts[0].id + "|" + Date.now());
}
let end = new Date();
let timeDifferenceSeconds = (end.getTime() - start.getTime()) / 1000;
console.log(timeDifferenceSeconds);
