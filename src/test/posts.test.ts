import { Posts } from "../models/posts";
import { StateInfo } from "../models/interfaces";
import Bottleneck from "bottleneck";
import FormData from "form-data";
import * as fs from "fs";

//Set up mocking of FormData, since we don't really want it to create a new FormData object
const mockAppend = jest.fn();
jest.mock("form-data", () => {
  return jest.fn().mockImplementation(() => {
    return {
      append: mockAppend,
    };
  });
});

//Setup global variables
let test_state_info: StateInfo;
let testPosts: Posts;

describe("posts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    test_state_info = {
      ratelimiter: new Bottleneck({ minTime: 0 }),
      userAgent: "email@website.com",
    };
  });

  it("should instantiate with the correct state_info", () => {
    testPosts = new Posts(test_state_info);
    expect(testPosts.stateInfo).toBe(test_state_info);
  });

  it("should upload a post given username, api_key, and a direct_url", async () => {
    //Arrange

    //Login
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";

    //Create testPosts object, mock out call to "submit_request"
    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    //Act
    await testPosts.create({
      direct_url: "https://fileurl.ext",
      tag_string: ["image", "file"],
      rating: "s",
    });

    //Assert
    expect(testPosts.submit_request).toHaveBeenCalledWith({
      query_url:
        "uploads.json?upload[direct_url]=https://fileurl.ext&upload[rating]=s&upload[source]=&upload[tag_string]=image file",
      method: "post",
    });
  });

  it("should submit post requests with form data with logging in", async () => {
    //Arrange

    //Login
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";

    //Create a stream
    const stream = fs.createReadStream("./src/test/fixtures/fakefile.png");

    //Setup Posts object, and FormData
    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    let formData: FormData = new FormData();
    formData.append("fakefile.png", stream);

    //Act
    await testPosts.create({
      tag_string: ["horse", "tail"],
      rating: "s",
      file: stream,
      filename: "fakefile.png",
    });

    expect(testPosts.submit_request).toHaveBeenCalledWith({
      query_url:
        "uploads.json?upload[rating]=s&upload[source]=&upload[tag_string]=horse tail",
      method: "post",
      multipart: formData,
    });
  });

  it("should reject submitting a post without login information", async () => {
    return true;
  });
});
