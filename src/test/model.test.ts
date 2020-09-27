import { Model } from "../models/model";
import { expect } from "chai";
import Bottleneck from "bottleneck";
import { mock, instance } from "ts-mockito";
import axios from "axios";

let expected_state_info = {
  ratelimiter: new Bottleneck({ minTime: 1000 }),
  userAgent: "email@website.com",
  userName: "username",
  api_key: "12345abcde",
};

const mockedAxios = mock(axios);

let testModel: Model;

describe("model", () => {
  beforeEach(() => {
    testModel = new Model(instance(mockedAxios), expected_state_info);
  });

  it("should initialize with stateInfo as provided", () => {
    let model = new Model(expected_state_info);
    expect(model.stateInfo).to.equal(expected_state_info);
  });

  it("should submit get requests to a given URL without logging in", () => {});
});
