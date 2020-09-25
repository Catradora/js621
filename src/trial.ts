import { Model } from "./models/model";
import Bottleneck from "bottleneck";

const stateInfo = {
  rateLimiter: new Bottleneck({
    mintime: 1000,
    maxConcurrent: 1,
  }),
  userAgent: "hood.noah@gmail.com | JS621 Dev",
  username: "pye621Dev",
  api_key: "67d73dd26774e29e8c41a6924053e7e8",
};

let modelObj: Model = new Model(stateInfo);

async function makeRequest() {
  try {
    let response = await modelObj.submit_throttled_request(
      "https://www.e621.net/posts.json?",
      "get"
    );
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
}

makeRequest();
