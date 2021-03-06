jest.mock("axios");

import { Model } from "../lib/models/model";
import Bottleneck from "bottleneck";
import { mocked } from "ts-jest/utils";
import axios, { AxiosResponse } from "axios";
import { StateInfo } from "../lib/models/interfaces";
import FormData from "form-data";
import * as fs from "fs";

let expected_state_info: StateInfo;
let testModel: Model;
let axiosResponse: AxiosResponse;

describe("model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    expected_state_info = {
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

  it("should initialize with stateInfo as provided", () => {
    testModel = new Model(expected_state_info);
    expect(testModel.stateInfo).toEqual(expected_state_info);
  });

  it("should submit get requests to a given URL without logging in", async () => {
    mocked(axios).mockResolvedValue(axiosResponse); //Mocking axios function rather than a method

    testModel = new Model(expected_state_info);

    //Act
    await testModel.submit_request({
      query_url: "posts.json?limit=1",
      method: "get",
    });

    //Assert
    expect(axios).toHaveBeenCalledWith({
      baseURL: "https://www.e621.net/",
      method: "get",
      url: "posts.json?limit=1",
      headers: { "User-Agent": "email@website.com" },
    });
  });

  it("should submit get requests to a given URL with logging in", async () => {
    //Login
    expected_state_info.username = "test_username";
    expected_state_info.api_key = "test_api_key";

    mocked(axios).mockResolvedValue(axiosResponse); //Mocking axios function rather than a method

    testModel = new Model(expected_state_info);

    //Act
    await testModel.submit_request({
      query_url: "posts.json?limit=1",
      method: "get",
    });

    //Assert
    expect(axios).toHaveBeenCalledWith({
      baseURL: "https://www.e621.net/",
      headers: { "User-Agent": "email@website.com" },
      auth: { username: "test_username", password: "test_api_key" },
      method: "get",
      url: "posts.json?limit=1",
    });
  });

  it("should submit post requests with form data with logging in", async () => {
    //Login
    expected_state_info.username = "test_username";
    expected_state_info.api_key = "test_api_key";

    mocked(axios).mockResolvedValue(axiosResponse); //Mocking axios function rather than a method

    testModel = new Model(expected_state_info);
    let formData: FormData = new FormData();
    formData.append(
      "fakefile.png",
      fs.createReadStream("./fixtures/fakefile.png")
    );

    //Act
    await testModel.submit_request({
      query_url:
        "uploads.json?upload[tag_string]=horse tail&upload[rating]=s&upload[source]=",
      method: "post",
      multipart: formData,
    });

    //Assert
    expect(axios).toHaveBeenCalledWith({
      baseURL: "https://www.e621.net/",
      headers: {
        "User-Agent": "email@website.com",
        "Content-Type": "multipart/form-data",
      },
      data: formData,
      auth: { username: "test_username", password: "test_api_key" },
      method: "post",
      url:
        "uploads.json?upload[tag_string]=horse tail&upload[rating]=s&upload[source]=",
    });
  });

  it("should submit post requests with form data without logging in", async () => {
    mocked(axios).mockResolvedValue(axiosResponse); //Mocking axios function rather than a method

    testModel = new Model(expected_state_info);
    let formData: FormData = new FormData();
    formData.append(
      "fakefile.png",
      fs.createReadStream("./fixtures/fakefile.png")
    );

    //Act
    await testModel.submit_request({
      query_url:
        "uploads.json?upload[tag_string]=horse tail&upload[rating]=s&upload[source]=",
      method: "post",
      multipart: formData,
    });

    //Assert
    expect(axios).toHaveBeenCalledWith({
      baseURL: "https://www.e621.net/",
      headers: {
        "User-Agent": "email@website.com",
        "Content-Type": "multipart/form-data",
      },
      data: formData,
      method: "post",
      url:
        "uploads.json?upload[tag_string]=horse tail&upload[rating]=s&upload[source]=",
    });
  });

  it("should return false if not logged in", () => {
    //Arrange
    testModel = new Model({
      ratelimiter: new Bottleneck({ minTime: 0 }),
      userAgent: "test_useragent",
    });
    //Assert
    expect(testModel.is_logged_in()).toEqual(false);
  });

  it("should return true if logged in", () => {
    //Arrange
    testModel = new Model({
      ratelimiter: new Bottleneck({ minTime: 0 }),
      userAgent: "test_useragent",
      username: "test_username",
      api_key: "test_api_key",
    });
    //Assert
    expect(testModel.is_logged_in()).toEqual(true);
  });

  it("should download an image file as given by its URL", async () => {
    //Arrange
    mocked(axios).mockResolvedValue(axiosResponse); //Mocking axios function rather than a method

    testModel = new Model(expected_state_info);

    //Act
    await testModel.schedule_download("https://www.website.com/file.ext");

    //Assert
    expect(axios).toHaveBeenCalledWith({url:"https://www.website.com/file.ext", method:"get", responseType: "stream"});
  });
});
