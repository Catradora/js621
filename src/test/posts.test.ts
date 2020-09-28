jest.mock("Model");

import { Posts } from "../models/posts";
import Bottleneck from "bottleneck";
//import { mocked } from "ts-jest/utils";
//import { Model } from "../models/model";
import { StateInfo } from "../models/interfaces";

let test_state_info: StateInfo;
let testPosts: Posts;

describe("Posts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    test_state_info = {
      userAgent: "test_user_agent",
      ratelimiter: new Bottleneck({ minTime: 0 }),
    };
  });

  it("should instantiate with the correct stateInfo", () => {
    testPosts = new Posts(test_state_info);
  });
});
