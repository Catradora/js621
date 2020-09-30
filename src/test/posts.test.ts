jest.mock("axios");

import { Posts } from "../models/posts";
import { StateInfo } from "../models/interfaces";
import Bottleneck from "bottleneck";
import { mocked } from "ts-jest/utils";
import axios, { AxiosResponse } from "axios";
import FormData from "form-data";
import { PassThrough } from "stream";
import * as fs from "fs";

jest.mock("fs");

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

  it("should upload a post given username, api_key, and a direct_url", async () => {
    //Arrange
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";
    testPosts = new Posts(test_state_info);
    mocked(axios).mockResolvedValue(axiosResponse); //Mocking axios function rather than a method

    //Act
    await testPosts.create({
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
        "uploads.json?upload[direct_url]=https://fileurl.ext&upload[rating]=s&upload[source]=&upload[tag_string]=image file",
    });
  });

  it("should upload a post given username, api_key, and a file", async () => {
    //Arrange

    //Login, set up posts object
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";
    testPosts = new Posts(test_state_info);

    //Mock out axios with a generic response
    mocked(axios).mockResolvedValue(axiosResponse); //Mocking axios function rather than a method

    //Set up a dummy stream
    let mockReadable: PassThrough = new PassThrough();
    let mockFilePath: string = "/filename.png";

    //Mock out fs.createReadStream to return our dummy stream
    mocked(fs).createReadStream.mockReturnValueOnce(mockReadable);
    let stream = fs.createReadStream(mockFilePath);

    let expected_data: FormData = new FormData();
    expected_data.append("./fixtures/fakefile.png", stream);

    //Act
    await testPosts.create({
      file: stream,
      tag_string: ["image", "file"],
      rating: "s",
      filename: "fakefile.png",
    });

    //Assert
    expect(axios).toHaveBeenCalledWith({
      baseURL: "https://www.e621.net/",
      data: expected_data,
      headers: {
        "User-Agent": "email@website.com",
        "Content-Type": "multipart/form-data",
      },
      auth: { username: "test_username", password: "test_api_key" },
      method: "post",
      url:
        "uploads.json?upload[filename]=fakefile.png&upload[rating]=s&upload[source]=&upload[tag_string]=image file",
    });
  });
});
