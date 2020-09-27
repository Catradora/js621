import { Model } from "../models/model";
import { expect } from "chai";
import Bottleneck from "bottleneck";

describe("model", () => {
  it("should initialize with stateInfo as provided", () => {
    let expected_state_info = {
      ratelimiter: new Bottleneck({ minTime: 1000 }),
      userAgent: "email@website.com",
      userName: "username",
      api_key: "12345abcde",
    };
    let model = new Model(expected_state_info);
    expect(model.stateInfo).to.equal(expected_state_info);
  });

  it("should submit get requests to a given URL without logging in", () => {});
});
