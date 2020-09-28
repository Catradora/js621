jest.mock("axios");

import { Posts } from "../models/posts";
import { StateInfo } from "../models/interfaces";
import Bottleneck from "bottleneck";
import { mocked } from "ts-jest/utils";
import axios, { AxiosResponse } from "axios";

let test_state_info: StateInfo;
let testPosts: Posts;
let axiosResponse: AxiosResponse;

describe("model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    test_state_info = {
      ratelimiter: new Bottleneck({ minTime: 0 }),
      userAgent: "email@website.com",
    };
    axiosResponse = {
      data: {},
      status: 200,
      statusText: "OK",
      config: {},
      headers: {},
    };
  });

  it("should instantiate with the correct state_info", () => {
    testPosts = new Posts(test_state_info);
    expect(testPosts.stateInfo).toBe(test_state_info);
  });

  it("should reject uploading a post without being logged in", () => {
    //Arrange
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";
    testPosts = new Posts(test_state_info);
    mocked(axios).mockResolvedValue(axiosResponse); //Mocking axios function rather than a method

    //Act
    testPosts.create({
      direct_url: "https://fileurl.ext",
      tag_string: ["image", "file"],
      rating: "s",
    });

    //Assert
    expect(axios).toHaveBeenCalledWith({
      baseURL: "https://www.e621.net/",
      headers: { "User-Agent": "email@website.com" },
      auth: { username: "test_username", password: "test_api_key" },
      method: "post",
      url:
        "uploads.json?upload[tag_string]=image file&upload[direct_url]=https://fileurl.ext&upload[rating]=s",
    });
  });
});
